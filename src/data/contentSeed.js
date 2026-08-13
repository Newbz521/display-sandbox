/** Editable copy for each piece. Layout (shape, colour, letters) stays in portfolio.js. */

export const SITE_SEED = {
  name: 'Lawrence Yee',
  role: 'Software Developer',
  tagline: 'New York. Architecture first, software ever since.',
}

export const PAGE_SEED = {
  about: {
    kicker: 'Who you are talking to',
    content: {
      kind: 'intro',
      lead: 'A New York software developer with a background in architecture, bringing the same methodical planning, intentional design, and floor-plan-level attention to detail to every build.',
      body: [
        'I studied Architectural Technology at City Tech, spent a year designing buildings, then went through General Assembly into software. That combination gave me strength in areas a lot of engineers shy away from: visual thinking, spatial judgment, translating what a client describes in plain language into something technically concrete.',
        "Give me a vague vision and zero instructions, and I'm in my element. I've always believed the best requirements come from making real things, not writing documents. I've brought that same 'figure it out' energy to a bit of everything over the years: legal tools, generative design engines, multiplayer games, and nonprofit sites.",
      ],
      stats: [
        { value: '2022', label: 'Moved into software' },
        { value: '7', label: 'Teams shipped with' },
        { value: 'NYC', label: 'Based in New York' },
      ],
      education: [
        {
          title: 'Bachelors in Architectural Technology',
          org: 'New York City College of Technology',
          period: 'Class of 2020',
        },
        {
          title: 'Coding Bootcamp',
          org: 'General Assembly',
          period: '2022',
        },
      ],
    },
  },
  work: {
    kicker: 'Where the hours went',
    content: {
      kind: 'timeline',
      items: [
        {
          title: 'Software Developer',
          org: 'SKYZ US',
          link: 'https://www.sjkplawfirm.com/',
          period: 'Dec 2025 — Present',
          points: [
            'Build and maintain the internal web platforms legal teams use for client intake, billing workflows, and case information.',
            'Integrated AWS Lambda webhooks for external payment gateways, and secured client assets in S3 behind signed URLs.',
            'Designed intake and conversion funnels wired to Google Ads, then ran the campaigns against performance data to target high-intent traffic.',
            'Own SEO initiatives and build content outline generation on Neo4j — mapping topics, pages, and relationships in a knowledge graph to plan search-focused content.',
            'Built a dynamic diagram creation tool that generates purposeful, article-specific visuals tailored to each piece of content for SEO ranking.',
            'Work with overseas engineering teams to keep front-end implementation aligned on SEO, performance, and UI standards.',
          ],
        },
        {
          title: 'Software Developer',
          org: 'Dwellci AI',
          link: 'https://www.dwellci.com/',
          period: 'Jul 2025 — Nov 2025',
          points: [
            'Built core platform infrastructure on GCP for an AI-driven architectural design tool.',
            'Engineered the backend on Firebase — Firestore for data, Firebase Auth, and Cloud Functions for serverless logic.',
            'Built the interface in React and React Three Fiber, aimed at architects generating and refining designs.',
          ],
        },
        {
          title: 'Fullstack Developer',
          org: 'New York Auto Museum',
          period: 'Jan 2025 — Present',
          points: [
            'Design and build responsive sites in HTML, CSS, and JavaScript for a non-profit team.',
            'Gather requirements directly from stakeholders and keep content, functionality, and visual consistency current across browsers and devices.',
          ],
        },
        {
          title: 'Game Developer',
          org: 'ROTRK',
          link: 'https://www.riseoftheratking.com/',
          period: 'Dec 2023 — Present',
          points: [
            'Build immersive multiplayer games in Godot, tuning network performance for smooth play.',
            'Shipped a cross-platform title using SQLite for local storage and Firebase for auth and real-time player-data sync.',
            'Cut load times 20% and lifted engagement 30% through an integrated physics system.',
            'Coordinated 50+ development tickets at 95% on-time delivery.',
          ],
        },
        {
          title: 'Fullstack Developer',
          org: 'EzML',
          link: 'https://www.ezml.io/',
          period: 'Feb 2023 — Jan 2024',
          points: [
            'Built an AI-integrated camera platform serving 500+ users.',
            'Sped up heavy 3D canvas components 40% by reworking them around React hooks.',
            'Managed machine-learning data output in Databricks, cutting the team’s handling time roughly 30%.',
          ],
        },
        {
          title: 'Software Engineer Intern',
          org: 'Levi Strauss',
          period: 'Sep 2022 — Dec 2022',
          points: [
            'Designed and built UI components for a virtual fitting room.',
            'Tracked visual defects in layout, colour, typography, and imagery through JIRA.',
          ],
        },
        {
          title: 'Architecture Designer',
          org: 'DJ Associates Architecture PC',
          link: 'https://djapc.com/',
          period: 'Sep 2019 — Nov 2020',
          points: [
            'The job before software. Produced construction documents and presentations in 2D and 3D, cutting pre-production time 10%.',
            'Ran job-site surveys to collect data, reducing revisions 25%, and lifted client lease renewals 20% through sharper marketing plans.',
          ],
        },
      ],
    },
  },
  projects: {
    kicker: 'Things I have built',
    content: {
      kind: 'cards',
      items: [
        {
          name: 'Legal operations platform',
          blurb:
            'Internal web platform for client intake, billing, and case records — plus Lambda-backed payment webhooks and S3 signed URLs for sensitive documents.',
          tags: ['JavaScript', 'AWS Lambda', 'S3'],
        },
        {
          name: 'Dwellci AI',
          blurb:
            'Generative design tool for architects: a React Three Fiber interface over Firebase and GCP, connecting front-end design tools to backend generative services.',
          tags: ['React Three Fiber', 'Firebase', 'GCP'],
          link: 'https://www.dwellci.com/',
        },
        {
          name: 'Cross-platform multiplayer title',
          blurb:
            'Godot game with SQLite for local storage and Firebase for auth and real-time player sync. Physics rework lifted engagement 30%; load times fell 20%.',
          tags: ['Godot', 'SQLite', 'Firebase'],
          link: 'https://www.riseoftheratking.com/',
        },
        {
          name: 'AI camera platform',
          blurb:
            'Camera tooling for 500+ users at EzML. Rebuilt the 3D canvas components around React hooks for a 40% speedup, with ML output managed in Databricks.',
          tags: ['React', 'Three.js', 'Databricks'],
          link: 'https://www.ezml.io/',
        },
        {
          name: 'New York Auto Museum',
          blurb:
            'Responsive site for a non-profit museum, built from requirements gathered directly with the team and kept consistent across browsers and devices.',
          tags: ['HTML', 'CSS', 'SEO'],
        },
        {
          name: 'Virtual fitting room',
          blurb:
            'UI components for a virtual try-on experience during an engineering internship at Levi Strauss.',
          tags: ['UI', 'JIRA'],
        },
      ],
    },
  },
  toolkit: {
    kicker: 'What I reach for',
    content: {
      kind: 'groups',
      items: [
        {
          group: 'Languages',
          chips: ['JavaScript', 'Python', 'SQL', 'HTML', 'CSS', 'Bash', 'GDScript'],
        },
        {
          group: 'Frameworks & Tools',
          chips: [
            'React',
            'React Three Fiber',
            'Three.js',
            'Express',
            'Spring Boot',
            'Maven',
            'Godot',
            'REST',
            'Postman',
            'Mockito',
            'Git',
          ],
        },
        {
          group: 'Databases',
          chips: ['PostgreSQL', 'MySQL', 'MSSQL', 'MongoDB', 'Neo4j', 'Firebase'],
        },
        {
          group: 'Cloud',
          chips: ['AWS', 'Google Cloud Platform', 'Docker', 'Kubernetes'],
        },
      ],
    },
  },
  blog: {
    kicker: 'Thinking out loud',
    content: { kind: 'list', items: [] },
  },
  playground: {
    kicker: 'Side builds, all live',
    content: {
      kind: 'cards',
      items: [
        {
          name: 'Portfolio 2.0',
          blurb:
            'A 3D immersive portfolio — custom canvas layers, camera choreography, and CSG geometry, all in React Three Fiber.',
          tags: ['React Three Fiber', 'Three.js', 'drei', 'React'],
          link: 'https://law521.netlify.app/',
        },
        {
          name: 'Kitchan',
          blurb: 'Interior design tool for laying a kitchen out in 3D, built on React Three Fiber.',
          tags: ['React Three Fiber', 'Three.js', 'React'],
          link: 'https://kitchan.netlify.app/kitchen',
        },
        {
          name: 'Cube',
          blurb:
            'Architectural mass study: OBJ models loaded into Three.js with live dat.GUI controls for reshaping the massing.',
          tags: ['Three.js', 'dat.GUI', 'OBJ'],
          link: 'https://newbz521.github.io/OBJ-ThreeJs-Test/',
        },
        {
          name: 'Portfolio 1.0',
          blurb:
            'The first portfolio — a 2D immersive scroll experience written in plain JavaScript, no framework.',
          tags: ['JavaScript', 'CSS', 'HTML'],
          link: 'https://lawrenceyee521.netlify.app/',
        },
        {
          name: 'Beacon Defender',
          blurb:
            'Endless Bubble Frenzy — an arcade game where you pop falling bubbles before they vanish. The more you pop per attack, the more points.',
          tags: ['JavaScript', 'Canvas', 'HTML'],
          link: 'https://newbz521.github.io/Beacon-Defender-/',
        },
        {
          name: 'DDR Remake',
          blurb:
            'A browser remake of Dance Dance Revolution — arrow timing and scoring in vanilla JavaScript.',
          tags: ['JavaScript', 'CSS', 'HTML'],
          link: 'https://newbz521.github.io/DDR/',
        },
      ],
    },
  },
  contact: {
    kicker: 'Say hello',
    content: {
      kind: 'contact',
      lead: "I'm always up for a conversation about interesting problems ... or an excuse to look at someone else's codebase.",
      items: [
        {
          label: 'Email',
          value: 'law.yee2133@gmail.com',
          link: 'mailto:law.yee2133@gmail.com',
        },
        { label: 'Phone', value: '+1 347-350-0353', link: 'tel:+13473500353' },
        {
          label: 'GitHub',
          value: '@Newbz521',
          link: 'https://github.com/Newbz521',
        },
        {
          label: 'LinkedIn',
          value: '/in/lawrenceyee91',
          link: 'https://www.linkedin.com/in/lawrenceyee91/',
        },
        {
          label: 'Résumé',
          value: 'Download PDF',
          link: '/Lawrence%20Yee%20Resume%202026%20(1).pdf',
          download: true,
        },
      ],
    },
  },
}

export const EDITABLE_PAGES = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'projects', label: 'Projects' },
  { id: 'toolkit', label: 'Toolkit' },
  { id: 'playground', label: 'Playground' },
  { id: 'contact', label: 'Contact' },
  { id: 'blog', label: 'Blog kicker' },
]
