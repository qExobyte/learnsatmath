# Interest-form email automation

Tally form → Google Sheet → Apps Script → personal emails from your Gmail.

The script (`tally-autoresponder.gs`) sends one instant, plain-text,
personally-branched email from your authorized Gmail account (display name
"Eric Wolpert (LearnSATMath)") to every new form submission, CCs the other
party (parent or student), then stamps the row so it's never emailed twice
(it writes `Auto Status` / `Auto Sent At` columns on the sheet).

> **First-touch email only.** There is currently no automatic follow-up or
> reply detection. After the first send, rows are yours to work manually
> (filter the sheet by `Auto Status`).

## One-time setup (~10 minutes)

1. **Connect Tally to Sheets.** In Tally: open the form → Integrations →
   Google Sheets → Connect. This creates a spreadsheet that receives every
   submission as a row.
2. **Submit one test response** to the form (use your own email) so the
   sheet has headers and a row to work with.
3. **Attach the script.** Open the spreadsheet → Extensions → Apps Script.
   Delete the placeholder code, paste in all of `tally-autoresponder.gs`,
   and save.
4. **Run `setup()` once** (select `setup` in the function dropdown → Run).
   Google will ask you to authorize Gmail + Sheets access — approve it.
   This installs two triggers: on-change (instant email on new rows) and a
   10-minute sweep (safety net in case an insert doesn't fire on-change).
5. **Preview before going live.** The script as committed is set to
   `DRAFT_MODE: false`, so it sends immediately. To review wording first,
   set `DRAFT_MODE: true`, submit test responses that hit different branches,
   and read the drafts it creates in your Gmail.
6. **Go live** by setting `DRAFT_MODE` back to `false` and saving. First-
   touch emails then send themselves within seconds of each submission.

## How the branching works

Evaluated top-to-bottom; the first match wins:

| Lead's answers | Email they get |
|---|---|
| Out of budget (said no to the price) | **"Free SAT Math Practice"** — points to the free Bedrock practice site |
| Only an August test date | **"About the August SAT"** — August cohort has started; routes to a free 1-on-1 tutoring call |
| In budget, but current score ≤ 520 | **"SAT Math Advice"** — recommends 1-on-1 tutoring (the Masterclass assumes ~600+) |
| Wants a free call ("Maybe...") | **"Your free SAT intro call"** — masterclass intro-call Calendly link |
| Ready to enroll + a September date | **"September ... Spot open!"** — Stripe enrollment link |
| Ready to enroll + a later date | **"Enrollment is open!"** — same Stripe link, start-now framing |
| Ready to enroll, no date given | **"You're on the list"** — fallback, no link |

Anyone who ticked interest in **1-on-1 tutoring** gets a short P.S. added to
their email (except the two branches that are already all about tutoring).

## Things to know

- **First-touch only.** No follow-up or reply-detection logic exists yet.
  (Adding it later would mean a new trigger plus `REPLIED` / follow-up
  columns on the sheet.)
- **Renamed a form question?** Update the matching fragment in `COLS` at the
  top of the script so it still finds the right answer column.
- **New cohort?** Update `COHORT_MONTH`, `COHORT_LABEL`, and `COHORT_START`
  in `CONFIG` (and the templates if the framing changed).
- **Volume limits:** a consumer @gmail.com account allows ~100 recipients/day
  from Apps Script; Google Workspace allows ~1,500/day. You're nowhere near
  either.
- **Schedule-lock announcement** — the "here are the exact dates" blast to
  everyone already in the sheet — is a separate one-off, not built here.
  Generate it from the sheet when the schedule is final.
