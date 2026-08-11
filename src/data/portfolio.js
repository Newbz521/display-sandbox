/**
 * The landing page is a 6x6 square partitioned into seven pieces — one per
 * page. Each piece has exactly as many blocks as its `short` code has letters,
 * so the word sets into the shape one letter per block, read row by row.
 *
 * The shapes are chosen so every word breaks where you would break it out loud:
 * straight runs for the short names, TOOL / KIT, PRO / JECTS.
 *
 *   W P B L O G      WORK      down the left edge
 *   O L T O O L      PLAY      down beside it
 *   R A K I T M      BLOG      across the top
 *   K Y P R O A      TOOLKIT   TOOL, then KIT beneath it
 *   J E C T S I      PROJECTS  PRO, then JECTS beneath it
 *   A B O U T L      MAIL      down the right edge   (Contact)
 *                    ABOUT     across the bottom
 *
 * `cells` are [row, col] pairs on that grid. The layout, the 3D geometry, the
 * scatter directions, and the letter placement are all derived from them.
 *
 * Content here comes from public/Lawrence Yee Resume 2026 (1).pdf.
 */

export const GRID = 6

/** Lives in public/, so it is served from the site root. */
export const RESUME_URL = '/Lawrence%20Yee%20Resume%202026%20(1).pdf'

export const OWNER = {
    name: 'Lawrence Yee',
    role: 'Software Developer',
    tagline: 'New York. Architecture first, software ever since.',
}

export const PIECES = [{
        id: 'about',
        short: 'ABOUT',
        label: 'About',
        kicker: 'Who you are talking to',
        color: '#6e86b8',
        cells: [
            [5, 0],
            [5, 1],
            [5, 2],
            [5, 3],
            [5, 4],
        ],
        content: {
            kind: 'intro',
            lead: 'A New York software developer with a background in architecture, bringing the same methodical planning, intentional design, and floor-plan-level attention to detail to every build.',
            body: [
                'I studied Architectural Technology at City Tech and spent a year designing buildings before going through General Assembly and moving into software. That route left me comfortable in the places most engineers avoid: 3D and geometry, drawings that have to be exact, and clients who describe what they want in a language that is not code.',
                'Since then I have built internal platforms for legal teams, generative design tooling for architects, a multiplayer game engine-side, and a handful of sites for small non-profits. The through-line is interfaces for people doing precise work.',
            ],
            stats: [
                { value: '2022', label: 'Moved into software' },
                { value: '7', label: 'Teams shipped with' },
                { value: 'NYC', label: 'Based in New York' },
            ],
            education: [{
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
    {
        id: 'work',
        short: 'WORK',
        label: 'Work',
        kicker: 'Where the hours went',
        color: '#1d2951',
        cells: [
            [0, 0],
            [1, 0],
            [2, 0],
            [3, 0],
        ],
        content: {
            kind: 'timeline',
            items: [{
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
    {
        id: 'projects',
        short: 'PROJECTS',
        label: 'Projects',
        kicker: 'Things I have built',
        color: '#e8785c',
        cells: [
            [3, 2],
            [3, 3],
            [3, 4],
            [4, 0],
            [4, 1],
            [4, 2],
            [4, 3],
            [4, 4],
        ],
        content: {
            kind: 'cards',
            items: [{
                    name: 'Legal operations platform',
                    blurb: 'Internal web platform for client intake, billing, and case records — plus Lambda-backed payment webhooks and S3 signed URLs for sensitive documents.',
                    tags: ['JavaScript', 'AWS Lambda', 'S3'],
                },
                {
                    name: 'Dwellci AI',
                    blurb: 'Generative design tool for architects: a React Three Fiber interface over Firebase and GCP, connecting front-end design tools to backend generative services.',
                    tags: ['React Three Fiber', 'Firebase', 'GCP'],
                    link: 'https://www.dwellci.com/',
                },
                {
                    name: 'Cross-platform multiplayer title',
                    blurb: 'Godot game with SQLite for local storage and Firebase for auth and real-time player sync. Physics rework lifted engagement 30%; load times fell 20%.',
                    tags: ['Godot', 'SQLite', 'Firebase'],
                    link: 'https://www.riseoftheratking.com/',
                },
                {
                    name: 'AI camera platform',
                    blurb: 'Camera tooling for 500+ users at EzML. Rebuilt the 3D canvas components around React hooks for a 40% speedup, with ML output managed in Databricks.',
                    tags: ['React', 'Three.js', 'Databricks'],
                    link: 'https://www.ezml.io/',
                },
                {
                    name: 'New York Auto Museum',
                    blurb: 'Responsive site for a non-profit museum, built from requirements gathered directly with the team and kept consistent across browsers and devices.',
                    tags: ['HTML', 'CSS', 'SEO'],
                },
                {
                    name: 'Virtual fitting room',
                    blurb: 'UI components for a virtual try-on experience during an engineering internship at Levi Strauss.',
                    tags: ['UI', 'JIRA'],
                },
            ],
        },
    },
    {
        id: 'toolkit',
        short: 'TOOLKIT',
        label: 'Toolkit',
        kicker: 'What I reach for',
        color: '#7fbfa6',
        cells: [
            [1, 2],
            [1, 3],
            [1, 4],
            [1, 5],
            [2, 2],
            [2, 3],
            [2, 4],
        ],
        content: {
            kind: 'groups',
            items: [{
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
    {
        id: 'blog',
        short: 'BLOG',
        label: 'Blog',
        kicker: 'Thinking out loud',
        color: '#a99be0',
        cells: [
            [0, 2],
            [0, 3],
            [0, 4],
            [0, 5],
        ],
        content: {
            kind: 'list',
            items: [{
                    title: 'Thoughts on the future of MCP design',
                    date: '05/21/2026',
                    blurb: `In the age of AI, I think a lot of MCP design is already heading in the wrong direction.

Giving an LLM access to 50 tools doesn't automatically make it more capable. If every tool dumps raw data back into the context and expects the model to calculate, filter, sort, validate, and figure out what matters, you're just moving backend work onto the LLM.

That feels backwards.

If something can be calculated or determined reliably with code, it probably should be. The MCP layer should do that work before the result ever reaches the model.

Don't give the LLM 2,000 database rows and ask it to find the trend. Calculate the trend. Don't give it 100 search results and ask it to remove duplicates and rank them. Do that first. Don't make the model interpret messy API responses when your MCP already knows exactly what those fields mean.

Every unnecessary decision you push onto the LLM costs context, time, and reliability.

I think the best MCP tools will actually feel boring. They will have narrow responsibilities, predictable inputs, strong validation, and return exactly what the model needs to make the next decision.

Code should handle precision and predictable logic. The LLM should handle ambiguity, reasoning, and judgment.

The goal shouldn't be to make the LLM do everything.

The goal should be to build the system around it so it doesn't have to.
`,
                    link: '#',
                },
                {
                    title: 'Architecture and AI',
                    date: '08/10/2026',
                    blurb: `I think AI has the potential to push architecture back toward what architects are actually supposed to do: design.

As someone who studied architecture, design studio in college was probably the last time I genuinely enjoyed the field. School gave me the impression that architecture was primarily about exploring space, form, materials, context and experience.

Working in an actual architecture firm was a very different reality.

I don't think architecture school accurately represents what the profession eventually requires from you. The transition from school to practice can become a frustrating back and forth between what you're passionate about designing and what the profession actually expects you to spend your time doing.

Code, zoning, compliance, documentation, coordination, revisions and calculations are all necessary, but they can easily consume the job. For me, that created a pretty toxic relationship with the field. The passion that gets people into architecture rarely seems to line up with the expectations of actually practicing it.

That's why AI in architecture interests me.

I don't want AI designing buildings for architects. I want it working in the background, constantly checking zoning, code, accessibility, egress, calculations and technical constraints while the architect designs.

The architect still makes the decisions and takes responsibility. AI just removes more of the repetitive technical work surrounding those decisions.

Maybe the biggest opportunity for AI isn't replacing architects at all. Maybe it's closing some of the gap between the architecture people fall in love with in school and the architecture they're actually able to practice.`,
                    link: '#',
                },
                {
                    title: 'Slowing down',
                    date: '08/11/2026',
                    blurb: `I was doing a little shopping in SoHo with my wife. She went into the fitting room, so naturally I found one of those couches sitting between the clothing aisles and took a seat.

While sitting there, I couldn't help but overhear a conversation between two friends. One of them was a young animator working for a studio.

He was talking about how he had spent over a year modeling assets for a scene. The work was basically done.

Then, apparently, an executive made a last minute decision: switch the models to an AI generated one.

The animator pushed back. Not because he was against AI, but because the generated model had a completely different style and wouldn't fit the scene they had already built.

The response?

"Then generate the scene with AI to match."

That stuck with me.

Over a year of work. Already completed. And instead of using AI to improve the existing work or help the animator move faster, the solution was essentially to throw everything away and regenerate it.

It made me wonder if we're entering a strange phase where some executives are dabbling in AI and suddenly feel qualified to make decisions about every role AI touches.

There's a huge difference between understanding what AI can generate and understanding the craft you're trying to replace.

AI is an incredible tool. I use it constantly. But "AI can do this" and "AI should do this" are two completely different conversations.

What bothered me most wasn't even the decision itself. It was hearing how discouraged this young animator sounded. He's at the beginning of his career, spent a year developing his craft and contributing to something, and then watched that work get scrapped simply because AI became an option.

That's not really AI adoption to me.

Good AI adoption should amplify the people who already understand the work. Give the animator better tools. Let them iterate faster. Let them automate repetitive parts of the process. Let AI expand what a small team can accomplish.

But replacing completed work just because you can generate something now?

At some point, that's not innovation.

That's just someone discovering a new button and wanting to press it.`,
                    link: '#',
                },
            ],
        },
    },
    {
        id: 'playground',
        short: 'PLAY',
        label: 'Playground',
        kicker: 'Side builds, all live',
        color: '#d9b98c',
        cells: [
            [0, 1],
            [1, 1],
            [2, 1],
            [3, 1],
        ],
        content: {
            kind: 'cards',
            items: [{
                    name: 'Portfolio 2.0',
                    blurb: 'A 3D immersive portfolio — custom canvas layers, camera choreography, and CSG geometry, all in React Three Fiber.',
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
                    blurb: 'Architectural mass study: OBJ models loaded into Three.js with live dat.GUI controls for reshaping the massing.',
                    tags: ['Three.js', 'dat.GUI', 'OBJ'],
                    link: 'https://newbz521.github.io/OBJ-ThreeJs-Test/',
                },
                {
                    name: 'Portfolio 1.0',
                    blurb: 'The first portfolio — a 2D immersive scroll experience written in plain JavaScript, no framework.',
                    tags: ['JavaScript', 'CSS', 'HTML'],
                    link: 'https://lawrenceyee521.netlify.app/',
                },
                {
                    name: 'Beacon Defender',
                    blurb: 'Endless Bubble Frenzy — an arcade game where you pop falling bubbles before they vanish. The more you pop per attack, the more points.',
                    tags: ['JavaScript', 'Canvas', 'HTML'],
                    link: 'https://newbz521.github.io/Beacon-Defender-/',
                },
                {
                    name: 'DDR Remake',
                    blurb: 'A browser remake of Dance Dance Revolution — arrow timing and scoring in vanilla JavaScript.',
                    tags: ['JavaScript', 'CSS', 'HTML'],
                    link: 'https://newbz521.github.io/DDR/',
                },
            ],
        },
    },
    {
        id: 'contact',
        short: 'MAIL',
        label: 'Contact',
        kicker: 'Say hello',
        color: '#35786e',
        cells: [
            [2, 5],
            [3, 5],
            [4, 5],
            [5, 5],
        ],
        content: {
            kind: 'contact',
            lead: "I'm always up for a conversation about interesting problems ... or an excuse to look at someone else's codebase.",
            items: [{
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
                    link: RESUME_URL,
                    download: true,
                },
            ],
        },
    },
]