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

export const GRID = 6;

/** Lives in public/, so it is served from the site root. */
export const RESUME_URL = "/Lawrence%20Yee%20Resume%202026%20(1).pdf";

export const OWNER = {
    name: "Lawrence Yee",
    role: "Software Developer",
    tagline: "New York. Architecture first, software ever since.",
};

export const PIECES = [{
        id: "about",
        short: "ABOUT",
        label: "About",
        kicker: "Who you are talking to",
        color: "#6e86b8",
        cells: [
            [5, 0],
            [5, 1],
            [5, 2],
            [5, 3],
            [5, 4],
        ],
        content: {
            kind: "intro",
            lead: "I'm Lawrence — a New York software developer who came in through architecture, and still builds like someone who had to draw it before it got made.",
            body: [
                "I studied Architectural Technology at City Tech and spent a year designing buildings before going through General Assembly and moving into software. That route left me comfortable in the places most engineers avoid: 3D and geometry, drawings that have to be exact, and clients who describe what they want in a language that is not code.",
                "Since then I have built internal platforms for legal teams, generative design tooling for architects, a multiplayer game engine-side, and a handful of sites for small non-profits. The through-line is interfaces for people doing precise work.",
            ],
            stats: [
                { value: "2022", label: "Moved into software" },
                { value: "7", label: "Teams shipped with" },
                { value: "NYC", label: "Based in New York" },
            ],
            education: [{
                    title: "Bachelors in Architectural Technology",
                    org: "New York City College of Technology",
                    period: "Class of 2020",
                },
                {
                    title: "Coding Bootcamp",
                    org: "General Assembly",
                    period: "2022",
                },
            ],
        },
    },
    {
        id: "work",
        short: "WORK",
        label: "Work",
        kicker: "Where the hours went",
        color: "#1d2951",
        cells: [
            [0, 0],
            [1, 0],
            [2, 0],
            [3, 0],
        ],
        content: {
            kind: "timeline",
            items: [{
                    title: "Software Developer",
                    org: "SKYZ US",
                    link: "https://www.sjkplawfirm.com/",
                    period: "Dec 2025 — Present",
                    points: [
                        "Build and maintain the internal web platforms legal teams use for client intake, billing workflows, and case information.",
                        "Integrated AWS Lambda webhooks for external payment gateways, and secured client assets in S3 behind signed URLs.",
                        "Designed intake and conversion funnels wired to Google Ads, then ran the campaigns against performance data to target high-intent traffic.",
                        "Own SEO initiatives and build content outline generation on Neo4j — mapping topics, pages, and relationships in a knowledge graph to plan search-focused content.",
                        "Built a dynamic diagram creation tool that generates purposeful, article-specific visuals tailored to each piece of content for SEO ranking.",
                        "Work with overseas engineering teams to keep front-end implementation aligned on SEO, performance, and UI standards.",
                    ],
                },
                {
                    title: "Software Developer",
                    org: "Dwellci AI",
                    link: "https://www.dwellci.com/",
                    period: "Jul 2025 — Nov 2025",
                    points: [
                        "Built core platform infrastructure on GCP for an AI-driven architectural design tool.",
                        "Engineered the backend on Firebase — Firestore for data, Firebase Auth, and Cloud Functions for serverless logic.",
                        "Built the interface in React and React Three Fiber, aimed at architects generating and refining designs.",
                    ],
                },
                {
                    title: "Fullstack Developer",
                    org: "New York Auto Museum",
                    period: "Jan 2025 — Present",
                    points: [
                        "Design and build responsive sites in HTML, CSS, and JavaScript for a non-profit team.",
                        "Gather requirements directly from stakeholders and keep content, functionality, and visual consistency current across browsers and devices.",
                    ],
                },
                {
                    title: "Game Developer",
                    org: "ROTRK",
                    link: "https://www.riseoftheratking.com/",
                    period: "Dec 2023 — Present",
                    points: [
                        "Build immersive multiplayer games in Godot, tuning network performance for smooth play.",
                        "Shipped a cross-platform title using SQLite for local storage and Firebase for auth and real-time player-data sync.",
                        "Cut load times 20% and lifted engagement 30% through an integrated physics system.",
                        "Coordinated 50+ development tickets at 95% on-time delivery.",
                    ],
                },
                {
                    title: "Fullstack Developer",
                    org: "EzML",
                    link: "https://www.ezml.io/",
                    period: "Feb 2023 — Jan 2024",
                    points: [
                        "Built an AI-integrated camera platform serving 500+ users.",
                        "Sped up heavy 3D canvas components 40% by reworking them around React hooks.",
                        "Managed machine-learning data output in Databricks, cutting the team’s handling time roughly 30%.",
                    ],
                },
                {
                    title: "Software Engineer Intern",
                    org: "Levi Strauss",
                    period: "Sep 2022 — Dec 2022",
                    points: [
                        "Designed and built UI components for a virtual fitting room.",
                        "Tracked visual defects in layout, colour, typography, and imagery through JIRA.",
                    ],
                },
                {
                    title: "Architecture Designer",
                    org: "DJ Associates Architecture PC",
                    link: "https://djapc.com/",
                    period: "Sep 2019 — Nov 2020",
                    points: [
                        "The job before software. Produced construction documents and presentations in 2D and 3D, cutting pre-production time 10%.",
                        "Ran job-site surveys to collect data, reducing revisions 25%, and lifted client lease renewals 20% through sharper marketing plans.",
                    ],
                },
            ],
        },
    },
    {
        id: "projects",
        short: "PROJECTS",
        label: "Projects",
        kicker: "Things I have built",
        color: "#e8785c",
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
            kind: "cards",
            items: [{
                    name: "Legal operations platform",
                    blurb: "Internal web platform for client intake, billing, and case records — plus Lambda-backed payment webhooks and S3 signed URLs for sensitive documents.",
                    tags: ["JavaScript", "AWS Lambda", "S3"],
                },
                {
                    name: "Dwellci AI",
                    blurb: "Generative design tool for architects: a React Three Fiber interface over Firebase and GCP, connecting front-end design tools to backend generative services.",
                    tags: ["React Three Fiber", "Firebase", "GCP"],
                    link: "https://www.dwellci.com/",
                },
                {
                    name: "Cross-platform multiplayer title",
                    blurb: "Godot game with SQLite for local storage and Firebase for auth and real-time player sync. Physics rework lifted engagement 30%; load times fell 20%.",
                    tags: ["Godot", "SQLite", "Firebase"],
                    link: "https://www.riseoftheratking.com/",
                },
                {
                    name: "AI camera platform",
                    blurb: "Camera tooling for 500+ users at EzML. Rebuilt the 3D canvas components around React hooks for a 40% speedup, with ML output managed in Databricks.",
                    tags: ["React", "Three.js", "Databricks"],
                    link: "https://www.ezml.io/",
                },
                {
                    name: "New York Auto Museum",
                    blurb: "Responsive site for a non-profit museum, built from requirements gathered directly with the team and kept consistent across browsers and devices.",
                    tags: ["HTML", "CSS", "SEO"],
                },
                {
                    name: "Virtual fitting room",
                    blurb: "UI components for a virtual try-on experience during an engineering internship at Levi Strauss.",
                    tags: ["UI", "JIRA"],
                },
            ],
        },
    },
    {
        id: "toolkit",
        short: "TOOLKIT",
        label: "Toolkit",
        kicker: "What I reach for",
        color: "#7fbfa6",
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
            kind: "groups",
            items: [{
                    group: "Languages",
                    chips: [
                        "JavaScript",
                        "Python",
                        "SQL",
                        "HTML",
                        "CSS",
                        "Bash",
                        "GDScript",
                    ],
                },
                {
                    group: "Frameworks & Tools",
                    chips: [
                        "React",
                        "React Three Fiber",
                        "Three.js",
                        "Express",
                        "Spring Boot",
                        "Maven",
                        "Godot",
                        "REST",
                        "Postman",
                        "Mockito",
                        "Git",
                    ],
                },
                {
                    group: "Databases",
                    chips: [
                        "PostgreSQL",
                        "MySQL",
                        "MSSQL",
                        "MongoDB",
                        "Neo4j",
                        "Firebase",
                    ],
                },
                {
                    group: "Cloud",
                    chips: ["AWS", "Google Cloud Platform", "Docker", "Kubernetes"],
                },
            ],
        },
    },
    {
        id: "blog",
        short: "BLOG",
        label: "Blog",
        kicker: "Thinking out loud",
        color: "#a99be0",
        cells: [
            [0, 2],
            [0, 3],
            [0, 4],
            [0, 5],
        ],
        content: {
            kind: "list",
            items: [{
                    title: "Thoughts on the future of MCP design",
                    date: "05/21/2026",
                    blurb: `In the age of AI, designing MCP is more than just giving an LLM a bunch of tools to call.

To really get the most out of each tool, the LLM shouldn't have to do all the heavy lifting itself. Things like calculations, filtering, formatting, and other predictable logic should be handled before the data gets passed back to the model.

The idea is pretty simple: let the MCP handle what code is good at, and give the LLM clean, useful information so it can focus on reasoning and deciding what to do next.

Good MCP design isn't just about how many tools you expose. It's about making each tool easy for the LLM to use well.`,
                    link: "#",
                },
                {
                    title: "Architecture and AI",
                    date: "08/10/2026",
                    blurb: `I think AI could shift architecture back toward design.

A lot of an architect’s time goes into code, zoning, compliance, calculations, coordination and documentation. With the right AI tools, more of that work can happen in the background while designers focus on the actual building, space, form, materials, experience and context.

The architect still makes the decisions and takes responsibility, but AI can handle more of the technical checking around those decisions.

Instead of AI replacing architects, I think it could give architects more time to actually be architects.`,
                    link: "#",
                },
            ],
        },
    },
    {
        id: "playground",
        short: "PLAY",
        label: "Playground",
        kicker: "Side builds, all live",
        color: "#d9b98c",
        cells: [
            [0, 1],
            [1, 1],
            [2, 1],
            [3, 1],
        ],
        content: {
            kind: "cards",
            items: [{
                    name: "Portfolio 2.0",
                    blurb: "A 3D immersive portfolio — custom canvas layers, camera choreography, and CSG geometry, all in React Three Fiber.",
                    tags: ["React Three Fiber", "Three.js", "drei", "React"],
                    link: "https://law521.netlify.app/",
                },
                {
                    name: "Kitchan",
                    blurb: "Interior design tool for laying a kitchen out in 3D, built on React Three Fiber.",
                    tags: ["React Three Fiber", "Three.js", "React"],
                    link: "https://kitchan.netlify.app/kitchen",
                },
                {
                    name: "Cube",
                    blurb: "Architectural mass study: OBJ models loaded into Three.js with live dat.GUI controls for reshaping the massing.",
                    tags: ["Three.js", "dat.GUI", "OBJ"],
                    link: "https://newbz521.github.io/OBJ-ThreeJs-Test/",
                },
                {
                    name: "Portfolio 1.0",
                    blurb: "The first portfolio — a 2D immersive scroll experience written in plain JavaScript, no framework.",
                    tags: ["JavaScript", "CSS", "HTML"],
                    link: "https://lawrenceyee521.netlify.app/",
                },
                {
                    name: "Beacon Defender",
                    blurb: "Endless Bubble Frenzy — an arcade game where you pop falling bubbles before they vanish. The more you pop per attack, the more points.",
                    tags: ["JavaScript", "Canvas", "HTML"],
                    link: "https://newbz521.github.io/Beacon-Defender-/",
                },
                {
                    name: "DDR Remake",
                    blurb: "A browser remake of Dance Dance Revolution — arrow timing and scoring in vanilla JavaScript.",
                    tags: ["JavaScript", "CSS", "HTML"],
                    link: "https://newbz521.github.io/DDR/",
                },
            ],
        },
    },
    {
        id: "contact",
        short: "MAIL",
        label: "Contact",
        kicker: "Say hello",
        color: "#35786e",
        cells: [
            [2, 5],
            [3, 5],
            [4, 5],
            [5, 5],
        ],
        content: {
            kind: "contact",
            lead: "I'm always up for a conversation about interesting problems — or an excuse to look at someone else's codebase.",
            items: [{
                    label: "Email",
                    value: "law.yee2133@gmail.com",
                    link: "mailto:law.yee2133@gmail.com",
                },
                { label: "Phone", value: "+1 347-350-0353", link: "tel:+13473500353" },
                {
                    label: "GitHub",
                    value: "@Newbz521",
                    link: "https://github.com/Newbz521",
                },
                {
                    label: "LinkedIn",
                    value: "/in/lawrenceyee91",
                    link: "https://www.linkedin.com/in/lawrenceyee91/",
                },
                {
                    label: "Résumé",
                    value: "Download PDF",
                    link: RESUME_URL,
                    download: true,
                },
            ],
        },
    },
];