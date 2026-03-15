export type Testimonial = {
  name: string;
  context: string;
  scoreBefore?: number;
  scoreAfter?: number;
  quote: string;
  isMasterclass: boolean;
};

function mc(context: string): boolean {
  return /cohort|masterclass/i.test(context);
}

export const testimonials: Testimonial[] = [
  {
    name: 'Parent of Will',
    context: 'Asynchronous Cohort',
    scoreBefore: 720,
    scoreAfter: 800,
    quote: "Just wanted to say thank you! Will scored a 1550 with an 800 on math both times! This boost is literally just from watching your asynchronous videos!",
    isMasterclass: true,
  },
  {
    name: 'Octavia',
    context: 'August 2025 Cohort',
    scoreBefore: 690,
    scoreAfter: 790,
    quote: "The resources and strategies Eric offered were exactly what I needed to raise my math score from a 690 all the way to a 790. I loved how he incorporated activities to foster competition—something that can't happen in private tutoring.",
    isMasterclass: true,
  },
  {
    name: 'Bennett',
    context: 'August 2025 Cohort',
    scoreBefore: 620,
    scoreAfter: 750,
    quote: "I had always struggled with SAT math, even after local courses that barely affected my score. Eric teaches in a way that is fun and engaging, ensuring you actually understand—not just memorize—the material.",
    isMasterclass: true,
  },
  {
    name: 'Wyatt',
    context: 'December 2024 Cohort',
    scoreBefore: 630,
    scoreAfter: 790,
    quote: "Taking Eric's December classes and doing no work outside of sessions improved my score by 160 points. If you're serious about improving your SAT score fast, it's a no-brainer.",
    isMasterclass: true,
  },
  {
    name: 'Eli',
    context: 'August 2025 Cohort',
    scoreBefore: 680,
    scoreAfter: 760,
    quote: "Eric's masterclass is the best educational investment I have made to date. He knows what he's talking about and is there for you every step of the way.",
    isMasterclass: true,
  },
  {
    name: 'Illa',
    context: 'December 2025 Cohort',
    scoreBefore: 690,
    scoreAfter: 770,
    quote: "I was completely stuck and unsure how to improve my math score. Eric's group classes changed everything—he covered everything I encountered on test day, building real understanding instead of rote memorization.",
    isMasterclass: true,
  },
  {
    name: 'Parent of Nick',
    context: 'August 2025 Cohort',
    scoreBefore: 670,
    scoreAfter: 750,
    quote: "Thanks for designing an engaging and rigorous course and being a great teacher and role model for the kids!",
    isMasterclass: true,
  },
  {
    name: 'Jacob',
    context: 'June 2025 Cohort',
    scoreBefore: 630,
    scoreAfter: 770,
    quote: "My math score increased 140 points. I truly don't think I could have made such a dramatic improvement without Eric's expert help.",
    isMasterclass: true,
  },
  {
    name: 'Petra',
    context: 'October 2025 Cohort (PSAT prep)',
    scoreBefore: 580,
    scoreAfter: 690,
    quote: "I took your October Masterclass to study for the PSAT, not the SAT, but I improved greatly! I went from a 580 last year to a 690/760 this year!",
    isMasterclass: true,
  },
  {
    name: 'Jack',
    context: 'March 2025 Cohort',
    scoreBefore: 650,
    scoreAfter: 750,
    quote: "I was initially worried that in a group setting I wouldn't receive enough direct teaching—I was wrong. Eric made sure to answer everyone's questions, and the pacing allowed us to learn everything thoroughly.",
    isMasterclass: true,
  },
  {
    name: 'Yuna',
    context: '1-on-1 Tutoring',
    scoreBefore: 690,
    scoreAfter: 770,
    quote: "Learning from Eric was the best decision I made before taking the SAT. He put in a lot of time personalizing my experience, helping me focus on the areas I needed to improve.",
    isMasterclass: false,
  },
  {
    name: 'Aster',
    context: 'March 2025 Cohort',
    quote: "Eric's group classes were engaging, well-structured, and filled with helpful strategies that made even the toughest problems feel manageable. His practice problems and test-taking tips helped me gain confidence.",
    isMasterclass: true,
  },
  {
    name: 'James',
    context: '1-on-1 Tutoring',
    scoreBefore: 640,
    scoreAfter: 750,
    quote: "My score increased faster than I thought was possible. Eric taught me not just how to solve problems, but how to think about them—and I've become a much better problem solver because of it.",
    isMasterclass: false,
  },
  {
    name: 'Sophia',
    context: 'June 2025 Cohort',
    quote: "Eric delivers content in a way that is concise while building genuine understanding. The small group format let me hear other thought processes, which enriched my experience.",
    isMasterclass: true,
  },
  {
    name: 'Aaron',
    context: 'December 2025 Cohort',
    scoreBefore: 650,
    scoreAfter: 790,
    quote: "My math score was maxed out at 650 before Eric's classes—I ended with a 790. He makes each concept easy to understand and provides more study materials and plans than anyone else.",
    isMasterclass: true,
  },
  {
    name: 'Mujtaba',
    context: '1-on-1 Tutoring',
    quote: "Each hard concept, with just a little bit of practice and explanation from Eric, improved my score another 10–20 points. His materials are exactly what you need to get as close to 800 as possible.",
    isMasterclass: false,
  },
  {
    name: 'Aanya',
    context: '1-on-1 Tutoring',
    scoreBefore: 580,
    scoreAfter: 710,
    quote: "I was stuck at the same score for months of self-studying. Eric not only helped me get to the right answer, but made sure I understood the reasoning behind it in depth.",
    isMasterclass: false,
  },
  {
    name: 'Zoé',
    context: 'October 2024 Cohort',
    scoreAfter: 760,
    quote: "Classes were fun and interactive and gave me tips and methods which helped me secure the score I was aiming for. Eric is patient and encouraged us to find answers ourselves.",
    isMasterclass: true,
  },
  {
    name: 'Viraat',
    context: '1-on-1 Tutoring',
    scoreBefore: 680,
    scoreAfter: 750,
    quote: "With just six lessons, I improved my score by 70 points. Eric's method of teaching concepts helped me answer any question that falls under a given topic.",
    isMasterclass: false,
  },
  {
    name: 'Mukhammad',
    context: '1-on-1 Tutoring',
    scoreBefore: 630,
    scoreAfter: 730,
    quote: "Eric is very clear when explaining math concepts and makes sure you understand the material before moving on. His lessons are so worth it!",
    isMasterclass: false,
  },
  {
    name: 'Ryan',
    context: '1-on-1 Tutoring',
    scoreBefore: 530,
    scoreAfter: 600,
    quote: "After only three lessons, my actual SAT math score improved by 70 points. He demonstrated multiple methods for each problem to ensure a thorough understanding of the reasoning.",
    isMasterclass: false,
  },
  {
    name: 'Julia',
    context: '1-on-1 Tutoring',
    quote: "Eric is a great tutor who makes math enjoyable and bearable. I like and understand the unit circle for precalc now—I'm glad we found him.",
    isMasterclass: false,
  },
  {
    name: 'Krisha',
    context: 'March 2025 Cohort',
    quote: "We focused on the process of solving problems rather than the answer, which built speed and changed my approach to the most efficient possible way. The structure motivates without being a huge time commitment.",
    isMasterclass: true,
  },
  {
    name: 'Naoki',
    context: '1-on-1 Tutoring',
    scoreBefore: 660,
    scoreAfter: 760,
    quote: "I was struggling and feeling discouraged, but Eric's patient approach helped me gain confidence. With his guidance, I was able to achieve my goal of 750+.",
    isMasterclass: false,
  },
  {
    name: 'Sam',
    context: 'December 2024 Cohort',
    scoreBefore: 650,
    scoreAfter: 770,
    quote: "While I typically don't like studying math, I genuinely enjoyed each session. His materials were well-thought-out and personalized, and I encountered several concepts we covered together on the actual SAT.",
    isMasterclass: true,
  },
];
