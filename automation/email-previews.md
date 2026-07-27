# Email previews — rendered from tally-autoresponder.gs

Every variant below is rendered with a sample lead (**Sarah Chen**, current
score **650**, goal score **750**) exactly as it would arrive in an inbox.

**This file is a preview, not the source.** The templates that actually run
live in `buildFirstEmail()` in `tally-autoresponder.gs`. Workshop the copy
here (or tell Claude what to change), then have the `.gs` updated to match.

**No follow-ups.** The script sends exactly one email per submission.
(Automated follow-ups were removed 2026-07-26 — no reliable way to tell
who already booked/paid. The old follow-up system is in git history if it's
ever worth reintroducing.)

**Routing** (first match wins):

| # | Condition | Email |
|---|---|---|
| 1 | Out of budget (any dates) | Bedrock (free practice) |
| 2 | Only August selected (enroll or call) | August full → 1-on-1 tutoring |
| 3 | In budget, current score ≤ 520 | Honest recommendation → 1-on-1 tutoring |
| 4 | Wants a call (Sep, Oct, or later) | Calendly backstop |
| 5 | Ready to enroll + September | Stripe link backstop |
| 6 | Ready to enroll + later date | Stripe link + "don't procrastinate" |
| 7 | Anything else (shouldn't happen) | Generic "you're on the list" |

(Score routing: 600+ is the Masterclass's intended starting point, 530–590
is quietly allowed, ≤ 520 gets the tutoring recommendation. An unparseable
or blank score never triggers the reroute.)

**Tutoring P.S.** — leads who answered yes to the tutoring question get this
appended to most emails (not the August or low-score ones, which are
already about tutoring):

> P.S. You mentioned 1-on-1 tutoring. Happy to talk through whether the
> Masterclass, tutoring, or a mix makes sense for you. Just reply here!

**Voice** — every email adapts to the "Who is filling out this form?" answer.
The previews below show the **student voice** (To: student, CC: parent).
When a **parent** filled it out, the email goes To: parent, CC: student,
greets the parent by first name, and refers to the student in third person
("Great to hear Sarah's aiming for a 750!", "You marked that Sarah's taking
the August SAT..."). Same templates, swapped pronoun tokens. A blank/missing
answer defaults to student voice.

---

## 1. Out of budget → Bedrock

**Subject:** Free SAT Math Practice

```
Hi Sarah,

Thanks for filling out the interest form! Great to hear you're aiming for a 750!

I completely understand if the masterclass is out of budget. $895 is a real investment!

However, I still want to give you something to help with your prep. My platform Bedrock has plenty of high-quality practice problems completely for free. Check it out here >> https://www.bedrockprep.com/bedrock-100

You're still on my list, so if anything changes, just reply to this email and we'll figure something out.

Best,
Eric
```

## 2. Only August selected (enroll or call) → 1-on-1 tutoring

**Subject:** About the August SAT

```
Hi Sarah,

Thanks for your interest in the SAT Math Masterclass! Great to hear you're aiming for a 750!

You marked that you're taking the August SAT, but unfortunately, the August cohort has already begun and has no spots currently available.

The good news is that 1-on-1 tutoring is always an option! With a test this close, it's honestly the stronger option anyway: we skip what's already solid and focus entirely on your greatest weaknesses.

If you'd like to talk through what a 1-on-1 plan would look like, grab a free call here >> https://calendly.com/eric-wolpert-learnsatmath/coaching-call

Best,
Eric
```

## 3. In budget, current score ≤ 520 → honest 1-on-1 recommendation

**Subject:** SAT Math Advice

```
Hi Sarah,

Thanks for filling out the interest form! Great to hear you're aiming for a 750!

I want to be upfront about the best path forward: the Masterclass is designed for students starting around 600 or higher. It moves fast and covers only the hardest problems.

Starting from 480, you would get far more from 1-on-1 tutoring. We build the math from the ground up, at the right pace, and every session goes toward your specific weaknesses.

If you'd like to talk through what a 1-on-1 plan would look like, grab a free call here >> https://calendly.com/eric-wolpert-learnsatmath/coaching-call

Best,
Eric
```

## 4. Wants a free call (September, October, or later)

**Subject:** Your free SAT intro call

```
Hi Sarah,

Thanks for filling out the interest form! Great to hear you're aiming for a 750! A call is a great next step: 15 minutes and you'll know for sure whether the class is the right fit.

If you already grabbed a time on the confirmation page, you're all set and I'll see you then! If not, here's my calendar >> https://calendly.com/eric-wolpert-learnsatmath/masterclass-intro-call

Parents are very welcome on the call. Most of my best calls are with a parent and student together!

Best,
Eric
```

## 5. Ready to enroll + September in their dates

**Subject:** September SAT Math Masterclass - Spot open!

```
Hi Sarah,

Thanks for filling out the masterclass interest form! Great to hear you're aiming for a 750! I look forward to having you join the September cohort.

If you already claimed your spot on the confirmation page, you're all set! You'll receive everything needed for the class by email before the first session.

If not, here is the enrollment link >> https://buy.stripe.com/3cIbIU3n01ov2qs6LM6wE1C

To keep the class small and personalized, there is a hard cap of 15 students. Recent cohorts have filled up within days, so please enroll sooner rather than later! As a reminder, purchases are fully refundable within 7 days of the first session.

If you have any questions about the class, your score, or whether it's the right fit, just reply to this email. I read and answer everything myself!

Best,
Eric
```

## 6. Ready to enroll + later test date (October onward)

**Subject:** SAT Math Masterclass - Enrollment is open!

```
Hi Sarah,

Thanks for filling out the interest form! Great to hear you're aiming for a 750!

Enrollment is open right now for the next cohort. It starts August 8th, with sessions twice a week through the September SAT. Even with a later test date, don't procrastinate! The best time to start is always the present. And you'll keep all the materials indefinitely after the sessions end.

If you already claimed your spot on the confirmation page, you're all set! If not, here is the enrollment link >> https://buy.stripe.com/3cIbIU3n01ov2qs6LM6wE1C

As a reminder, purchases are fully refundable within 7 days of the first session.

Finally, if you prefer a cohort closer to your test date, no action is needed. I'll reach back out when the next cohort opens.

Best,
Eric
```

## 7. Fallback (blank/unmatched answers)

**Subject:** You're on the list

```
Hi Sarah,

Thanks for filling out the interest form! Great to hear you're aiming for a 750! You're on my list, and I'll email you everything you need for the cohort ahead of your test date.

As always, let me know if you have any questions!

Best,
Eric
```
