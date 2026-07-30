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

  // The cohort currently enrolling. Later-date leads get the same Stripe
  // link ("start now, or wait for first access to a closer cohort" — same
  // framing as the /masterclass/thanks page).
  STRIPE_LINK: 'https://buy.stripe.com/3cIbIU3n01ov2qs6LM6wE1C',
  COHORT_MONTH: 'September', // used in the enroll email subject + body
  COHORT_LABEL: 'September cohort',
  COHORT_START: 'August 8th', // first session, mentioned in the later-date email

  // Free masterclass intro call — same event the /thanks page embeds.
  CALENDLY_LINK: 'https://calendly.com/eric-wolpert-learnsatmath/masterclass-intro-call',
  // Free 1-on-1 tutoring consult (August-only leads) — same event as the
  // "Book a free call" buttons on /tutoring.
  TUTORING_CALENDLY_LINK: 'https://calendly.com/eric-wolpert-learnsatmath/coaching-call',
  // Free practice-problem site, for out-of-budget leads.
  BEDROCK_LINK: 'https://www.bedrockprep.com/bedrock-100',

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
  tutoring: '1-on-1 tutoring',
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
    wantsTutoring: /^yes/i.test(val(m.tutoring)),
    // Blank/missing answer defaults to student (pre-question submissions).
    filledBy: /parent/i.test(val(m.filledBy)) ? 'parent' : 'student',
  };
}

/**
 * The pricing question has three options (wording may drift; matching is
 * on the stable fragments):
 *   "Yes - I'm ready to enroll!"          -> 'enroll'
 *   "Maybe - I'd like a free call ..."    -> 'call'
 *   "No. It's out of budget."             -> 'no'
 * Unrecognized/blank answers fall back to 'call' (the neutral middle).
 */
function parsePriceTier(raw) {
  if (/ready to enroll/i.test(raw)) return 'enroll';
  if (/^no|out of budget/i.test(raw)) return 'no';
  return 'call';
}

// Anyone whose ONLY selected SAT date is August: the August cohort has
// already started, so they get the 1-on-1 tutoring email instead.
// Matches abbreviated month names too ("Aug 23", "Sep 12", ...).
const COHORT_MONTHS = /(sep|oct|nov|dec)/i;
function isAugustOnly(lead) {
  return /aug/i.test(lead.satDates) && !COHORT_MONTHS.test(lead.satDates);
}

// The Masterclass assumes a ~600 starting score (530–590 is quietly let
// slide). At 520 or below, 1-on-1 tutoring is the honest recommendation —
// in-budget leads with a low current score get routed there instead.
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

function buildFirstEmail(lead) {
  const v = voiceOf(lead);
  const goal = lead.goalScore ? ` Great to hear ${v.youre} aiming for a ${lead.goalScore}!` : '';
  const tutoringPS = lead.wantsTutoring
    ? `\n\nP.S. You mentioned 1-on-1 tutoring. Happy to talk through whether the Masterclass, tutoring, or a mix makes sense for ${v.you}. Just reply here!`
    : '';

  // 1. Out of budget (regardless of dates): point them at Bedrock Prep.
  if (lead.priceTier === 'no') {
    return {
      subject: `Free SAT Math Practice`,
      body: `Hi ${v.greetName},

Thanks for filling out the interest form!${goal}

I completely understand if the masterclass is out of budget. $895 is a real investment!

However, I still want to give you something to help with ${v.your} prep. My platform Bedrock has plenty of high-quality practice problems completely for free. Check it out here >> ${CONFIG.BEDROCK_LINK}

You're still on my list, so if anything changes, just reply to this email and we'll figure something out.

Best,
Eric${tutoringPS}`,
    };
  }

  // 2. Only August selected: that cohort already started; route to 1-on-1.
  if (isAugustOnly(lead)) {
    return {
      subject: `About the August SAT`,
      body: `Hi ${v.greetName},

Thanks for your interest in the SAT Math Masterclass!${goal}

You marked that ${v.youre} taking the August SAT, but unfortunately, the August cohort has already begun and has no spots currently available.

The good news is that 1-on-1 tutoring is always an option! With a test this close, it's honestly the stronger option anyway: we skip what's already solid and focus entirely on ${v.your} greatest weaknesses.

If you'd like to talk through what a 1-on-1 plan would look like, grab a free call here >> ${CONFIG.TUTORING_CALENDLY_LINK}

Best,
Eric`,
    };
  }

  // 2b. In budget but starting at 520 or below: the Masterclass assumes
  // ~600+, so the honest recommendation is 1-on-1 tutoring.
  if (isLowScore(lead)) {
    return {
      subject: `SAT Math Advice`,
      body: `Hi ${v.greetName},

Thanks for filling out the interest form!${goal}

I want to be upfront about the best path forward: the Masterclass is designed for students starting around 600 or higher. It moves fast and covers only the hardest problems.

Starting from ${lead.currentScore}, ${v.you} would get far more from 1-on-1 tutoring. We build the math from the ground up, at the right pace, and every session goes toward ${v.your} specific weaknesses.

If you'd like to talk through what a 1-on-1 plan would look like, grab a free call here >> ${CONFIG.TUTORING_CALENDLY_LINK}

Best,
Eric`,
    };
  }

  // 5/6. Wants a free call: the /thanks page already showed them the
  // Calendly embed, so this is a backstop in case they didn't book.
  if (lead.priceTier === 'call') {
    return {
      subject: `Your free SAT intro call`,
      body: `Hi ${v.greetName},

Thanks for filling out the interest form!${goal} A call is a great next step: 15 minutes and you'll know for sure whether the class is the right fit.

If you already grabbed a time on the confirmation page, you're all set and I'll see you then! If not, here's my calendar >> ${CONFIG.CALENDLY_LINK}

${v.isParent ? `${v.you} is very welcome to join the call. Most of my best calls are with a parent and student together!` : `Parents are very welcome on the call. Most of my best calls are with a parent and student together!`}

Best,
Eric${tutoringPS}`,
    };
  }

  // 3. Ready to enroll + September in their dates: Stripe link.
  if (lead.priceTier === 'enroll' && /sep/i.test(lead.satDates)) {
    return {
      subject: `${CONFIG.COHORT_MONTH} SAT Math Masterclass - Spot open!`,
      body: `Hi ${v.greetName},

Thanks for filling out the masterclass interest form!${goal} I look forward to having ${v.you} join the ${CONFIG.COHORT_LABEL}.

If you already claimed ${v.your} spot on the confirmation page, you're all set! You'll receive everything needed for the class by email before the first session.

If not, here is the enrollment link >> ${CONFIG.STRIPE_LINK}

To keep the class small and personalized, there is a hard cap of 15 students. Recent cohorts have filled up within days, so please enroll sooner rather than later! As a reminder, purchases are fully refundable within 7 days of the first session.

If you have any questions about the class, ${v.your} score, or whether it's the right fit, just reply to this email. I read and answer everything myself!

Best,
Eric${tutoringPS}`,
    };
  }

  // 4. Ready to enroll, later test date: same Stripe link + the
  // "start now or wait for a closer cohort" framing from /thanks.
  if (lead.priceTier === 'enroll' && lead.satDates) {
    return {
      subject: `SAT Math Masterclass - Enrollment is open!`,
      body: `Hi ${v.greetName},

Thanks for filling out the interest form!${goal}

Enrollment is open right now for the next cohort. It starts ${CONFIG.COHORT_START}, with sessions twice a week through the ${CONFIG.COHORT_MONTH} SAT. Even with a later test date, don't procrastinate! The best time to start is always the present. And you'll keep all the materials indefinitely after the sessions end.

If you already claimed ${v.your} spot on the confirmation page, you're all set! If not, here is the enrollment link >> ${CONFIG.STRIPE_LINK}

As a reminder, purchases are fully refundable within 7 days of the first session.

Finally, if you prefer a cohort closer to ${v.your} test date, no action is needed. I'll reach back out when the next cohort opens.

Best,
Eric${tutoringPS}`,
    };
  }

  // 7. Fallback: shouldn't normally hit (blank dates + enroll).
  return {
    subject: `You're on the list`,
    body: `Hi ${v.greetName},

Thanks for filling out the interest form!${goal} You're on my list, and I'll email you everything you need for the cohort ahead of ${v.your} test date.

As always, let me know if you have any questions!

Best,
Eric${tutoringPS}`,
  };
}
