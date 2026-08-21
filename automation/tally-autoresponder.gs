/**
 * LearnSATMath — Masterclass interest-form autoresponder.
 *
 * Lives in the Apps Script project attached to the Google Sheet that the
 * Tally form (tally.so/r/1Ag044) syncs into. On every new row it sends a
 * personal, plain-text email from your Gmail account, branched on the
 * lead's answers, then marks the row so it's never processed twice.
 *
 * Setup: see automation/README.md in the site repo. Run setup() once.
 */

const CONFIG = {
  // While true, emails are created as Gmail DRAFTS for you to review and
  // send yourself. Flip to false to send automatically.
  DRAFT_MODE: false,

  FROM_NAME: 'Eric Wolpert (LearnSATMath)',

  // The cohort currently enrolling (October). Only leads whose SAT dates
  // include this month get the Stripe link.
  STRIPE_LINK: 'https://buy.stripe.com/8x23cocXA0krd569XY6wE1I',
  COHORT_MONTH: 'October', // used in the enroll email subject + body
  COHORT_LABEL: 'October cohort',
  COHORT_START: 'August 29th', // first session
  COHORT_TIME: 'Saturdays and Sundays, 12:00-1:30 pm ET',
  // Regex fragment that must appear in the lead's SAT dates to be eligible.
  COHORT_MONTH_RE: /oct/i,

  // The cohort that just filled up. Leads whose ONLY date is this month get
  // the "full" email.
  FULL_MONTH_RE: /sep/i,
  FULL_MONTH_LABEL: 'September',

  // Bedrock Pro — the paid subscription to the practice platform. Every
  // non-enrolling branch pitches it.
  BEDROCK_PRO_LINK: 'https://www.bedrockprep.com/pro',
  BEDROCK_PRO_PRICE: '$49/month',

  SITE_MASTERCLASS: 'https://learnsatmath.com/masterclass',
};

// Column-header fragments used to find each answer in the synced sheet.
// If you rename a Tally question, update the fragment here to match.
const COLS = {
  studentName: 'student name',
  studentEmail: 'student email',
  parentName: 'parent name',
  parentEmail: 'parent email',
  currentScore: 'current sat math score',
  goalScore: 'goal sat math score',
  satDates: 'which sat',
  priceOk: 'willing to make this investment',
  filledBy: 'filling', // "Who is filling out this form?"
};

// Bookkeeping columns the script appends to the sheet.
const STATUS_HEADERS = ['Auto Status', 'Auto Sent At'];

/** Run once by hand: installs triggers and forces the auth prompt. */
function setup() {
  ScriptApp.getProjectTriggers().forEach((t) => ScriptApp.deleteTrigger(t));
  const ss = SpreadsheetApp.getActive();
  ScriptApp.newTrigger('processNewRows').forSpreadsheet(ss).onChange().create();
  // Belt-and-braces sweep in case an API insert doesn't fire onChange.
  ScriptApp.newTrigger('processNewRows').timeBased().everyMinutes(10).create();
  processNewRows();
}

function getSheet() {
  // Tally syncs into the first sheet of the spreadsheet.
  return SpreadsheetApp.getActive().getSheets()[0];
}

/** Maps header fragments to 0-based column indexes; adds status columns if missing. */
function mapColumns(sheet) {
  let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  STATUS_HEADERS.forEach((h) => {
    if (!headers.includes(h)) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue(h);
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    }
  });
  const find = (fragment) =>
    headers.findIndex((h) => String(h).toLowerCase().includes(fragment));
  const map = { headers };
  Object.keys(COLS).forEach((key) => (map[key] = find(COLS[key])));
  STATUS_HEADERS.forEach((h) => (map[h] = headers.indexOf(h)));
  return map;
}

function rowToLead(row, m) {
  const val = (idx) => (idx >= 0 ? String(row[idx] || '').trim() : '');
  const name = val(m.studentName);
  const parentName = val(m.parentName);
  return {
    name,
    firstName: name.split(/\s+/)[0] || 'there',
    parentName,
    parentFirstName: parentName.split(/\s+/)[0] || '',
    email: val(m.studentEmail),
    parentEmail: val(m.parentEmail),
    currentScore: val(m.currentScore),
    goalScore: val(m.goalScore),
    satDates: val(m.satDates),
    priceTier: parsePriceTier(val(m.priceOk)),
    // Blank/missing answer defaults to student (pre-question submissions).
    filledBy: /parent/i.test(val(m.filledBy)) ? 'parent' : 'student',
  };
}

/**
 * The pricing question is now Yes / No (wording may drift; matching is on
 * the stable fragments):
 *   "Yes ..." / "...ready to enroll..."   -> 'enroll'
 *   "No ..."  / "...out of budget..."     -> 'no'
 * Unrecognized/blank answers fall back to 'enroll' — the question is
 * required on the form, so a blank only happens if the wording drifts, and
 * the in-budget emails are the safer default (they still pitch Bedrock Pro
 * where relevant).
 */
function parsePriceTier(raw) {
  if (/^no\b|out of budget/i.test(raw)) return 'no';
  return 'enroll';
}

// Date-option parsing. The form's SAT-date checkboxes are Sep / Oct / Nov /
// Dec / 2027 (abbreviated month names like "Sep 12" match too).
const ALL_DATE_RE = /(sep|oct|nov|dec|2027)/gi;
function selectedDates(lead) {
  return (String(lead.satDates).match(ALL_DATE_RE) || []).map((d) => d.toLowerCase());
}
// Only the just-filled cohort's month selected (e.g. September alone).
function isFullMonthOnly(lead) {
  const dates = selectedDates(lead);
  return dates.length > 0 && dates.every((d) => CONFIG.FULL_MONTH_RE.test(d));
}
// The enrolling cohort's month is among their dates (with or without others).
function wantsCohortMonth(lead) {
  return CONFIG.COHORT_MONTH_RE.test(lead.satDates);
}

// The Masterclass assumes a ~600 starting score (530–590 is quietly let
// slide). At 520 or below, building fundamentals on Bedrock Pro is the
// honest recommendation — in-budget leads with a low score get routed there.
const LOW_SCORE_MAX = 520;
function isLowScore(lead) {
  const nums = String(lead.currentScore).match(/\d{3}/g);
  if (!nums) return false; // no parseable score — don't assume
  return Math.max.apply(null, nums.map(Number)) <= LOW_SCORE_MAX;
}

// Typo'd addresses that still contain an "@" (e.g. "name@gmail,com") are
// accepted by Gmail's compose box but rejected by GmailApp.sendEmail, which
// throws. Anything that isn't a clean single-@ address is treated as absent
// so we fall back to the other party rather than blowing up the run.
const EMAIL_RE = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/;
function validEmail(e) {
  return !!e && EMAIL_RE.test(e);
}

/**
 * Voice tokens: each template is written once and rendered in the voice of
 * whoever filled out the form. Student voice reads "you're aiming for a
 * 750"; parent voice reads "Riley's aiming for a 750" and greets the
 * parent by name. Lines that can't be token-swapped cleanly use
 * `v.isParent ? ... : ...` in the templates.
 */
function voiceOf(lead) {
  if (lead.filledBy !== 'parent') {
    return {
      isParent: false,
      greetName: lead.firstName,
      you: 'you', // "rather you prep well"
      your: 'your', // "your test date"
      youre: "you're", // "you're aiming for a 750"
      Youre: "You're", // sentence-initial
    };
  }
  const s = lead.name ? lead.firstName : 'your student';
  const sPoss = lead.name ? `${lead.firstName}'s` : "your student's";
  return {
    isParent: true,
    greetName: lead.parentFirstName || 'there',
    you: s, // "rather Riley prep well"
    your: sPoss, // "Riley's test date"
    youre: sPoss, // "Riley's aiming for a 750" (Riley's = Riley is)
    Youre: sPoss,
  };
}

/** The instant first-touch email. */
function processNewRows() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return;
  try {
    const sheet = getSheet();
    if (sheet.getLastRow() < 2) return;
    const m = mapColumns(sheet);
    const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();

    rows.forEach((row, i) => {
      const status = String(row[m['Auto Status']] || '');
      if (status) return; // already handled
      const lead = rowToLead(row, m);
      if (!validEmail(lead.email) && !validEmail(lead.parentEmail)) {
        sheet.getRange(i + 2, m['Auto Status'] + 1).setValue('SKIPPED_NO_EMAIL');
        return;
      }
      // One bad row must never stall the queue: an uncaught throw here would
      // abort the whole forEach, leave the row unstamped, and make every
      // subsequent run die on the same row. Stamp the failure and move on.
      try {
        const msg = buildFirstEmail(lead);
        deliver(lead, msg);
        sheet.getRange(i + 2, m['Auto Status'] + 1).setValue(CONFIG.DRAFT_MODE ? 'DRAFTED' : 'SENT');
      } catch (err) {
        // Daily send quota is the one failure worth retrying: leave the row
        // unstamped so tomorrow's run picks it up, and stop this run here.
        if (/too many times/i.test(err.message)) throw err;
        sheet.getRange(i + 2, m['Auto Status'] + 1).setValue('ERROR: ' + err.message);
      }
      sheet.getRange(i + 2, m['Auto Sent At'] + 1).setValue(new Date());
    });
  } finally {
    lock.releaseLock();
  }
}

// Mirrors the plain-text body as minimal HTML (like Gmail compose does), so
// the email flows to the reader's full window width instead of being
// hard-wrapped at ~76 characters. Links become clickable; no styling added.
function toHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>')
    .replace(/\n/g, '<br>');
}

function deliver(lead, msg) {
  const options = { name: CONFIG.FROM_NAME, htmlBody: toHtml(msg.body) };
  // To: whoever filled out the form; CC: the other party.
  const parentFilled = lead.filledBy === 'parent';
  const primary = parentFilled ? lead.parentEmail : lead.email;
  const secondary = parentFilled ? lead.email : lead.parentEmail;
  const to = validEmail(primary) ? primary : secondary;
  if (validEmail(secondary) && secondary !== to) options.cc = secondary;
  if (CONFIG.DRAFT_MODE) {
    GmailApp.createDraft(to, msg.subject, msg.body, options);
  } else {
    GmailApp.sendEmail(to, msg.subject, msg.body, options);
  }
}

// ---------------------------------------------------------------------------
// Templates — plain text on purpose; they should read like you typed them.
// ---------------------------------------------------------------------------

/**
 * The Bedrock Pro pitch, shared by every non-enrolling branch. Selling
 * points mirror learnsatmath.com/bedrock and bedrockprep.com/pro.
 */
function bedrockProPitch(opts) {
  const compare = !(opts && opts.compare === false);
  return [
    `Over the past few months, I've been building Bedrock, an SAT Math platform that organizes the entire SAT Math curriculum into 125 problem types. Each one comes with a video lesson from me, and there are hundreds of variations to drill.`,
    compare && `It's more challenging than Khan Academy, more efficient than OnePrep, and more affordable than Princeton Review.`,
    `Bedrock Pro is ${CONFIG.BEDROCK_PRO_PRICE} with no commitment (you can cancel anytime). Get a subscription here! >> ${CONFIG.BEDROCK_PRO_LINK}`,
  ].filter(Boolean).join('\n\n');
}

/** Condensed pitch for emails that already made a primary ask (September-only). */
function bedrockProPitchShort() {
  return `Bedrock is the SAT Math platform I've been building, which condenses the entire SAT Math curriculum into 125 problem types, each with a video lesson from me, plus hundreds of variations to drill. It's ${CONFIG.BEDROCK_PRO_PRICE} with no commitment (you can cancel anytime). Get a subscription here! >> ${CONFIG.BEDROCK_PRO_LINK}`;
}

function buildFirstEmail(lead) {
  const v = voiceOf(lead);
  const goal = lead.goalScore ? ` Great to hear ${v.youre} aiming for a ${lead.goalScore}.` : '';
  // Reply invitations live in a P.S. (the second-most-read line of any
  // email), so each body ends on its actual call to action.
  const bedrockPS = `\n\nP.S. If you have any questions about the platform or ${v.your} prep in general, just reply to this email. I'll try my best to reply!`;
  const cohortPS = `\n\nP.S. If you have any questions about the class, ${v.your} score, or whether it's the right fit, just reply to this email. I read and answer everything myself!`;

  // 1. Out of budget (regardless of dates): Bedrock Pro.
  if (lead.priceTier === 'no') {
    return {
      subject: `SAT Math Advice`,
      body: `Hi ${v.greetName},

Thanks for filling out the interest form!${goal}

I completely understand if the masterclass is out of budget. However, I still want to give ${v.you} something valuable to study with.

${bedrockProPitch()}

Best,
Eric`,
    };
  }

  // 2. In budget but starting at 520 or below: the Masterclass assumes
  // ~600+, so the honest recommendation is to build the foundation first.
  // Checked before the September-only branch so low scorers are never
  // pitched the October cohort.
  if (isLowScore(lead)) {
    return {
      subject: `SAT Math Advice`,
      body: `Hi ${v.greetName},

Thanks for filling out the interest form!${goal}

I want to be upfront about the best path forward: the Masterclass is designed for students starting around 600 or higher. It moves fast and covers only the hardest problems.

Starting from ${lead.currentScore}, ${v.you} would get far more from building the fundamentals first, at the right pace, with a lesson for every problem type. That's exactly what Bedrock Pro is for.

${bedrockProPitch({ compare: false })}

Best,
Eric${bedrockPS}`,
    };
  }

  // 2b. Only the just-filled month selected (September): that cohort is
  // full. Pitch a fall retake + the October cohort (superscoring), with one
  // month of Bedrock Pro as the plan for September itself.
  if (isFullMonthOnly(lead)) {
    return {
      subject: `About the ${CONFIG.FULL_MONTH_LABEL} SAT`,
      body: `Hi ${v.greetName},

Thanks for your interest in the SAT Math Masterclass!${goal}

You marked that ${v.youre} taking the ${CONFIG.FULL_MONTH_LABEL} SAT, but unfortunately, the ${CONFIG.FULL_MONTH_LABEL} cohort is full and has already begun.

Here's my honest recommendation: plan on a retake this fall. Many colleges superscore, so a second sitting is very advantageous. The ${CONFIG.COHORT_LABEL} starts ${CONFIG.COHORT_START} and still has spots available. You can enroll here >> ${CONFIG.STRIPE_LINK}

The class is capped at 15 students and recent cohorts have filled within days. Purchases are fully refundable within 7 days of the first session.

However, if ${v.isParent ? `${v.you} is` : "you're"} unable to retake, I recommend signing up for one month of Bedrock Pro to make the most of the time before ${CONFIG.FULL_MONTH_LABEL}.

${bedrockProPitchShort()}

Best,
Eric${bedrockPS}`,
    };
  }

  // 3. Ready to enroll + the enrolling cohort's month (October) in their
  // dates: Stripe link.
  if (lead.priceTier === 'enroll' && wantsCohortMonth(lead)) {
    return {
      subject: `${CONFIG.COHORT_MONTH} SAT Math Masterclass - Spot open!`,
      body: `Hi ${v.greetName},

Thanks for filling out the masterclass interest form!${goal} I look forward to having ${v.you} join the ${CONFIG.COHORT_LABEL}.

If you already claimed ${v.your} spot on the confirmation page, you're all set! You'll receive everything needed for the class by email before the first session.

If not, here is the enrollment link >> ${CONFIG.STRIPE_LINK}

The cohort starts ${CONFIG.COHORT_START} and meets ${CONFIG.COHORT_TIME}, running twice a week through the ${CONFIG.COHORT_MONTH} SAT. There are weekly office hours and every student gets a lifetime subscription to Bedrock Pro.

To keep the class small and personalized, there is a hard cap of 15 students. Recent cohorts have filled up within days, so please enroll sooner rather than later! As a reminder, purchases are fully refundable within 7 days of the first session.

Best,
Eric${cohortPS}`,
    };
  }

  // 4. Ready to enroll, only later dates (Nov / Dec / 2027): pitch the
  // October cohort now — later cohorts aren't guaranteed, and the materials
  // are theirs to keep.
  if (lead.priceTier === 'enroll' && lead.satDates) {
    return {
      subject: `SAT Math Masterclass - Enroll now for ${CONFIG.COHORT_MONTH}`,
      body: `Hi ${v.greetName},

Thanks for filling out the interest form!${goal}

I'll be straightforward with you: the ${CONFIG.COHORT_LABEL} is the one to join, even with a later test date. I can't promise there will be a cohort for ${v.your} exact date later this year, and the ${CONFIG.COHORT_MONTH} cohort is open right now. It starts ${CONFIG.COHORT_START} and meets ${CONFIG.COHORT_TIME}, twice a week through the ${CONFIG.COHORT_MONTH} SAT.

Starting early is also just the better plan. Even after the sessions end, ${v.isParent ? `${v.you} keeps` : 'you keep'} indefinite access to all 15 hours of recordings and a Bedrock Pro subscription, so the weeks between the last session and ${v.your} test date become review time with everything already in hand. Here is the enrollment link >> ${CONFIG.STRIPE_LINK}

The class is capped at 15 students and recent cohorts have filled within days. Purchases are fully refundable within 7 days of the first session.

Best,
Eric${cohortPS}`,
    };
  }

  // 5. Fallback: shouldn't normally hit (enroll + blank dates). Still on the
  // list, plus the Bedrock Pro pitch.
  return {
    subject: `You're on the list`,
    body: `Hi ${v.greetName},

Thanks for filling out the interest form!${goal} You're on my list, and I'll email you everything you need for the cohort ahead of ${v.your} test date.

In the meantime, the best thing ${v.you} can do is start drilling.

${bedrockProPitch()}

Best,
Eric${bedrockPS}`,
  };
}
