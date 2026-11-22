export type SectionId = 'about' | 'education' | 'experience' | 'projects' | 'contact'

export const NAV_SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'about', label: 'About' },
  { id: 'education', label: 'Education' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

export const landing = {
  name: 'Anika Sundararajan',
  tagline: 'Computer Science @ Penn Engineering · Economics & Finance @ Wharton (M&T Program)',
  motto: 'Every summit starts at the base. Start climbing.',
}

export const about = {
  title: 'About',
  paragraphs: [
    'I’m a builder working where computer science meets finance. As a student in Penn’s Jerome Fisher M&T Program, I design reinforcement-learning trading agents and AI pricing models — systems where both the engineering and the economics have to be right.',
    'Along the way I’ve shipped software at Apple, Auricore, Ximira, and Uber, from privacy-preserving AI infrastructure to computer vision for accessibility.',
  ],
}

export const education = {
  title: 'Education',
  school: 'University of Pennsylvania',
  program: 'Jerome Fisher Program in Management & Technology (M&T)',
  degrees: ['BSE Computer Science — Penn Engineering', 'BS Economics & Finance — The Wharton School'],
  classOf: 'Class of 2028',
}

export type Job = {
  company: string
  role: string
  dates: string
  points: string[]
  tags: string[]
}

export const experience: Job[] = [
  {
    company: 'Apple',
    role: 'Software Engineering Intern',
    dates: 'May – Aug 2026',
    points: [
      'Built a pre-inference sensitive-data scanning layer.',
      'Developed semantic verification of AI-generated Rego policies.',
      'Delivered three production policy-authoring skills.',
    ],
    tags: ['AI Safety', 'Rego', 'Policy Authoring'],
  },
  {
    company: 'Auricore',
    role: 'Software Engineering Intern',
    dates: 'Jun – Aug 2025',
    points: [
      'Built an AI pricing model reaching R² 0.98, served on SageMaker with DynamoDB.',
      'Modeled 60k+ listings.',
    ],
    tags: ['Python', 'AWS Lambda', 'API Gateway', 'Firebase', 'SageMaker', 'DynamoDB'],
  },
  {
    company: 'Ximira',
    role: 'Software Engineering Intern',
    dates: 'Jun – Aug 2023',
    points: ['Built a PyTorch / ResNet currency-recognition model for visually impaired users.'],
    tags: ['PyTorch', 'ResNet', 'Computer Vision', 'Accessibility'],
  },
  {
    company: 'Uber',
    role: 'Software Engineering Intern',
    dates: 'Feb – Mar 2023',
    points: ['Prototyped family ride features in Figma and React.', 'Presented the work to executives.'],
    tags: ['Figma', 'React', 'Product'],
  },
]

export type Project = {
  name: string
  blurb: string
  tags: string[]
  href?: string
}

export const projects: Project[] = [
  {
    name: 'RL Trading Execution Agent',
    blurb:
      'Multi-agent PPO system (buy, sell, and stop-loss agents) with point-in-time CRSP/Compustat backtesting to avoid look-ahead bias.',
    tags: ['Python', 'PyTorch', 'PPO', 'WRDS'],
    href: 'https://github.com/AnikaSundararajan/agentic-trader',
  },
  {
    name: 'Temporal Leakage in LLM Financial Research Agents',
    blurb: 'Research on how temporal leakage affects the evaluation of LLM-based financial research agents.',
    tags: ['LLMs', 'Research', 'Finance'],
  },
  {
    name: 'WUDAC ‘CFO 4 All’',
    blurb: 'Analyst project with the Wharton Undergraduate Data Analytics Club.',
    tags: ['Data Analytics', 'Finance'],
  },
  {
    name: 'Lynbrook HS Mobile App',
    blurb: 'School mobile app serving 80+ clubs and 2,400+ users.',
    tags: ['Mobile', '2,400+ users'],
    href: 'https://github.com/AnikaSundararajan/lynbrook-app',
  },
]

export const contact = {
  title: 'You made it to the top.',
  links: [
    { label: 'anika.jaip@gmail.com', href: 'mailto:anika.jaip@gmail.com' },
    { label: 'linkedin.com/in/anika-sundararajan', href: 'https://linkedin.com/in/anika-sundararajan' },
    { label: 'github.com/AnikaSundararajan', href: 'https://github.com/AnikaSundararajan' },
  ],
}

/** Every content panel along the climb, in order. */
export type PanelDef =
  | { key: 'landing'; section: null }
  | { key: 'about'; section: 'about' }
  | { key: 'education'; section: 'education' }
  | { key: `experience-${number}`; section: 'experience'; index: number }
  | { key: `project-${number}`; section: 'projects'; index: number }
  | { key: 'contact'; section: 'contact' }

export const PANELS: PanelDef[] = [
  { key: 'landing', section: null },
  { key: 'about', section: 'about' },
  { key: 'education', section: 'education' },
  ...experience.map((_, index) => ({ key: `experience-${index}` as const, section: 'experience' as const, index })),
  ...projects.map((_, index) => ({ key: `project-${index}` as const, section: 'projects' as const, index })),
  { key: 'contact', section: 'contact' },
]
