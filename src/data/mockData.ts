import type { SkillStatus } from '../lib/utils';

export interface SkillItem {
  id: string;
  name: string;
  current: number;
  required: number;
  status: SkillStatus;
  category: 'Technical' | 'Analytical' | 'Soft Skills';
  description?: string;
}

export interface PriorityGap {
  skill: string;
  current: number;
  required: number;
  gap: number;
  status: SkillStatus;
  recommendation: string;
  actionText: string;
  actionRoute: string;
}

export interface ProgressMetric {
  label: string;
  previous: number;
  current: number;
  delta: number;
}

export interface RoadmapStep {
  id: string;
  phase: 'Learn' | 'Practice' | 'Build' | 'Prove';
  title: string;
  duration: string;
  status: 'Complete' | 'In Progress' | 'Upcoming';
  description: string;
  actionLabel?: string;
  actionRoute?: string;
}

export interface ChallengeData {
  id: string;
  title: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  impact: 'Low Impact' | 'Medium Impact' | 'High Impact';
  skill: string;
  mission: string;
  rubric: {
    category: string;
    weight: number;
    description: string;
  }[];
  datasetSample: {
    orderId: string;
    product: string;
    region: string;
    sales: number;
    profit: number;
    status: string;
  }[];
}

export interface ChallengeResultData {
  score: number;
  skill: string;
  breakdown: {
    criterion: string;
    score: number;
  }[];
  feedback: {
    positive: string;
    improvement: string;
  };
  impact: {
    careerReadiness: {
      from: number;
      to: number;
      delta: number;
    };
    skillScore: {
      skill: string;
      from: number;
      to: number;
      delta: number;
    };
    secondaryGains: {
      skill: string;
      delta: number;
    }[];
  };
}

export interface OpportunityItem {
  id: string;
  title: string;
  company: string;
  location: string;
  workplaceType: 'In-office' | 'Hybrid' | 'Remote';
  employmentType: 'Internship' | 'Full-time' | 'Contract';
  stipendOrSalary: string;
  alignment: number;
  skillsMatched: string[];
  missingSkills: string[];
  description: string;
  responsibilities: string[];
  postedDaysAgo: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  degree: string;
  institution: string;
  location: string;
  targetCareer: string;
  readinessScore: number;
  alignmentRate: number;
  coreSkillsReady: number;
  coreSkillsTotal: number;
  verifiedSkills: string[];
  projects: {
    title: string;
    description: string;
    tags: string[];
    date: string;
    link?: string;
  }[];
  achievements: {
    title: string;
    count: number;
    icon: string;
    description: string;
  }[];
}

export const mockUserProfile: UserProfile = {
  name: 'Rahul Sharma',
  email: 'Rahul@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  degree: 'B.Tech Computer Science',
  institution: 'MITS Gwalior',
  location: 'Gwalior, India',
  targetCareer: 'Data Analyst',
  readinessScore: 82,
  alignmentRate: 88,
  coreSkillsReady: 7,
  coreSkillsTotal: 10,
  verifiedSkills: ['SQL', 'Excel', 'Python', 'Power BI'],
  projects: [
    {
      title: 'Sales Dashboard',
      description: 'Built an interactive multi-region retail intelligence dashboard using Power BI and PostgreSQL.',
      tags: ['Power BI', 'SQL', 'Data Modeling'],
      date: 'May 2026',
    },
    {
      title: 'Student Analytics',
      description: 'Predictive retention analysis on 12,000 student records using Python, Pandas, and Scikit-Learn.',
      tags: ['Python', 'Pandas', 'Statistics'],
      date: 'March 2026',
    },
  ],
  achievements: [
    {
      title: 'Challenges Completed',
      count: 3,
      icon: 'Award',
      description: 'Hands-on practical proof assessments submitted',
    },
    {
      title: 'Assessments',
      count: 2,
      icon: 'CheckCircle2',
      description: 'Standardized baseline evaluation benchmarks passed',
    },
    {
      title: 'Verified Skill Set',
      count: 1,
      icon: 'ShieldCheck',
      description: 'End-to-end verified portfolio readiness certified',
    },
  ],
};

export const mockSkills: SkillItem[] = [
  {
    id: 'sql',
    name: 'SQL',
    current: 91,
    required: 80,
    status: 'Ready',
    category: 'Technical',
    description: 'Complex joins, window functions, CTEs, query optimization, and aggregations.',
  },
  {
    id: 'python',
    name: 'Python',
    current: 82,
    required: 75,
    status: 'Ready',
    category: 'Technical',
    description: 'Data wrangling with Pandas, NumPy, Jupyter, and exploratory data analysis.',
  },
  {
    id: 'excel',
    name: 'Excel',
    current: 78,
    required: 70,
    status: 'Ready',
    category: 'Technical',
    description: 'Advanced lookup functions (XLOOKUP), pivot tables, and financial/sales modeling.',
  },
  {
    id: 'statistics',
    name: 'Statistics',
    current: 52,
    required: 70,
    status: 'Developing',
    category: 'Analytical',
    description: 'Hypothesis testing, probability distributions, A/B testing inference, and regression analysis.',
  },
  {
    id: 'powerbi',
    name: 'Power BI',
    current: 41,
    required: 75,
    status: 'Needs Work',
    category: 'Technical',
    description: 'DAX formulas, Star Schema modeling, drill-through reports, and business KPIs.',
  },
  {
    id: 'communication',
    name: 'Communication',
    current: 64,
    required: 75,
    status: 'Developing',
    category: 'Soft Skills',
    description: 'Translating complex quantitative findings into clear business narratives for stakeholders.',
  },
];

export const mockStrongestSkills = [
  { name: 'SQL', score: 91 },
  { name: 'Problem Solving', score: 88 },
  { name: 'Python', score: 82 },
  { name: 'Excel', score: 78 },
];

export const mockPriorityGaps: PriorityGap[] = [
  {
    skill: 'Power BI',
    current: 41,
    required: 75,
    gap: 34,
    status: 'Needs Work',
    recommendation: 'Complete the Power BI Sales Dashboard Challenge to bridge your DAX & modeling gap.',
    actionText: 'Work on Power BI',
    actionRoute: '/challenge',
  },
  {
    skill: 'Statistics',
    current: 52,
    required: 70,
    gap: 18,
    status: 'Developing',
    recommendation: 'Practice hypothesis testing & p-value interpretations on real e-commerce datasets.',
    actionText: 'Practice Stats',
    actionRoute: '/roadmap',
  },
  {
    skill: 'Communication',
    current: 64,
    required: 75,
    gap: 11,
    status: 'Developing',
    recommendation: 'Draft executive summaries for two data case studies to demonstrate business impact.',
    actionText: 'Review Insights',
    actionRoute: '/roadmap',
  },
];

export const mockProgressMetrics: ProgressMetric[] = [
  {
    label: 'Overall Career Readiness',
    previous: 74,
    current: 81,
    delta: 7,
  },
  {
    label: 'Power BI',
    previous: 38,
    current: 72,
    delta: 34,
  },
  {
    label: 'Portfolio Evidence',
    previous: 55,
    current: 68,
    delta: 13,
  },
  {
    label: 'Communication & Storytelling',
    previous: 56,
    current: 64,
    delta: 8,
  },
];

export const mockRoadmapSteps: RoadmapStep[] = [
  {
    id: 'step-1',
    phase: 'Learn',
    title: 'Power BI Fundamentals & Architecture',
    duration: '30 min',
    status: 'Complete',
    description: 'Review core components: Power Query ETL, data modeling principles, and workspace setups.',
  },
  {
    id: 'step-2',
    phase: 'Practice',
    title: 'Charts, Measures & Dynamic Filters',
    duration: '30 min',
    status: 'Complete',
    description: 'Construct bar charts, slicers, time series area charts, and basic DAX sum aggregations.',
  },
  {
    id: 'step-3',
    phase: 'Build',
    title: 'Sales Dashboard Prototyping',
    duration: '45 min',
    status: 'In Progress',
    description: 'Assemble an interactive 3-page executive report connecting multi-region retail transactions.',
    actionLabel: 'Continue Build',
    actionRoute: '/challenge',
  },
  {
    id: 'step-4',
    phase: 'Prove',
    title: 'Power BI Sales Challenge & Assessment',
    duration: '45 min',
    status: 'Upcoming',
    description: 'Perform real dataset synthesis, identify business bottlenecks, and submit proof for automated evaluation.',
    actionLabel: 'Start Challenge',
    actionRoute: '/challenge',
  },
  {
    id: 'step-5',
    phase: 'Learn',
    title: 'Business Statistics: Confidence Intervals & A/B Testing',
    duration: '40 min',
    status: 'Upcoming',
    description: 'Deep dive into sample significance, hypothesis validation, and KPI variances.',
  },
  {
    id: 'step-6',
    phase: 'Practice',
    title: 'Cohort Retention & Churn Analysis',
    duration: '50 min',
    status: 'Upcoming',
    description: 'Calculate customer lifetime value and retention curves using Python & SQL.',
  },
];

export const mockChallengeData: ChallengeData = {
  id: 'challenge-pbi-01',
  title: 'Power BI Challenge',
  duration: '45 min',
  difficulty: 'Intermediate',
  impact: 'High Impact',
  skill: 'Power BI',
  mission: 'Create a dashboard from the provided sales dataset and identify three useful business insights.',
  rubric: [
    { category: 'Data Accuracy', weight: 25, description: 'Correct aggregations, revenue calculations, and zero discrepancy in profit margins.' },
    { category: 'Visualization', weight: 20, description: 'Clean visual hierarchy, appropriate chart selections, and responsive layout.' },
    { category: 'Insights', weight: 25, description: 'Extract three non-obvious, actionable findings from regional sales trends.' },
    { category: 'Clarity', weight: 15, description: 'Clear labeling, intuitive filters, and accessible presentation.' },
    { category: 'Business Reasoning', weight: 15, description: 'Sound economic recommendations backed by dataset metrics.' },
  ],
  datasetSample: [
    { orderId: 'ORD-9821', product: 'Cloud ERP License', region: 'North America', sales: 4500, profit: 1890, status: 'Shipped' },
    { orderId: 'ORD-9822', product: 'Data Studio Suite', region: 'Europe', sales: 2800, profit: 980, status: 'Completed' },
    { orderId: 'ORD-9823', product: 'Security Addon Pack', region: 'Asia Pacific', sales: 1250, profit: 410, status: 'Processing' },
    { orderId: 'ORD-9824', product: 'Enterprise Analytics v3', region: 'North America', sales: 8900, profit: 4200, status: 'Completed' },
    { orderId: 'ORD-9825', product: 'Support Tier II SLA', region: 'Latin America', sales: 1600, profit: -120, status: 'Refunded' },
  ],
};

export const mockChallengeResult: ChallengeResultData = {
  score: 78,
  skill: 'Power BI',
  breakdown: [
    { criterion: 'Data Accuracy', score: 92 },
    { criterion: 'Visualization', score: 81 },
    { criterion: 'Insights', score: 76 },
    { criterion: 'Clarity', score: 84 },
    { criterion: 'Business Reasoning', score: 72 },
  ],
  feedback: {
    positive: 'Good data selection and clear dashboard structure.',
    improvement: 'Explain business implications more clearly.',
  },
  impact: {
    careerReadiness: {
      from: 74,
      to: 81,
      delta: 7,
    },
    skillScore: {
      skill: 'Power BI',
      from: 38,
      to: 72,
      delta: 34,
    },
    secondaryGains: [
      { skill: 'Portfolio Evidence', delta: 13 },
      { skill: 'Communication & Storytelling', delta: 8 },
    ],
  },
};

export const mockOpportunities: OpportunityItem[] = [
  {
    id: 'opp-1',
    title: 'Junior Data Analyst Intern',
    company: 'Apex Data Labs',
    location: 'Indore',
    workplaceType: 'Hybrid',
    employmentType: 'Internship',
    stipendOrSalary: '₹22,000 – ₹30,000 / month',
    alignment: 87,
    skillsMatched: ['SQL', 'Python', 'Excel'],
    missingSkills: ['Power BI'],
    description: 'Work alongside senior BI analysts to build automated performance reporting pipelines, analyze customer behavior, and craft weekly executive KPI summaries.',
    responsibilities: [
      'Extract and transform data from PostgreSQL and Snowflake using SQL.',
      'Assist in standardizing weekly marketing efficiency metrics.',
      'Help migrate legacy Excel models to interactive cloud dashboards.',
    ],
    postedDaysAgo: 2,
  },
  {
    id: 'opp-2',
    title: 'Business Intelligence Trainee',
    company: 'Zeta FinTech Solutions',
    location: 'Bengaluru',
    workplaceType: 'Hybrid',
    employmentType: 'Full-time',
    stipendOrSalary: '₹5.5 – ₹7.2 LPA',
    alignment: 84,
    skillsMatched: ['SQL', 'Python', 'Excel'],
    missingSkills: ['Statistics'],
    description: 'Analyze transaction throughput, fraud indicators, and customer acquisition costs. Build daily operational scorecards for internal risk teams.',
    responsibilities: [
      'Write optimized SQL queries against high-volume transaction databases.',
      'Validate data integrity and create automated alerting checks in Python.',
      'Present findings in cross-functional weekly product standups.',
    ],
    postedDaysAgo: 3,
  },
  {
    id: 'opp-3',
    title: 'Data Operations Analyst',
    company: 'Optima Health Tech',
    location: 'Remote',
    workplaceType: 'Remote',
    employmentType: 'Full-time',
    stipendOrSalary: '₹6.0 – ₹8.5 LPA',
    alignment: 89,
    skillsMatched: ['SQL', 'Python', 'Excel', 'Problem Solving'],
    missingSkills: ['Communication'],
    description: 'Own clinical trial metrics aggregation and healthcare supply chain data flows with a global, distributed health-tech team.',
    responsibilities: [
      'Manage ETL synchronization between hospital EHR systems and central warehouse.',
      'Develop audit checks to catch data anomalies in trial phase reports.',
      'Collaborate with bio-statisticians on data cleaning and feature engineering.',
    ],
    postedDaysAgo: 1,
  },
  {
    id: 'opp-4',
    title: 'Associate Product Analyst',
    company: 'Cognitive Matrix',
    location: 'Pune',
    workplaceType: 'In-office',
    employmentType: 'Full-time',
    stipendOrSalary: '₹6.5 – ₹8.0 LPA',
    alignment: 81,
    skillsMatched: ['SQL', 'Python'],
    missingSkills: ['Power BI', 'Statistics'],
    description: 'Partner with product managers to measure feature adoption, run funnel drop-off diagnostics, and provide user retention insights.',
    responsibilities: [
      'Define tracking events and telemetry specifications with engineering.',
      'Construct user cohort heatmaps and journey retention curves.',
      'Design A/B test split evaluations for new product onboarding experiments.',
    ],
    postedDaysAgo: 5,
  },
];
