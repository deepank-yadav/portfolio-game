/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║       DEEPANK YADAV — PORTFOLIO CONFIG FILE              ║
 * ║  Edit ONLY this file to update your portfolio details.   ║
 * ║  All changes here automatically reflect in the website.  ║
 * ╚══════════════════════════════════════════════════════════╝
 */

const PORTFOLIO_CONFIG = {

  // ──────────────────────────────────────────
  // 👤 BASIC PROFILE
  // ──────────────────────────────────────────
  profile: {
    name:            "Deepank Yadav",
    title:           "Senior Software Engineer",
    company:         "Adeptia Inc.",
    tagline:         "Java ⚡ Spring Boot ⚡ Microservices ⚡ Kafka",
    level:           "LVL 8 ENGINEER",
    location:        "India 🇮🇳",
    status:          "Open to Opportunities",
    avatar:          "🧙‍♂️",
    bio:             "Senior Software Engineer at Adeptia with a passion for building scalable, distributed systems using Java, Spring Boot and Microservices. Co-founder of The Code Bean — a tech community of 377+ followers sharing knowledge on coding, software design, and web development. Currently levelling up in JavaScript & React.",
    creed:           "Motivated, hard-working, and ambitious — driven to work on projects where skills and knowledge create real organizational impact. Always learning, always building.",
    yearsExp:        "4+",
    projectsShipped: "10+",
    techStackSize:   "15+ Tools",
    githubRepos:     "19",
    mediumFollowers: "377+",
  },

  // ──────────────────────────────────────────
  // 📡 CONTACT & SOCIAL LINKS
  // ──────────────────────────────────────────
  contact: {
    // Email intentionally hidden — contact form powered by Formspree below
    linkedin:   "https://www.linkedin.com/in/deepankyadav",
    github:     "https://github.com/deepank-yadav",
    twitter:    "https://x.com/deepank_yadav",
    medium:     "https://medium.com/@thecodebean",
    buymeacoffee: "https://buymeacoffee.com/deepank",
    kofi:       "https://ko-fi.com/deepank",
    twitch:     "https://twitch.tv/deepankyadav",
    website:    "",

    // ── CONTACT FORM (Formspree) ──────────────────────────────────
    // To update: go to formspree.io → your form → copy the endpoint URL
    formspreeUrl: "https://formspree.io/f/yourendpoint",
  },

  // ──────────────────────────────────────────
  // ⚡ SKILLS (name + proficiency 0–100)
  // ──────────────────────────────────────────
  skills: [
    { name: "Java",            pct: 93 },
    { name: "Spring Boot",     pct: 90 },
    { name: "REST APIs",       pct: 92 },
    { name: "Microservices",   pct: 88 },
    { name: "Hibernate / JPA", pct: 86 },
    { name: "Git / CI-CD",     pct: 85 },
    { name: "SQL / Databases", pct: 84 },
    { name: "Kafka",           pct: 82 },
    { name: "System Design",   pct: 82 },
    { name: "Docker",          pct: 80 },
    { name: "Kubernetes",      pct: 78 },
    { name: "JavaScript",      pct: 60 },
  ],

  techTags: [
    "Java", "Spring Boot", "Spring", "Hibernate", "Microservices",
    "Kafka", "Kubernetes", "Docker", "PostgreSQL", "MySQL",
    "REST", "GraphQL", "Redis", "AWS", "Git", "Jenkins",
    "Maven", "Gradle", "Linux", "JavaScript", "Design Patterns", "SOLID"
  ],

  // ──────────────────────────────────────────
  // 💼 WORK EXPERIENCE
  // ──────────────────────────────────────────
  experience: [
    {
      icon:    "⚔️",
      title:   "Senior Software Engineer",
      company: "Adeptia Inc.",
      date:    "2022 — Present",
      desc:    "Architecting and developing enterprise data integration solutions. Leading feature development in Java/Spring Boot microservices. Driving system reliability, performance optimisation, and scalable backend architecture for large-scale B2B integrations."
    },
    {
      icon:    "🛡️",
      title:   "Software Engineer",
      company: "Adeptia Inc.",
      date:    "2021 — 2022",
      desc:    "Developed and maintained core platform features for data integration workflows. Implemented RESTful APIs, enhanced backend services, and contributed to production stability and code quality improvements."
    },
    {
      icon:    "🗡️",
      title:   "Software Trainee",
      company: "Adeptia Inc.",
      date:    "2020 — 2021",
      desc:    "Began the journey at Adeptia as a Software Trainee. Learned enterprise Java development, the Spring ecosystem, and Agile workflows while contributing to ongoing product features."
    },
  ],

  // ──────────────────────────────────────────
  // 🏗 PROJECTS
  // ──────────────────────────────────────────
  projects: [
    {
      name: "⚡ Microservices E-Commerce Platform",
      desc: "Architected a full Microservices-based eCommerce platform supporting Product Catalog, Payment Gateway Integration, Order Service, and Notification Service. Each service independently deployable and scalable.",
      tags: ["Java", "Spring Boot", "Microservices", "Kafka", "Docker", "REST API"],
      link: "https://github.com/deepank-yadav"
    },
    {
      name: "📧 Event-Driven Email Service",
      desc: "Implemented a high-throughput event-driven email notification system using Kafka, enabling bulk email delivery across distributed services with fault tolerance and retry mechanisms.",
      tags: ["Kafka", "Java", "Spring Boot", "JavaMail API", "Event Driven"],
      link: "https://github.com/deepank-yadav"
    },
    {
      name: "🔗 Enterprise Data Integration (Adeptia)",
      desc: "Contributed to Adeptia's core B2B data integration platform — building connectors, transformation workflows, and API-based integrations for enterprise-grade business data exchange.",
      tags: ["Java", "Spring", "Hibernate", "REST", "SQL", "ETL"],
      link: ""
    },
    {
      name: "📝 The Code Bean — Tech Blog",
      desc: "Co-founded a technical writing community with 377+ followers on Medium, publishing deep-dives on Java Design Patterns, Spring Boot security, SOLID principles, and more.",
      tags: ["Java", "Spring Boot", "Design Patterns", "SOLID", "Technical Writing"],
      link: "https://medium.com/@thecodebean"
    },
  ],

  // ──────────────────────────────────────────
  // ✍️ BLOG POSTS (Medium — @thecodebean)
  // ──────────────────────────────────────────
  blogPosts: [
    {
      title: "The Road Ahead with Java 8",
      desc:  "Lambda expressions, streams & what's next for Java developers.",
      date:  "Oct 28, 2023",
      link:  "https://medium.com/@thecodebean/the-road-ahead-with-java-8-whats-next-for-java-developers-4574d7094c3e"
    },
    {
      title: "String vs StringBuilder vs StringBuffer",
      desc:  "A clear breakdown of Java string manipulation strategies.",
      date:  "Oct 26, 2023",
      link:  "https://medium.com/@thecodebean/string-manipulation-string-vs-stringbuilder-vs-stringbuffer-6598c6b06f5e"
    },
    {
      title: "SOLID Principles: Roadmap to Software Dev",
      desc:  "The five design principles every Java developer must know.",
      date:  "Oct 23, 2023",
      link:  "https://medium.com/@thecodebean/solid-principle-roadmap-to-software-development-9979031b7c3c"
    },
    {
      title: "Comparable vs Comparator in Java",
      desc:  "Custom sorting of objects explained with real examples.",
      date:  "Oct 21, 2023",
      link:  "https://medium.com/@thecodebean/java-object-sorting-explained-using-comparable-and-comparator-03b93b988f75"
    },
    {
      title: "CSRF Security in Spring Boot",
      desc:  "How to implement Cross-Site Request Forgery protection.",
      date:  "Oct 19, 2023",
      link:  "https://medium.com/@thecodebean/implementing-csrf-security-in-a-spring-boot-application-d1e1d128ca1d"
    },
    {
      title: "Proxy Design Pattern in Java",
      desc:  "Structural pattern for controlling object access.",
      date:  "Oct 16, 2023",
      link:  "https://medium.com/@thecodebean/proxy-design-pattern-implementation-in-java-450c02898a21"
    },
    {
      title: "Observer Design Pattern in Java",
      desc:  "One-to-many dependency pattern explained in depth.",
      date:  "Oct 13, 2023",
      link:  "https://medium.com/@thecodebean/observer-design-pattern-implementation-in-java-d7d263fbd0e3"
    },
    {
      title: "Strategy Design Pattern in Java",
      desc:  "Define a family of strategies and make them interchangeable.",
      date:  "Oct 11, 2023",
      link:  "https://medium.com/@thecodebean/strategy-design-pattern-implementation-in-java-fcbde3f9fd1d"
    },
    {
      title: "Flyweight Design Pattern in Java",
      desc:  "Minimise memory usage by sharing common objects.",
      date:  "Oct 9, 2023",
      link:  "https://medium.com/@thecodebean/flyweight-design-pattern-implementation-in-java-aefa07fde038"
    },
    {
      title: "Decorator Design Pattern in Java",
      desc:  "Enhance object behaviour at runtime without subclassing.",
      date:  "Oct 6, 2023",
      link:  "https://medium.com/@thecodebean/decorator-design-pattern-implementation-in-java-af632380e249"
    },
  ],

  // ──────────────────────────────────────────
  // 🎓 EDUCATION
  // ──────────────────────────────────────────
  education: [
    {
      icon:   "🏛️",
      degree: "Master of Computer Application (MCA)",
      school: "Graphic Era Hill University",
      year:   "2017-2019",
      desc:   "Advanced studies in computer science, software engineering methodologies, algorithms, and system design. Built strong foundations in enterprise software development."
    },
    {
      icon:   "🏛️",
      degree: "Bachelor of Science (IT)",
      school: "Hemvati Nandan Bahuguna Garhwal University",
      year:   "2014-2017",
      desc:   "Graduated from D.A.V. (PG) College, Dehradun, which is affiliated to H. N. B. Garhwal University."
    },
  ],

  specializations: [
    { icon: "☕", name: "JAVA MASTER",       desc: "Core & Advanced Java" },
    { icon: "🌐", name: "SPRING EXPERT",     desc: "Spring Boot & Spring MVC" },
    { icon: "🏗",  name: "ARCHITECT",         desc: "System & Microservices Design" },
    { icon: "📝", name: "TECH AUTHOR",       desc: "The Code Bean, 377+ followers" },
  ],

  // ──────────────────────────────────────────
  // 🏆 ACHIEVEMENTS
  // ──────────────────────────────────────────
  achievements: [
    { icon: "🥇", name: "SENIOR ENGINEER",   desc: "Promoted to Senior SWE at Adeptia" },
    { icon: "📝", name: "TECH AUTHOR",       desc: "10+ articles on The Code Bean" },
    { icon: "⚡", name: "KAFKA CHAMPION",    desc: "Event-driven systems at scale" },
    { icon: "🏗",  name: "ARCHITECT",         desc: "Microservices platform designer" },
    { icon: "🎓", name: "MCA GRADUATE",      desc: "Graphic Era Hill University" },
    { icon: "🔐", name: "SECURITY EXPERT",   desc: "Spring Boot CSRF & Security" },
    { icon: "🎨", name: "PATTERN MASTER",    desc: "Java Design Patterns series" },
    { icon: "🌟", name: "COMMUNITY BUILDER", desc: "Co-founder @thecodebean" },
  ],

};
