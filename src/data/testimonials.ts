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
    name: 'Eli',
    context: 'Masterclass August Cohort',
    scoreBefore: 680,
    scoreAfter: 760,
    quote: 'Masterclass is the best educational investment I have made to date.',
    isMasterclass: mc('Masterclass August Cohort'),
  },
  {
    name: 'Octavia',
    context: 'Masterclass August Cohort',
    scoreBefore: 690,
    scoreAfter: 790,
    quote: "Eric's group class was such an engaging experience—he explained Desmos very clearly.",
    isMasterclass: mc('Masterclass August Cohort'),
  },
  {
    name: 'Bennett',
    context: 'Masterclass August Cohort',
    scoreBefore: 620,
    scoreAfter: 750,
    quote: 'Eric is the best SAT math tutor on the internet.',
    isMasterclass: mc('Masterclass August Cohort'),
  },
  {
    name: 'Illa',
    context: 'Masterclass December Cohort',
    scoreBefore: 690,
    scoreAfter: 770,
    quote: "Eric's group classes changed everything—he covered everything I encountered on test day.",
    isMasterclass: mc('Masterclass December Cohort'),
  },
  {
    name: 'Jacob',
    context: 'Masterclass June Cohort',
    scoreBefore: 630,
    scoreAfter: 770,
    quote: "My math score increased 140 points. I truly don't think I could have made such dramatic improvement without this class.",
    isMasterclass: mc('Masterclass June Cohort'),
  },
  {
    name: 'Jack',
    context: 'Masterclass March Cohort',
    quote: 'The Masterclass has undoubtedly been the single best decision I made.',
    isMasterclass: mc('Masterclass March Cohort'),
  },
  {
    name: 'Yuna',
    context: '770 in 8 hours of tutoring',
    scoreAfter: 770,
    quote: 'Learning from Eric was the best decision I made before taking the SAT.',
    isMasterclass: mc('770 in 8 hours of tutoring'),
  },
  {
    name: 'Sam',
    context: 'Masterclass December Cohort',
    scoreBefore: 650,
    scoreAfter: 770,
    quote: 'His class materials were well-thought-out, original, and personalized.',
    isMasterclass: mc('Masterclass December Cohort'),
  },
  {
    name: 'Aster',
    context: 'Masterclass March Cohort',
    quote: 'Eric is an incredible SAT math tutor—he made even the toughest problems feel manageable.',
    isMasterclass: mc('Masterclass March Cohort'),
  },
  {
    name: 'Wyatt',
    context: 'Masterclass December Cohort',
    scoreBefore: 630,
    scoreAfter: 740,
    quote: 'Taking his December classes improved my score by 100 points.',
    isMasterclass: mc('Masterclass December Cohort'),
  },
  {
    name: 'James',
    context: '640 to 750 in 8 hours',
    scoreBefore: 640,
    scoreAfter: 750,
    quote: 'My score increased faster than I thought was possible.',
    isMasterclass: mc('640 to 750 in 8 hours'),
  },
  {
    name: 'Sophia',
    context: 'Masterclass June Cohort',
    quote: 'Eric delivers content in a way that is concise while allowing deeper understanding.',
    isMasterclass: mc('Masterclass June Cohort'),
  },
  {
    name: 'Aaron',
    context: 'Masterclass December Cohort',
    scoreBefore: 650,
    scoreAfter: 790,
    quote: 'He makes it super easy to understand each concept.',
    isMasterclass: mc('Masterclass December Cohort'),
  },
  {
    name: 'Mujtaba',
    context: '1-on-1 tutoring',
    quote: 'His materials are exactly what you need to get close to 800.',
    isMasterclass: mc('1-on-1 tutoring'),
  },
  {
    name: 'Aanya',
    context: '580 to 710 in 8 hours',
    scoreBefore: 580,
    scoreAfter: 710,
    quote: "Eric's tutoring has helped me more than any textbook I have used.",
    isMasterclass: mc('580 to 710 in 8 hours'),
  },
  {
    name: 'Zoé',
    context: 'Masterclass October Cohort',
    scoreAfter: 760,
    quote: 'Classes were fun and interactive and gave me tips and methods that actually stuck.',
    isMasterclass: mc('Masterclass October Cohort'),
  },
  {
    name: 'Viraat',
    context: '680 to 750 in 6 hours',
    scoreBefore: 680,
    scoreAfter: 750,
    quote: 'With just six lessons, I improved my score by 70 points.',
    isMasterclass: mc('680 to 750 in 6 hours'),
  },
  {
    name: 'Mukhammad',
    context: '630 to 730 in 8 hours',
    scoreBefore: 630,
    scoreAfter: 730,
    quote: 'His lessons are so worth it—he makes it accessible to everyone.',
    isMasterclass: mc('630 to 730 in 8 hours'),
  },
  {
    name: 'Ryan',
    context: '530 to 600 in 3 hours',
    scoreBefore: 530,
    scoreAfter: 600,
    quote: 'After only three lessons, my SAT math score improved by 70 points.',
    isMasterclass: mc('530 to 600 in 3 hours'),
  },
  {
    name: 'Julia',
    context: 'SAT Math & Precalculus',
    quote: 'Eric makes math enjoyable and bearable.',
    isMasterclass: mc('SAT Math & Precalculus'),
  },
  {
    name: 'Krisha',
    context: 'Masterclass March Cohort',
    quote: 'We focused on the process of solving problems, not just the answers.',
    isMasterclass: mc('Masterclass March Cohort'),
  },
  {
    name: 'Naoki',
    context: '660 to 760 in 8 hours',
    scoreBefore: 660,
    scoreAfter: 760,
    quote: 'It has been a life-changing experience for me.',
    isMasterclass: mc('660 to 760 in 8 hours'),
  },
];
