export interface Resource {
  slug: string;
  title: string;
  description: string;
  youtubeId: string;
  resourceName: string;
  resourceDescription: string;
  resourceFile: string;
  previewImage: string;
  /** Skip the email gate: download immediately, then show the Bedrock upsell popup. */
  bedrockUpsell?: boolean;
}

export const resources: Resource[] = [
  {
    slug: '25-challenging-problems',
    title: '25 Challenging SAT Math Problems',
    description: "The hardest problems you'll see on the SAT. If you can solve these, you're ready for a 750+.",
    youtubeId: 'dEoFBES-LW0',
    resourceName: '25 Challenging Problems',
    resourceDescription: "If you can solve these, you're in good shape for a 750–800.",
    resourceFile: '25_Challenging_Problems.pdf',
    previewImage: '/hardproblem.png',
    bedrockUpsell: true,
  },
  {
    slug: 'every-topic',
    title: 'Overview of Every SAT Math Topic',
    description: 'A complete reference of every topic tested on the SAT — know exactly what to know.',
    youtubeId: '1bTkbmHx944',
    resourceName: 'Every SAT Math Topic',
    resourceDescription: 'Know exactly what to know — a complete topic-by-topic reference.',
    resourceFile: 'every_topic.pdf',
    previewImage: '/every_topic_thumbnail.PNG',
  },
];
