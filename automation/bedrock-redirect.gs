/**
 * LearnSATMath — one-off "go with Bedrock" email to fall test-takers.
 *
 * Emails every interest-form lead whose SAT dates include November,
 * December or 2027 (and optionally October), pointing them to Bedrock Pro since
 * there's no Masterclass cohort for their date.
 *
 * Skips:
 *   - anyone whose student or parent email is on the "Exclude" tab
 *     (masterclass students + every Stripe customer — keeps those emails out
 *     of this repo). Matching ignores case, Gmail dots and +tags.
 *   - repeat submissions (one email per address, ever)
 *   - rows with no usable email
 *   - anyone who has ever emailed you from either address (they're in a
 *     real conversation with you; follow up by hand)
 *
 * Install: in the same Apps Script project as tally-autoresponder.gs, add a
 * script file named "bedrock-redirect" and paste this in. It reuses CONFIG,
 * getSheet(), mapColumns(), rowToLead(), voiceOf(), validEmail(), deliver()
 * and bedrockProPitch() from that file. Then add a sheet tab named "Exclude"
 * with one email per row in column A (header row optional).
 *
 * Run order:
 *   1. Set CONFIG.DRAFT_MODE = true, run sendBedrockRedirect(), read the
 *      drafts in Gmail and the "Bedrock Status" column on the sheet.
 *   2. Delete the drafts, run resetBedrockDrafts(), set DRAFT_MODE = false.
 *   3. Run setupBedrockDaily() — sends one batch now-ish and one per day
 *      until everyone's done, then removes its own trigger.
 *
 * Progress lives in the "Bedrock Status" column: SENT / DRAFTED are final;
 * SKIP: ... rows are re-evaluated every run (so adding someone to Exclude
 * later still works).
 */

const BEDROCK = {
  // Max emails per run. Each email can count as 2 recipients (parent CC);
  // small daily batches also keep Gmail from flagging the domain.
  BATCH_SIZE: 200,
  // October 3 is days away — Oct-only leads are skipped unless this is true.
  // Leads with Oct AND Nov/Dec always qualify (via the later date).
  INCLUDE_OCT_ONLY: false,
  EXCLUDE_TAB: 'Exclude',
  STATUS_HEADERS: ['Bedrock Status', 'Bedrock Sent At'],
  DAILY_HOUR: 10, // script time zone
  MASTERCLASS_PRICE: '$895',
  PRICE_MONTHLY: '$79',
  PRICE_6MO: '$41.50', // per month on the 6-month plan
};

const BR_MONTHS = [
  { re: /oct/i, label: 'October' },
  { re: /nov/i, label: 'November' },
  { re: /dec/i, label: 'December' },
  { re: /2027/, label: '2027' }, // "your SAT is in 2027"
];

/** Sends (or drafts) up to BATCH_SIZE emails; stamps every eligible-date row. */
function sendBedrockRedirect() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return;
  try {
    const sheet = getSheet();
    const m = mapColumns(sheet);
    const col = bedrockStatusColumns(sheet);
    const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
    const exclude = loadExclude();

    // Every address already emailed (or drafted) in an earlier run.
    const done = new Set();
    rows.forEach((row) => {
      if (/^(SENT|DRAFTED)$/.test(String(row[col.status] || ''))) {
        leadKeys(rowToLead(row, m)).forEach((k) => done.add(k));
      }
    });

    let sent = 0;
    let remaining = 0;
    let quotaHit = false;
    // Skip stamps are buffered and written in one call at the end (hundreds
    // of single-cell writes would blow the 6-minute limit). Sends are also
    // written immediately, so a timeout mid-run can never cause a re-send.
    const out = rows.map((r) => [r[col.status], r[col.sentAt]]);
    const stamp = (i, status) => (out[i] = [status, new Date()]);
    const stampNow = (i, status) => {
      stamp(i, status);
      sheet.getRange(i + 2, col.status + 1, 1, 2).setValues([out[i]]);
    };

    rows.forEach((row, i) => {
      const status = String(row[col.status] || '');
      if (/^(SENT|DRAFTED)$/.test(status)) return;
      const lead = rowToLead(row, m);
      const month = testMonth(lead);
      if (!month) return; // not a fall test-taker — leave the row untouched

      const keys = leadKeys(lead);
      let skip = '';
      if (!keys.length) skip = 'SKIP: no email';
      else if (keys.some((k) => exclude.has(k))) skip = 'SKIP: excluded';
      else if (keys.some((k) => done.has(k))) skip = 'SKIP: duplicate';
      if (skip) {
        if (status !== skip) stamp(i, skip);
        return;
      }
      if (quotaHit || sent >= BEDROCK.BATCH_SIZE) {
        remaining++;
        return;
      }
      if (hasWrittenIn(lead)) {
        if (status !== 'SKIP: has emailed you') stamp(i, 'SKIP: has emailed you');
        return;
      }

      try {
        deliver(lead, buildBedrockRedirectEmail(lead, month));
        keys.forEach((k) => done.add(k));
        stampNow(i, CONFIG.DRAFT_MODE ? 'DRAFTED' : 'SENT');
        sent++;
      } catch (err) {
        if (/too many times/i.test(err.message)) {
          Logger.log('Gmail daily quota hit — stopping; next run continues.');
          quotaHit = true;
          remaining++;
          return;
        }
        stamp(i, 'ERROR: ' + err.message);
      }
    });

    if (out.length) sheet.getRange(2, col.status + 1, out.length, 2).setValues(out);
    Logger.log('%s %s; %s still queued.', CONFIG.DRAFT_MODE ? 'Drafted' : 'Sent', sent, remaining);
    if (!remaining && !CONFIG.DRAFT_MODE) removeBedrockDaily();
  } finally {
    lock.releaseLock();
  }
}

/** Clears DRAFTED stamps after a review pass (delete the Gmail drafts yourself). */
function resetBedrockDrafts() {
  const sheet = getSheet();
  const col = bedrockStatusColumns(sheet);
  const range = sheet.getRange(2, col.status + 1, sheet.getLastRow() - 1, 2);
  const values = range.getValues().map((r) => (r[0] === 'DRAFTED' ? ['', ''] : r));
  range.setValues(values);
}

/** Installs a once-a-day trigger and runs the first batch immediately. */
function setupBedrockDaily() {
  removeBedrockDaily();
  ScriptApp.newTrigger('sendBedrockRedirect').timeBased().everyDays(1).atHour(BEDROCK.DAILY_HOUR).create();
  sendBedrockRedirect();
}

function removeBedrockDaily() {
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'sendBedrockRedirect')
    .forEach((t) => ScriptApp.deleteTrigger(t));
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Finds (or appends) the Bedrock Status / Sent At columns; 0-based indexes. */
function bedrockStatusColumns(sheet) {
  let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  BEDROCK.STATUS_HEADERS.forEach((h) => {
    if (!headers.includes(h)) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue(h);
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    }
  });
  return {
    status: headers.indexOf(BEDROCK.STATUS_HEADERS[0]),
    sentAt: headers.indexOf(BEDROCK.STATUS_HEADERS[1]),
  };
}

/** "John.Doe+sat@Gmail.com" -> "johndoe@gmail.com"; other domains just lowercased. */
function normEmail(e) {
  const s = String(e || '').trim().toLowerCase();
  if (!validEmail(s)) return '';
  const [local, domain] = s.split('@');
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    return local.split('+')[0].replace(/\./g, '') + '@gmail.com';
  }
  return s;
}

function leadKeys(lead) {
  return [...new Set([normEmail(lead.email), normEmail(lead.parentEmail)].filter(Boolean))];
}

function loadExclude() {
  const tab = SpreadsheetApp.getActive().getSheetByName(BEDROCK.EXCLUDE_TAB);
  if (!tab) throw new Error(`Add a "${BEDROCK.EXCLUDE_TAB}" tab (emails in column A) before running.`);
  const set = new Set();
  tab.getRange(1, 1, Math.max(tab.getLastRow(), 1), 1).getValues()
    .forEach((r) => {
      const k = normEmail(r[0]);
      if (k) set.add(k);
    });
  if (set.size === 0) throw new Error(`The "${BEDROCK.EXCLUDE_TAB}" tab is empty.`);
  return set;
}

/** Earliest qualifying test date ("November", "2027"), or '' if the lead doesn't qualify. */
function testMonth(lead) {
  const picked = BR_MONTHS.filter((mo) => mo.re.test(lead.satDates));
  const later = picked.filter((mo) => mo.label !== 'October');
  if (later.length) return later[0].label; // Oct is days away — cite the later date
  return BEDROCK.INCLUDE_OCT_ONLY && picked.length ? 'October' : '';
}

/** True if either address has ever sent you a message. */
function hasWrittenIn(lead) {
  const addrs = [lead.email, lead.parentEmail].filter(validEmail);
  if (!addrs.length) return false;
  return GmailApp.search(addrs.map((a) => `from:${a}`).join(' OR '), 0, 1).length > 0;
}

// ---------------------------------------------------------------------------
// Template
// ---------------------------------------------------------------------------

function buildBedrockRedirectEmail(lead, month) {
  const v = voiceOf(lead);
  // December-or-later test-takers get the 6-month plan's per-month price.
  const price = month === 'December' || month === '2027'
    ? `starts at just ${BEDROCK.PRICE_6MO} a month`
    : `is just ${BEDROCK.PRICE_MONTHLY} a month`;
  // *word* renders italic in the HTML part and plain in the text part.
  const text = `Hi ${v.greetName},

It's Eric (LearnSATMath on YouTube). A while back, you filled out the interest form for the SAT Math Masterclass and mentioned ${v.your} SAT is in ${month}. I wanted to give you an update!

I'm no longer running the Masterclass. Instead, I've turned the *entire* Masterclass curriculum (every conceptual lesson, Desmos trick, and practice problem) into an interactive platform called Bedrock, which over 85,000 students now use!

Bedrock's curriculum adapts to ${v.your} score range and weak spots. Think of it as a self-paced course that gives ${v.you} the same lessons and problems that I'd give to a 1-on-1 student in ${v.isParent ? 'the same' : 'your exact'} position.

The Masterclass was ${BEDROCK.MASTERCLASS_PRICE}, but Bedrock Pro ${price}. If you're interested, you can subscribe here: ${CONFIG.BEDROCK_PRO_LINK}

Best,
Eric

P.S. If you have any questions about the platform, just reply to this email!`;
  return {
    subject: v.isParent ? `${v.your} ${month} SAT` : `Your ${month} SAT`,
    body: text.replace(/\*(\w+)\*/g, '$1'),
    html: toHtml(text).replace(/\*(\w+)\*/g, '<i>$1</i>'),
  };
}
