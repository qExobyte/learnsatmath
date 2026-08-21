# Email previews — rendered from tally-autoresponder.gs

Every variant below is rendered with a sample lead (**Sarah Chen**, current
score **650** unless noted, goal score **750**) exactly as it would arrive in
an inbox. Generated 2026-08-20 from the script as committed.

**This file is a preview, not the source.** The templates that actually run
live in `buildFirstEmail()` in `tally-autoresponder.gs`. Workshop the copy
here (or tell Claude what to change), then have the `.gs` updated to match.

**No follow-ups.** The script sends exactly one email per submission.
(Automated follow-ups were removed 2026-07-26 — no reliable way to tell
who already booked/paid. The old follow-up system is in git history if it's
ever worth reintroducing.)

**Form changes 2026-08-20:** the SAT-date checkboxes are now Sep / Oct / Nov /
Dec / 2027 (August removed), and the pricing question is Yes / No (the
"Maybe — free call" option is gone, along with the Calendly email).

**Routing** (first match wins):

| # | Condition | Email |
|---|---|---|
| 1 | Out of budget (any dates) | Bedrock Pro pitch |
| 2 | In budget, current score ≤ 520 | Build fundamentals → Bedrock Pro |
| 3 | Only September selected | Sep full → superscoring, retake + October cohort; else one month of Bedrock Pro (condensed pitch) |
| 4 | Ready to enroll + October among dates | October Stripe link |
| 5 | Ready to enroll + only later dates | October cohort pitch (later cohorts not guaranteed) |
| 6 | Anything else (shouldn't happen) | "You're on the list" + Bedrock Pro |

(Score routing: 600+ is the Masterclass's intended starting point, 530–590
is quietly allowed, ≤ 520 gets the fundamentals recommendation. An
unparseable or blank score never triggers the reroute.)

**Bedrock Pro pitch** — one shared paragraph (`bedrockProPitch()`) used by
branches 1, 2 and 6; branch 3 uses a condensed one-paragraph version (`bedrockProPitchShort()`), so it's written once and edited once.

**P.S.** — every email except the out-of-budget one ends with a reply invitation in a P.S.: the Bedrock
emails say "I'll try my best to reply!", the cohort-enroll emails say "I read
and answer everything myself!".

**Voice** — every email adapts to the "Who is filling out this form?" answer.
The previews below show the **student voice** (To: student, CC: parent).
When a **parent** filled it out, the email goes To: parent, CC: student,
greets the parent by first name, and refers to the student in third person
("Great to hear Sarah's aiming for a 750!", "You marked that Sarah's taking
the September SAT..."). Same templates, swapped pronoun tokens. A
blank/missing answer defaults to student voice.

---

## 1. Out of budget → Bedrock Pro

*Condition: out of budget (any dates)*

**Subject:** SAT Math Advice

```
Hi Sarah,

Thanks for filling out the interest form! Great to hear you're aiming for a 750.

I completely understand if the masterclass is out of budget. However, I still want to give you something valuable to study with.

Over the past few months, I've been building Bedrock, an SAT Math platform that organizes the entire SAT Math curriculum into 125 problem types. Each one comes with a video lesson from me, and there are hundreds of variations to drill.

It's more challenging than Khan Academy, more efficient than OnePrep, and more affordable than Princeton Review.

Bedrock Pro is $49/month with no commitment (you can cancel anytime). Get a subscription here! >> https://www.bedrockprep.com/pro

Best,
Eric
```

## 2. In budget, current score ≤ 520 → fundamentals on Bedrock Pro

*Condition: in budget, score ≤ 520 (checked before the September rule, so low scorers never get the October pitch)*

**Subject:** SAT Math Advice

```
Hi Sarah,

Thanks for filling out the interest form! Great to hear you're aiming for a 750.

I want to be upfront about the best path forward: the Masterclass is designed for students starting around 600 or higher. It moves fast and covers only the hardest problems.

Starting from 480, you would get far more from building the fundamentals first, at the right pace, with a lesson for every problem type. That's exactly what Bedrock Pro is for.

Over the past few months, I've been building Bedrock, an SAT Math platform that organizes the entire SAT Math curriculum into 125 problem types. Each one comes with a video lesson from me, and there are hundreds of variations to drill.

Bedrock Pro is $49/month with no commitment (you can cancel anytime). Get a subscription here! >> https://www.bedrockprep.com/pro

Best,
Eric

P.S. If you have any questions about the platform or your prep in general, just reply to this email. I'll try my best to reply!
```

## 3. Only September selected → retake + October cohort, or one month of Bedrock Pro

*Condition: only September selected, score > 520*

**Subject:** About the September SAT

```
Hi Sarah,

Thanks for your interest in the SAT Math Masterclass! Great to hear you're aiming for a 750.

You marked that you're taking the September SAT, but unfortunately, the September cohort is full and has already begun.

Here's my honest recommendation: plan on a retake this fall. Many colleges superscore, so a second sitting is very advantageous. The October cohort starts August 29th and still has spots available. You can enroll here >> https://buy.stripe.com/8x23cocXA0krd569XY6wE1I

The class is capped at 15 students and recent cohorts have filled within days. Purchases are fully refundable within 7 days of the first session.

However, if you're unable to retake, I recommend signing up for one month of Bedrock Pro to make the most of the time before September.

Bedrock is the SAT Math platform I've been building, which condenses the entire SAT Math curriculum into 125 problem types, each with a video lesson from me, plus hundreds of variations to drill. It's $49/month with no commitment (you can cancel anytime). Get a subscription here! >> https://www.bedrockprep.com/pro

Best,
Eric

P.S. If you have any questions about the platform or your prep in general, just reply to this email. I'll try my best to reply!
```

## 4. Ready to enroll + October → Stripe link

*Condition: enroll + October (alone or with other dates)*

**Subject:** October SAT Math Masterclass - Spot open!

```
Hi Sarah,

Thanks for filling out the masterclass interest form! Great to hear you're aiming for a 750. I look forward to having you join the October cohort.

If you already claimed your spot on the confirmation page, you're all set! You'll receive everything needed for the class by email before the first session.

If not, here is the enrollment link >> https://buy.stripe.com/8x23cocXA0krd569XY6wE1I

The cohort starts August 29th and meets Saturdays and Sundays, 12:00-1:30 pm ET, running twice a week through the October SAT. There are weekly office hours and every student gets a lifetime subscription to Bedrock Pro.

To keep the class small and personalized, there is a hard cap of 15 students. Recent cohorts have filled up within days, so please enroll sooner rather than later! As a reminder, purchases are fully refundable within 7 days of the first session.

Best,
Eric

P.S. If you have any questions about the class, your score, or whether it's the right fit, just reply to this email. I read and answer everything myself!
```

## 5. Ready to enroll + only later dates → October cohort pitch

*Condition: enroll + only Nov / Dec / 2027 (or Sep + later, no Oct)*

**Subject:** SAT Math Masterclass - Enroll now for October

```
Hi Sarah,

Thanks for filling out the interest form! Great to hear you're aiming for a 750.

I'll be straightforward with you: the October cohort is the one to join, even with a later test date. I can't promise there will be a cohort for your exact date later this year, and the October cohort is open right now. It starts August 29th and meets Saturdays and Sundays, 12:00-1:30 pm ET, twice a week through the October SAT.

Starting early is also just the better plan. Even after the sessions end, you keep indefinite access to all 15 hours of recordings and a Bedrock Pro subscription, so the weeks between the last session and your test date become review time with everything already in hand. Here is the enrollment link >> https://buy.stripe.com/8x23cocXA0krd569XY6wE1I

The class is capped at 15 students and recent cohorts have filled within days. Purchases are fully refundable within 7 days of the first session.

Best,
Eric

P.S. If you have any questions about the class, your score, or whether it's the right fit, just reply to this email. I read and answer everything myself!
```

## 6. Fallback → on the list, Bedrock Pro

*Condition: anything else (shouldn't happen)*

**Subject:** You're on the list

```
Hi Sarah,

Thanks for filling out the interest form! Great to hear you're aiming for a 750. You're on my list, and I'll email you everything you need for the cohort ahead of your test date.

In the meantime, the best thing you can do is start drilling.

Over the past few months, I've been building Bedrock, an SAT Math platform that organizes the entire SAT Math curriculum into 125 problem types. Each one comes with a video lesson from me, and there are hundreds of variations to drill.

It's more challenging than Khan Academy, more efficient than OnePrep, and more affordable than Princeton Review.

Bedrock Pro is $49/month with no commitment (you can cancel anytime). Get a subscription here! >> https://www.bedrockprep.com/pro

Best,
Eric

P.S. If you have any questions about the platform or your prep in general, just reply to this email. I'll try my best to reply!
```

## Parent-voice sample (out of budget)

**To:** dana@example.com · **CC:** sarah@example.com

**Subject:** SAT Math Advice

```
Hi Dana,

Thanks for filling out the interest form! Great to hear Sarah's aiming for a 750.

I completely understand if the masterclass is out of budget. However, I still want to give Sarah something valuable to study with.

Over the past few months, I've been building Bedrock, an SAT Math platform that organizes the entire SAT Math curriculum into 125 problem types. Each one comes with a video lesson from me, and there are hundreds of variations to drill.

It's more challenging than Khan Academy, more efficient than OnePrep, and more affordable than Princeton Review.

Bedrock Pro is $49/month with no commitment (you can cancel anytime). Get a subscription here! >> https://www.bedrockprep.com/pro

Best,
Eric
```
