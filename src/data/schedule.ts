// Week-by-week curriculum and cohort dates, shared by the masterclass
// schedule section and the post-submit thanks page.

export interface Week {
  number: number;
  name: string;
}

export const weeks: Week[] = [
  { number: 1, name: 'Algebra with Desmos' },
  { number: 2, name: 'Linear & Exponential Functions' },
  { number: 3, name: 'Quadratics & Polynomials' },
  { number: 4, name: 'Geometry' },
  { number: 5, name: 'Statistics & Review' },
];

export interface Cohort {
  id: string;
  label: string;
  time: string;
  weekDates: string[];
  satDate: string;
  // First week that includes office hours.
  officeHoursFromWeek: number;
}

export const cohorts: Cohort[] = [
  {
    id: 'sep',
    label: 'September',
    time: 'Sat / Sun &middot; 5:00 &ndash; 6:30 pm ET',
    weekDates: ['Aug 8 & 9', 'Aug 15 & 16', 'Aug 22 & 23', 'Aug 29 & 30', 'Sep 5 & 6'],
    satDate: 'september 12',
    officeHoursFromWeek: 1,
  },
  {
    id: 'oct',
    label: 'October',
    time: 'Sat / Sun &middot; 12:00 &ndash; 1:30 pm ET',
    weekDates: ['Aug 29 & 30', 'Sep 5 & 6', 'Sep 12 & 13', 'Sep 19 & 20', 'Sep 26 & 27'],
    satDate: 'october 3',
    officeHoursFromWeek: 1,
  },
];
