/**
 * LearnSATMath — one-off October cohort catch-up email.
 *
 * Leads who submitted the interest form before the autoresponder was
 * patched to promote the October cohort never got that promo. The list
 * below was filtered from the Tally sheet (Oct/Nov/Dec date, submitted
 * before 2026-08-21, "Yes"/"Maybe" on price, score >= 550, not already
 * enrolled, junk/duplicates removed). Edit it freely.
 *
 * Install: in the same Apps Script project as tally-autoresponder.gs, add a
 * new script file (+ > Script), name it "october-catchup", paste this in.
 * It reuses CONFIG, voiceOf(), deliver() and validEmail() from that file.
 *
 * Run order:
 *   1. Set CONFIG.DRAFT_MODE = true in the autoresponder file, run
 *      sendOctoberCatchup(), read the drafts in Gmail.
 *   2. Delete those drafts, run resetOctoberCatchup(), set DRAFT_MODE =
 *      false, run sendOctoberCatchup() again.
 *
 * Each address is remembered in script properties after a successful send,
 * so re-running never emails anyone twice (resetOctoberCatchup() clears it).
 */

// To: whoever filled out the form; CC: the other party (deliver() handles
// this, plus skipping invalid addresses and dedupe when both are the same).
const CATCHUP_LEADS = [
  { name: 'Risheek'             , parentName: 'Neelima'         , email: 'risheeknagavarapu14@gmail.com' , parentEmail: 'valeti.neelima@gmail.com'   , filledBy: 'student', satDates: 'Oct'           },
  { name: 'joyanna'             , parentName: 'gaurav'          , email: 'joyannamahajan@gmail.com'      , parentEmail: 'raikamahajan25@gamil.com'   , filledBy: 'student', satDates: 'Dec'           },
  { name: 'Annietan'            , parentName: 'Gutan'           , email: 'ananandanna@qq.com'            , parentEmail: 'ananandanna@qq.com'         , filledBy: 'student', satDates: 'Oct'           },
  { name: 'Jas'                 , parentName: 'Harwinder'       , email: 'bajwajasmeet315@gmail.com'     , parentEmail: 'bajwajasmeet315@gmail.com'  , filledBy: 'student', satDates: 'Dec'           },
  { name: 'Prasamsha'           , parentName: 'Thakur Sapkota'  , email: 'prasamshasapkota59@gmail.com'  , parentEmail: 'tsapkota95@yahoo.com'       , filledBy: 'student', satDates: 'Oct'           },
  { name: 'Hamza'               , parentName: 'Mohammed'        , email: 'hamzaguye1@gmail.com'          , parentEmail: 'Mohammedguyeb@gmail.com'    , filledBy: 'student', satDates: 'Oct'           },
  { name: 'aryan'               , parentName: 'vivek'           , email: 'aryan@aryandas.com'            , parentEmail: 'vivekkdas@gmail.com'        , filledBy: 'student', satDates: 'Oct'           },
  { name: 'Evelyn'              , parentName: 'Danielle'        , email: 'evelyn.i.falsini@gmail.com'    , parentEmail: 'dmdowney@gmail.com'         , filledBy: 'student', satDates: 'Oct'           },
  { name: 'deepak poswal'       , parentName: 'shiv'            , email: 'shivaleeka1213@gmail.com'      , parentEmail: 'shivaleeka1216@gmail.com'   , filledBy: 'student', satDates: 'Oct'           },
  { name: 'Mohammed Soliman'    , parentName: 'Helmy'           , email: 'hffiscool@gmail.com'           , parentEmail: 'helmy_soliman@hotmail.com'  , filledBy: 'student', satDates: 'Nov'           },
  { name: 'Sara'                , parentName: 'Preeti Pilare'   , email: 'sara137856@gapps.uwcsea.edu.sg', parentEmail: 'preetipilare@gmail.com'     , filledBy: 'student', satDates: 'Nov'           },
  { name: 'Adnan'               , parentName: 'Maher'           , email: 'ado.kahil19@gmail.com'         , parentEmail: 'kahilmaher@gmail.com'       , filledBy: 'student', satDates: 'Nov, Dec'      },
  { name: 'Hanbyeol Cho'        , parentName: 'Sun Son'         , email: 'frogmc5540@gmail.com'          , parentEmail: 'sonbari0620@gmail.com'      , filledBy: 'student', satDates: 'Oct, Nov, Dec' },
  { name: 'obidjon'             , parentName: 'Adib'            , email: 'obidjongayratov7@gmail.com'    , parentEmail: 'gayratovobidjon1@gmail.com' , filledBy: 'student', satDates: 'Oct'           },
  { name: 'Asqar'               , parentName: 'Anvar'           , email: 'asqarjoniskandarov77@gmail.com', parentEmail: 'anvarpochta84@gmail.com'    , filledBy: 'student', satDates: 'Oct'           },
  { name: 'Kale'                , parentName: 'Matthew'         , email: '-'                             , parentEmail: 'matthewjames92586@gmail.com', filledBy: 'parent' , satDates: 'Dec'           },
  { name: 'Tamara Ponchner'     , parentName: 'Marcos Ponchner' , email: 'tamara.ponchner@gmail.com'     , parentEmail: 'mponchner@multifirio.com'   , filledBy: 'student', satDates: 'Nov'           },
  { name: 'Aurelio Gjoni'       , parentName: 'Aurelio'         , email: 'aureliogjoni89@gmail.com'      , parentEmail: 'aureliogjoni89@gmail.com'   , filledBy: 'student', satDates: 'Oct, Nov'      },
  { name: 'Pinny'               , parentName: 'Adis'            , email: 'Nanapa.peuk@gmail.com'         , parentEmail: 'Adisp.lim@gmail.com'        , filledBy: 'student', satDates: 'Oct'           },
  { name: 'mark'                , parentName: 'moamen'          , email: 'c.r.t.m.f.c@gmail.com'         , parentEmail: 'moamenshebl59@gmail.com'    , filledBy: 'student', satDates: 'Dec'           },
  { name: 'Ariana Quispialaya'  , parentName: 'Ever Quispialaya', email: 'arianaquispialaya@gmail.com'   , parentEmail: 'everusa89@hotmail.com'      , filledBy: 'student', satDates: 'Nov'           },
  { name: 'Adhvait Praveenkumar', parentName: 'Priya Nayar'     , email: 'adipraveenkumar7@gmail.com'    , parentEmail: 'priyapraveen97@gmail.com'   , filledBy: 'student', satDates: 'Oct'           },
];

const CATCHUP_PROP = 'octoberCatchupSent';

/** Sends (or drafts, per CONFIG.DRAFT_MODE) one email per lead. */
function sendOctoberCatchup() {
  const props = PropertiesService.getScriptProperties();
  const done = new Set(JSON.parse(props.getProperty(CATCHUP_PROP) || '[]'));
  let sent = 0;
  CATCHUP_LEADS.forEach((l) => {
    const lead = {
      ...l,
      firstName: capFirst(l.name.split(/\s+/)[0]) || 'there',
      parentFirstName: capFirst(l.parentName.split(/\s+/)[0]),
    };
    const key = (validEmail(lead.email) ? lead.email : lead.parentEmail).toLowerCase();
    if (done.has(key)) return Logger.log('skip (already sent): %s', lead.name);
    try {
      deliver(lead, buildCatchupEmail(lead));
      sent++;
      Logger.log('%s: %s', CONFIG.DRAFT_MODE ? 'drafted' : 'sent', lead.name);
      if (!CONFIG.DRAFT_MODE) {
        done.add(key);
        props.setProperty(CATCHUP_PROP, JSON.stringify([...done]));
      }
    } catch (err) {
      Logger.log('ERROR %s: %s', lead.name, err.message);
      if (/too many times/i.test(err.message)) throw err; // quota: retry tomorrow
    }
  });
  Logger.log('%s %s of %s', CONFIG.DRAFT_MODE ? 'Drafted' : 'Sent', sent, CATCHUP_LEADS.length);
}

// "joyanna" -> "Joyanna"; leaves "deepak poswal" -> "Deepak" etc.
function capFirst(w) {
  return w ? w.charAt(0).toUpperCase() + w.slice(1) : '';
}

/** Forgets who has been sent to, so sendOctoberCatchup() starts over. */
function resetOctoberCatchup() {
  PropertiesService.getScriptProperties().deleteProperty(CATCHUP_PROP);
}

// ---------------------------------------------------------------------------
// Template — voice-aware via voiceOf() from tally-autoresponder.gs
// ---------------------------------------------------------------------------

function buildCatchupEmail(lead) {
  const v = voiceOf(lead);
  // "you'll" / "Kale will"
  const youll = v.isParent ? `${v.you} will` : "you'll";
  // Extra paragraph for leads whose dates are all after October (Nov/Dec):
  // why joining the October cohort now still makes sense.
  const laterDate = CONFIG.COHORT_MONTH_RE.test(lead.satDates)
    ? ''
    : `\n\nI know ${v.your} test date is later in the fall, but I'd still recommend joining this cohort. I can't promise there will be one for ${v.your} exact date, and ${youll} keep access to all 15 hours of recordings and Bedrock Pro after the sessions end, so the weeks before ${v.your} test become review time with everything already in hand.`;

  return {
    subject: `${CONFIG.COHORT_MONTH} SAT Math Masterclass - Spot open!`,
    body: `Hi ${v.greetName},

It's Eric (LearnSATMath on YouTube). A few weeks ago, you filled out the interest form for the SAT Math Masterclass. I wanted to reach back out since the next cohort is about to begin, and spots are still available!

In the Masterclass, ${youll} join 14 other ambitious students all aiming for a 750+. The cohort starts ${CONFIG.COHORT_START} and meets ${CONFIG.COHORT_TIME} through the ${CONFIG.COHORT_MONTH} SAT. There are weekly office hours and ${youll} get a lifetime subscription to Bedrock Pro.${laterDate}

I only take 15 students per cohort and half the spots are already filled, so please sign up sooner rather than later. Here is the enrollment link >> ${CONFIG.STRIPE_LINK} . As a reminder, purchases are fully refundable within 7 days of the first session.

Best,
Eric

P.S. If you have any questions about the class, ${v.your} score, or whether it's the right fit, just reply to this email. I read and answer everything myself!`,
  };
}
