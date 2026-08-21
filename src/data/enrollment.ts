// --- ENROLLMENT CONFIG ---
// Shared by /masterclass and /masterclass/thanks.

// Set to false when a new cohort opens enrollment.
export const IS_FULL = false;

// Next live cohort start date (shown alongside the waitlist CTA when the
// current cohort is full). This is the October cohort's first session — see
// the 'oct' entry in src/data/schedule.ts. Update when cohorts roll forward.
export const NEXT_COHORT = 'Aug 29';

// Live cohort price (shown beside the enroll button; must match Stripe).
export const COHORT_PRICE = 895;

// Stripe payment link for the live cohort (also sent by email after the
// interest form — keep in sync with CONFIG.STRIPE_LINK in
// automation/tally-autoresponder.gs). October cohort.
export const ENROLL_STRIPE_URL = 'https://buy.stripe.com/8x23cocXA0krd569XY6wE1I';
