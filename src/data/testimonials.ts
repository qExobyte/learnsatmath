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
    quote: "Eric's masterclass is the best educational investment I have made to date. In our first session, Eric mentioned something that really resonated with me—the SAT doesn't test intelligence, but rather one's ability to problem-solve. While most people may never use the inscribed angle theorem outside of a testing center, preparing for the SAT is about developing a set of skills. Eric will teach you, as he did me, everything from the hardest problems to tips and tricks, such as Desmos. Eric knows what he's talking about and he's there for you every step of the way to optimize your success.",
    isMasterclass: mc('Masterclass August Cohort'),
  },
  {
    name: 'Octavia',
    context: 'Masterclass August Cohort',
    scoreBefore: 690,
    scoreAfter: 790,
    quote: "Eric's group class was such an engaging experience. I loved how he incorporated activities to foster competition among others in the class, such as rewarding prizes to those who answered questions correctly—something that can't happen in private tutoring. The class was paced very well: while covering the basics, he ensured adequate time was spent on the most challenging questions. He explained all the ins and outs of Desmos very clearly and concisely, always providing examples of each concept. The resources and strategies he offered were exactly what I needed to raise my math score from a 690 all the way to a 790!",
    isMasterclass: mc('Masterclass August Cohort'),
  },
  {
    name: 'Bennett',
    context: 'Masterclass August Cohort',
    scoreBefore: 620,
    scoreAfter: 750,
    quote: "Eric is the best SAT math tutor on the internet. I had always struggled with the SAT math, and I even did local courses that barely affected my score. Signing up for the Masterclass was the best decision I ever made. He teaches it in a way that is fun, engaging, and ensures that you actually understand what you're learning, rather than just memorizing material. He was always quick to respond to emails and ensured that there was sufficient time for everyone to understand the material. Anyone can excel on the SAT math; it's just about finding the right person to guide you, and that person is Eric.",
    isMasterclass: mc('Masterclass August Cohort'),
  },
  {
    name: 'Illa',
    context: 'Masterclass December Cohort',
    scoreBefore: 690,
    scoreAfter: 770,
    quote: "I cannot recommend Eric's group classes enough! I was completely stuck and unsure how to improve my math score, struggling to identify what I was missing. Eric's group classes changed everything—he covered everything I encountered on test day. His teaching goes beyond rote learning; he focuses on building a solid foundational understanding of the concepts and equips students with strategies to approach every problem confidently.",
    isMasterclass: mc('Masterclass December Cohort'),
  },
  {
    name: 'Jacob',
    context: 'Masterclass June Cohort',
    scoreBefore: 630,
    scoreAfter: 770,
    quote: "Eric's Masterclass truly changed the trajectory of my SAT journey, and potentially, my life. Before I enrolled, I had no idea how to study for the SAT Math and didn't find it remotely interesting. This changed entirely once I joined. He made learning not only accessible but genuinely enjoyable. I was absolutely ecstatic to see that my math score increased 140 points. I truly don't think I could have made such a dramatic improvement without Eric's expert help, and I can't thank him enough.",
    isMasterclass: mc('Masterclass June Cohort'),
  },
  {
    name: 'Jack',
    context: 'Masterclass March Cohort',
    quote: "The Masterclass has undoubtedly been the single best decision I made when preparing for the SAT. Initially I was worried that since the class was in a group setting, I wouldn't receive enough direct teaching of the material. But I was wrong! Eric made sure to answer everyone's questions, and the pacing of the class allowed for us to take the time to learn everything thoroughly. Not only were the sessions themselves helpful, but Eric provided all of the resources and advice I needed for studying on my own.",
    isMasterclass: mc('Masterclass March Cohort'),
  },
  {
    name: 'Yuna',
    context: '770 in 8 hours of tutoring',
    scoreAfter: 770,
    quote: "Learning from Eric was the best decision I made before taking the SAT. Before I started, I felt discouraged because I couldn't see any improvements in my math score. I learned a lot of things from him that I wouldn't have been able to figure out if I just self-studied. He also put in a lot of time and effort into personalizing my experience, helping me to focus on the areas I needed to improve. In every tutoring session, he was patient and understanding, and I felt really comfortable asking questions and making mistakes.",
    isMasterclass: mc('770 in 8 hours of tutoring'),
  },
  {
    name: 'Sam',
    context: 'Masterclass December Cohort',
    scoreBefore: 650,
    scoreAfter: 770,
    quote: "Taking group classes with Eric helped boost my SAT score tremendously! His class materials were well-thought-out, original, and personalized. There was no pressure to answer problems correctly, and there was no judgment if a student made mistakes. He has an engaging personality, so while I typically don't like studying math, I genuinely enjoyed each session. While taking the SAT, I encountered several math concepts that we had covered together!",
    isMasterclass: mc('Masterclass December Cohort'),
  },
  {
    name: 'Aster',
    context: 'Masterclass March Cohort',
    quote: "Eric is an incredible SAT math tutor! His group classes were engaging, well-structured, and filled with helpful strategies that made even the toughest math problems feel manageable. He explained concepts clearly, patiently answered all our questions, and ensured everyone kept up. His practice problems and test-taking tips helped me gain confidence. If you're looking for a tutor who makes SAT math both effective and enjoyable, I highly recommend him!",
    isMasterclass: mc('Masterclass March Cohort'),
  },
  {
    name: 'Wyatt',
    context: 'Masterclass December Cohort',
    scoreBefore: 630,
    scoreAfter: 740,
    quote: "When Eric says the SAT math score is the quickest way you can improve your college admissions, he is not lying. Taking his December SAT group classes and doing no work outside of sessions improved my score by 100 points. If you are serious about improving your SAT score fast at a reasonable price compared to other SAT tutors, taking Eric's SAT class is a no brainer.",
    isMasterclass: mc('Masterclass December Cohort'),
  },
  {
    name: 'James',
    context: '640 to 750 in 8 hours',
    scoreBefore: 640,
    scoreAfter: 750,
    quote: "My score increased faster than I thought was possible. Eric understands the SAT math on a deep level and can solve any problem I give him. He taught me not just how to solve problems, but how to think about them. Talking through my work out loud was especially impactful. Not only did I get a 750, but I've become a much better problem solver after learning from Eric.",
    isMasterclass: mc('640 to 750 in 8 hours'),
  },
  {
    name: 'Sophia',
    context: 'Masterclass June Cohort',
    quote: "Taking this masterclass was a great choice. Eric delivers the content in a way that is concise while allowing me to develop a deeper understanding of the topic. This ensured that I was able to tackle problems most appropriately, improving my accuracy and speed. I also found the small group format helpful—I was able to hear other thought processes, and this enriched my experience. I will now shift to studying with all of the resources Eric provided, effectively extending this course until the SAT Exam date. I am a stronger SAT Math tester overall and understand how I can further improve.",
    isMasterclass: mc('Masterclass June Cohort'),
  },
  {
    name: 'Aaron',
    context: 'Masterclass December Cohort',
    scoreBefore: 650,
    scoreAfter: 790,
    quote: "Eric really understands the SAT because he himself took it, so he can teach you all the tips and tricks to solve the hard questions it throws at you. He makes it super easy to understand each concept and gives so many study materials and plans. My math score was maxed out at 650 before Eric's classes, but now I was able to get a 790. I highly recommend this course for anyone who is taking the SAT.",
    isMasterclass: mc('Masterclass December Cohort'),
  },
  {
    name: 'Mujtaba',
    context: '1-on-1 tutoring',
    quote: "Eric's method of teaching was perfect for a student like me. Each hard concept with just a little bit of practice and explaining from him improved my score another 10–20 points. His materials are exactly what you need to get as close to the 800 as possible. You won't see questions harder than that on the real thing, so the practice is identical to the test. I think it's a great idea to invest in Eric if you're looking for a high score.",
    isMasterclass: mc('1-on-1 tutoring'),
  },
  {
    name: 'Aanya',
    context: '580 to 710 in 8 hours',
    scoreBefore: 580,
    scoreAfter: 710,
    quote: "Eric's math tutoring has helped me more than any textbook I have used. I was struggling with the math section of the SAT, staying at the same score even with months of studying. However once I found Eric's tutoring, my score improved significantly. Eric not only helped me get to the right answer for a problem, but he also made sure that I understood the reasoning behind it in depth. I would highly recommend Eric for anyone who needs help in SAT math.",
    isMasterclass: mc('580 to 710 in 8 hours'),
  },
  {
    name: 'Zoé',
    context: 'Masterclass October Cohort',
    scoreAfter: 760,
    quote: "Classes were fun and interactive and gave me tips and methods which helped me secure the score I was aiming for. Eric is patient and helpful and encouraged us to find the answer by ourselves. The course was well structured and provided ample practice and review material.",
    isMasterclass: mc('Masterclass October Cohort'),
  },
  {
    name: 'Viraat',
    context: '680 to 750 in 6 hours',
    scoreBefore: 680,
    scoreAfter: 750,
    quote: "Under Eric's lessons, I efficiently learned the concepts needed to master the SAT math problems. Eric's method of teaching concepts helped you answer any question that falls under that topic. With just six lessons, I improved my score by 70 points. With Eric's resources, I could do many practice problems independently and use them to understand how the SAT asks questions and master topics I struggled with.",
    isMasterclass: mc('680 to 750 in 6 hours'),
  },
  {
    name: 'Mukhammad',
    context: '630 to 730 in 8 hours',
    scoreBefore: 630,
    scoreAfter: 730,
    quote: "Eric is such a great math tutor who has helped me with my SAT journey. He is very clear when explaining math concepts and makes sure you understand the material. He always asks if you have questions and has no judgment if you do. His lessons are so worth it and with his affordable rates and bundles, he makes it accessible to everyone. I am so grateful to have Eric tutor me and recommend him to anyone looking to improve on the math section of the SAT.",
    isMasterclass: mc('630 to 730 in 8 hours'),
  },
  {
    name: 'Ryan',
    context: '530 to 600 in 3 hours',
    scoreBefore: 530,
    scoreAfter: 600,
    quote: "The lessons were highly comprehensible. He also demonstrated various methods of solving problems to ensure a thorough understanding of the solution's rationale. After only three lessons, my actual SAT math score improved by 70 points.",
    isMasterclass: mc('530 to 600 in 3 hours'),
  },
  {
    name: 'Julia',
    context: 'SAT Math & Precalculus',
    quote: "Eric is a great tutor who makes math enjoyable and bearable. He does a great job explaining concepts and ensuring I don't get lost along the way. I like and understand the unit circle for precalc now! I'm glad we found Eric as an SAT Math and Precalc tutor.",
    isMasterclass: mc('SAT Math & Precalculus'),
  },
  {
    name: 'Krisha',
    context: 'Masterclass March Cohort',
    quote: "The class setup is really awesome and flexible enough that you have structure to motivate you without the workload being a super large commitment of your time. We focused on the process of solving problems, instead of the actual answer, and this helped build speed and change my approach to solving problems to the most efficient possible way. Eric is also really nice and responds to your questions over email during the week really fast.",
    isMasterclass: mc('Masterclass March Cohort'),
  },
  {
    name: 'Naoki',
    context: '660 to 760 in 8 hours',
    scoreBefore: 660,
    scoreAfter: 760,
    quote: "Since I found Eric online, it has been a life-changing experience for me! He is very knowledgeable in the field of math, especially in Algebra and SAT Math, not only explaining how to solve problems, but also the in-depth reasoning behind the math. I was struggling with SAT math and feeling discouraged, but Eric's patient and encouraging approach helped me gain confidence. With his guidance and support, I was able to achieve my goal of 750+.",
    isMasterclass: mc('660 to 760 in 8 hours'),
  },
];
