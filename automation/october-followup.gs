/**
 * LearnSATMath — one-off follow-up to the October cohort catch-up emails.
 *
 * Replies IN THREAD to each email sent by october-catchup.gs, telling leads
 * the cohort starts tomorrow and only a few spots are left. Replying rather
 * than sending fresh keeps the original pitch directly above this note.
 *
 * Install: same Apps Script project as tally-autoresponder.gs and
 * october-catchup.gs (+ > Script, name it "october-followup"). It reuses
 * CONFIG, voiceOf(), toHtml(), validEmail() from the autoresponder and
 * CATCHUP_LEADS, capFirst() from the catch-up file.
 *
 * Run order:
 *   1. Set CONFIG.DRAFT_MODE = true in the autoresponder file, run
 *      sendOctoberFollowup(), read the drafts in Gmail + read the log.
 *   2. Delete those drafts, run resetOctoberFollowup(), set DRAFT_MODE =
 *      false, run sendOctoberFollowup() again.
 *
 * Each address is remembered in script properties after a successful send,
 * so re-running never replies twice (resetOctoberFollowup() clears it).
 */

// Anyone sent or CC'd on one of these is skipped — leads who already replied
// or enrolled. Checked against both the CATCHUP_LEADS record and the actual
// To/Cc headers of the sent message, so an address that isn't in the lead
// list still excludes its thread. Note this is the manual list only: anyone
// who wrote back in their thread is skipped automatically (see theyReplied).
const FOLLOWUP_EXCLUDE = [
  'veronica.flaxx@gmail.com',
  'chiarakothleitner@gmail.com',
  'isabellad1120@icloud.com',
  'addiehunt@gmail.com',
  'benminton07@gmail.com',
  'fromemilyliu@gmail.com',
  'jawedmahum@gmail.com',
  'frogmc5540@gmail.com',
  'saif.sid2090@gmail.com',
  'hlucenadarochasi3443@eagle.fgcu.edu',
  'nanapa.peuk@gmail.com',
  'adisp.lim@gmail.com',
].map((e) => e.trim().toLowerCase());

const FOLLOWUP_PROP = 'octoberFollowupSent';

const SPOTS_LEFT = 5;

// The subject october-catchup.gs sent under, and the day it ran. Branch 3 of
// the autoresponder uses this same subject, so the date bound is what keeps
// us from replying to a lead's older first-touch thread instead.
const CATCHUP_SUBJECT = `${CONFIG.COHORT_MONTH} SAT Math Masterclass - Spot open!`;
const CATCHUP_AFTER = '2026/08/24'; // Gmail query bound (catch-up ran 8/25)

// The body says "tomorrow", which is only true the day before this date.
const COHORT_START_DATE = new Date(2026, 7, 29); // Aug 29 2026

/** Replies (or drafts, per CONFIG.DRAFT_MODE) once per non-excluded lead. */
function sendOctoberFollowup() {
  warnIfNotTheDayBefore();
  const me = myEmail();
  const props = PropertiesService.getScriptProperties();
  const done = new Set(JSON.parse(props.getProperty(FOLLOWUP_PROP) || '[]'));
  let sent = 0, skipped = 0, missing = 0;

  CATCHUP_LEADS.forEach((l) => {
    const lead = {
      ...l,
      firstName: capFirst(l.name.split(/\s+/)[0]) || 'there',
      parentFirstName: capFirst(l.parentName.split(/\s+/)[0]),
    };
    const key = (validEmail(lead.email) ? lead.email : lead.parentEmail).toLowerCase();

    if (done.has(key)) return Logger.log('skip (already sent): %s', lead.name);

    // Exclusion pass 1: the lead's own addresses.
    const own = [lead.email, lead.parentEmail].map((e) => String(e).toLowerCase());
    if (own.some((e) => FOLLOWUP_EXCLUDE.includes(e))) {
      skipped++;
      return Logger.log('EXCLUDED (lead address): %s', lead.name);
    }

    const thread = findCatchupThread(lead);
    if (!thread) {
      missing++;
      return Logger.log('NO THREAD FOUND, handle by hand: %s <%s>', lead.name, key);
    }

    // Exclusion pass 2: who the catch-up email actually went to.
    const hit = excludedRecipient(thread);
    if (hit) {
      skipped++;
      return Logger.log('EXCLUDED (thread recipient %s): %s', hit, lead.name);
    }

    // Exclusion pass 3: they wrote back, so a "5 spots left" nudge would land
    // mid-conversation. Handle those by hand.
    if (theyReplied(thread, me)) {
      skipped++;
      return Logger.log('EXCLUDED (replied in thread): %s', lead.name);
    }

    try {
      const body = buildFollowupBody(lead);
      const options = { name: CONFIG.FROM_NAME, htmlBody: toHtml(body) };
      // replyAll keeps the original CC (the other party) on the reply.
      if (CONFIG.DRAFT_MODE) {
        thread.createDraftReplyAll(body, options);
      } else {
        thread.replyAll(body, options);
      }
      sent++;
      Logger.log('%s: %s', CONFIG.DRAFT_MODE ? 'drafted' : 'sent', lead.name);
      if (!CONFIG.DRAFT_MODE) {
        done.add(key);
        props.setProperty(FOLLOWUP_PROP, JSON.stringify([...done]));
      }
    } catch (err) {
      Logger.log('ERROR %s: %s', lead.name, err.message);
      if (/too many times/i.test(err.message)) throw err; // quota: retry tomorrow
    }
  });

  Logger.log(
    '%s %s of %s (%s excluded, %s with no thread)',
    CONFIG.DRAFT_MODE ? 'Drafted' : 'Sent', sent, CATCHUP_LEADS.length, skipped, missing
  );
}

/** Forgets who has been replied to, so sendOctoberFollowup() starts over. */
function resetOctoberFollowup() {
  PropertiesService.getScriptProperties().deleteProperty(FOLLOWUP_PROP);
}

/**
 * The catch-up thread for a lead: sent by me after CATCHUP_AFTER, to or CC'ing
 * one of their addresses, under CATCHUP_SUBJECT. Newest wins if somehow two
 * match. Returns null rather than guessing.
 */
function findCatchupThread(lead) {
  const addrs = [lead.email, lead.parentEmail].filter(validEmail);
  if (!addrs.length) return null;
  const recipients = addrs.map((a) => `to:${a} OR cc:${a}`).join(' OR ');
  // Subject matched loosely in the query (Gmail treats "-" as NOT even inside
  // quotes in some cases) and exactly in code below.
  const query = `in:sent after:${CATCHUP_AFTER} (${recipients}) subject:(masterclass)`;
  const threads = GmailApp.search(query, 0, 20).filter((t) => {
    const first = t.getMessages()[0];
    return first.getSubject().replace(/^\s*(re|fwd):\s*/i, '') === CATCHUP_SUBJECT;
  });
  if (!threads.length) return null;
  return threads.sort((a, b) => b.getLastMessageDate() - a.getLastMessageDate())[0];
}

/** First excluded address appearing in any To/Cc on the thread, or ''. */
function excludedRecipient(thread) {
  const people = thread.getMessages()
    .map((m) => `${m.getTo()},${m.getCc()}`)
    .join(',')
    .toLowerCase();
  return FOLLOWUP_EXCLUDE.find((e) => people.includes(e)) || '';
}

/**
 * Your own address, used to tell your sends apart from their replies. Session
 * returns '' in some contexts, and an empty string would match every From
 * header — silently making theyReplied() always false and skipping nobody.
 * Since that check now gates real sends, fail loudly instead.
 */
function myEmail() {
  const me = (Session.getActiveUser().getEmail() ||
              Session.getEffectiveUser().getEmail() || '').trim().toLowerCase();
  if (!me) throw new Error('Could not determine your Gmail address — aborting rather than sending with the replied-in-thread check disabled.');
  return me;
}

/** True if anyone other than me has written in the thread. */
function theyReplied(thread, me) {
  return thread.getMessages().some((m) => !m.getFrom().toLowerCase().includes(me));
}

/** "starts tomorrow" is a date-dependent claim — say so if the day is wrong. */
function warnIfNotTheDayBefore() {
  const day = 24 * 60 * 60 * 1000;
  const midnight = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const daysOut = Math.round((COHORT_START_DATE - midnight(new Date())) / day);
  if (daysOut !== 1) {
    Logger.log(
      'WARNING: body says the cohort starts "tomorrow", but %s is %s day(s) away. Edit buildFollowupBody() before sending.',
      CONFIG.COHORT_START, daysOut
    );
  }
}

// ---------------------------------------------------------------------------
// Template — short on purpose: the original pitch sits right below it.
// ---------------------------------------------------------------------------

function buildFollowupBody(lead) {
  const v = voiceOf(lead);

  // "you" is the reader in both voices here — the parent is the one deciding.
  const tryIt = v.isParent
    ? `so ${v.you} can sit in on the first two sessions and you can decide afterward whether to stay`
    : 'so you can sit in on the first two sessions and decide afterward if you want to stay';

  return `Hi ${v.greetName},

I wanted to followup since the ${CONFIG.COHORT_LABEL} starts tomorrow, ${CONFIG.COHORT_START}, and there are only ${SPOTS_LEFT} spots left.

If ${v.isParent ? `${v.you} has` : "you've"} been on the fence, I recommend you decide today. Here is the enrollment link >> ${CONFIG.STRIPE_LINK}

As a reminder, purchases are fully refundable within 7 days of the first session, ${tryIt}.

Best,
Eric`;
}
