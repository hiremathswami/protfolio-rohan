export const portfolioData = {
  profile: {
    name: "Rohan Hiremathswami",
    pronouns: "he/him",
    title: "Full-Stack & AI Developer",
    location: "Kolhapur, Maharashtra, India",
    headline: "Building AI-powered web products, MERN stack applications, and interactive user experiences.",
    summary: "I’m Rohan Hiremathswami, a BCA Computer Science student and full-stack developer from Kolhapur. I specialize in building MERN stack web applications, integrating AI capabilities, and designing responsive, high-performance web products.",
    availability: "Open to full-time roles, internships, and collaborative AI/web engineering projects.",
    preferredRoles: [
      "Full-Stack Developer",
      "Frontend Developer / React Engineer",
      "AI Web Integration Developer",
      "Software Engineer Intern"
    ]
  },

  education: [
    {
      degree: "BCA (Bachelor of Computer Applications)",
      specialization: "Computer Science & Web Engineering",
      institution: "Kolhapur, Maharashtra",
      location: "Kolhapur, IN",
      period: "Currently Pursuing",
      highlights: [
        "Core Computer Science fundamentals and Web Software Architecture",
        "Object-Oriented Programming with C++ and Data Analysis with Python & R",
        "Full-Stack MERN Development and Cloud/AI Specialization"
      ]
    }
  ],

  skills: {
    languages: ["JavaScript (ES6+)", "Python", "C++", "R Language", "HTML5", "CSS3"],
    frontend: ["React.js", "Next.js", "Tailwind CSS", "Vanilla JavaScript", "HTML5", "CSS3 Glassmorphism"],
    backend: ["Node.js", "Express.js", "REST APIs", "MERN Stack Architecture"],
    databases: ["MongoDB", "Mongoose ODM", "SQL (Intermediate & Advanced)", "Relational DBs"],
    dataAndAI: ["NumPy", "Pandas", "Generative AI Integration", "LLM APIs", "Exploratory Data Analysis", "Data Visualization (Matplotlib)"],
    toolsAndPlatforms: ["Google Cloud Platform (GCP)", "AWS Generative AI Track", "Git & GitHub", "Vercel", "VS Code"],
    currentlyLearning: ["Advanced Machine Learning", "Cloud-Native Microservices", "AI Agent Workflows"]
  },

  experience: [
    {
      company: "Independent Web & AI Development",
      role: "Full-Stack Developer & AI Application Creator",
      type: "Project-Based / Independent",
      period: "2023 – Present",
      location: "Kolhapur, IN / Remote",
      responsibilities: [
        "Architected and deployed full-stack e-commerce web applications using MERN stack with authentication, product catalogs, and WhatsApp integration.",
        "Integrated AI recipe generation logic and study planning mentorship algorithms into web apps.",
        "Built responsive client websites and interactive 3D web experiences."
      ],
      achievements: [
        "Shipped 5 major production/demo projects including Ora Jewellers, Mahalaxmi Jewellers, 3D Interactive Site, SmartChef, and StudyMentor.",
        "Earned 11 verified professional certifications across Google Cloud, AWS Generative AI, Google Data Analytics, and DataCamp."
      ],
      technologies: ["React.js", "Node.js", "Express.js", "MongoDB", "Python", "GCP", "AWS"]
    }
  ],

  projects: [
    {
      id: "ora-jewellers",
      name: "Ora Jewellers",
      tagline: "Full-stack jewellery web experience with refined product presentation",
      problem: "Traditional jewellery brands need elegant, responsive digital storefronts with intuitive customer browsing.",
      solution: "Built a complete web experience featuring high-end jewellery catalog browsing, mobile-first design, and seamless user interaction.",
      role: "Full Development — Designed, developed, and deployed the complete website end to end.",
      technologies: ["JavaScript", "HTML5", "CSS3", "Responsive Web Design"],
      features: [
        "Refined product presentation catalog",
        "Customer-facing browsing flow",
        "Mobile-first glassmorphism design",
        "Custom subtle animations"
      ],
      outcomes: [
        "Deployed live e-commerce website experience."
      ],
      challenges: [
        "Designing high-end visual product cards while maintaining ultra-fast mobile loading performance."
      ],
      githubUrl: "",
      liveUrl: "https://orajweles.lovable.app/",
      image: "",
      category: "Web Application"
    },
    {
      id: "3d-interactive-website",
      name: "3D Interactive Website",
      tagline: "Experimental interactive 3D web experience with companion camera orbit controls",
      problem: "Creating engaging interactive 3D web stages using modern browser graphics.",
      solution: "Integrated interactive 3D companion models with camera orbit controls and dynamic glass lighting UI.",
      role: "Designed and developed the 3D web stage and produced full recorded screen walkthrough demo.",
      technologies: ["3D Web", "Interactive UI", "Spline 3D", "HTML5", "CSS3"],
      features: [
        "Interactive 3D model with camera orbit controls",
        "Dynamic glass light reflections",
        "Recorded screen walkthrough demo video"
      ],
      outcomes: [
        "Completed interactive 3D UI experience with video demo available."
      ],
      challenges: [
        "Optimizing 3D iframe render performance across high-DPI displays."
      ],
      githubUrl: "",
      liveUrl: "",
      image: "",
      category: "Interactive 3D"
    },
    {
      id: "mahalaxmi-jewellers",
      name: "Mahalaxmi Jewellers",
      tagline: "Full-stack jewellery e-commerce application built with the MERN stack",
      problem: "E-commerce buyers need real-time product filtering, cart checkout, and direct merchant messaging.",
      solution: "Engineered a full-stack e-commerce site with category filtering, user authentication, interactive cart, multiple checkout flows, and WhatsApp click-to-chat.",
      role: "Full-Stack Development — Built backend REST APIs, MongoDB schemas, and React user interface.",
      technologies: ["MERN Stack", "MongoDB", "Express.js", "React.js", "Node.js", "REST APIs", "WhatsApp API"],
      features: [
        "Real-time category filtering",
        "User authentication and session cart",
        "Product detail views and checkout options",
        "Direct WhatsApp click-to-chat support"
      ],
      outcomes: [
        "Successfully deployed live full-stack e-commerce platform."
      ],
      challenges: [
        "Implementing seamless state sync between product catalog filters, user cart state, and WhatsApp query params."
      ],
      githubUrl: "",
      liveUrl: "https://mahalaxmi-jwellers-owb2-ivory.vercel.app/",
      image: "",
      category: "Full-Stack E-commerce"
    },
    {
      id: "smartchef",
      name: "SmartChef",
      tagline: "AI-driven recipe recommendation application based on mood, dietary preferences, and ingredients",
      problem: "Home cooks struggle to decide what to cook using available pantry ingredients and dietary restrictions.",
      solution: "Integrated AI recommendation logic that generates personalized meal recipes in real time based on user inputs.",
      role: "Built AI prompt logic, frontend application, and REST API integration.",
      technologies: ["AI Integration", "REST APIs", "JavaScript", "Node.js"],
      features: [
        "Mood-driven recipe suggestions",
        "Dietary preference and ingredient matching",
        "Real-time personalized recipe output"
      ],
      outcomes: [
        "Developed functional AI recipe advisor application."
      ],
      challenges: [
        "Structuring multi-attribute prompt inputs to ensure consistent, appetizing recipe outputs."
      ],
      githubUrl: "",
      liveUrl: "",
      image: "",
      category: "AI Web Application"
    },
    {
      id: "studymentor",
      name: "StudyMentor",
      tagline: "AI-powered study-planning SaaS platform with adaptive learning logic",
      problem: "Students need adaptive study schedules that dynamically adjust around their learning pace and topic difficulty.",
      solution: "Developed a study-planning SaaS product with adaptive logic that modifies content difficulty and study pacing.",
      role: "Full-Stack SaaS Product Development — Created study scheduling algorithms and AI interface.",
      technologies: ["SaaS Architecture", "AI Mentorship", "JavaScript", "React.js", "REST APIs"],
      features: [
        "Adaptive learning pace logic",
        "Personalized study task breakdown",
        "Progress tracking and difficulty scaling"
      ],
      outcomes: [
        "Designed and prototyped adaptive AI mentorship SaaS."
      ],
      challenges: [
        "Building feedback loops that adjust study timelines based on self-reported comprehension scores."
      ],
      githubUrl: "",
      liveUrl: "",
      image: "",
      category: "AI SaaS Platform"
    }
  ],

  certifications: [
    {
      name: "Essential Google Cloud Infrastructure: Foundation",
      issuer: "Coursera / Google Cloud",
      year: "2024 (Jan)",
      credentialUrl: "Credential ID: P5973NNXPJ8K"
    },
    {
      name: "Google Data Analytics Professional Certificate",
      issuer: "Coursera / Google",
      year: "2024",
      credentialUrl: "Credential ID: EWMVNNXSHQNC (Skills: R, Data Analysis, SQL, Data Viz)"
    },
    {
      name: "Introducing Generative AI with AWS",
      issuer: "Udacity / AWS",
      year: "2025 (Jun)",
      credentialUrl: "AWS Generative AI Track"
    },
    {
      name: "Exploratory Data Analysis in Python",
      issuer: "DataCamp",
      year: "Completed",
      credentialUrl: "DataCamp Achievement"
    },
    {
      name: "Introduction to Data Visualization with Matplotlib",
      issuer: "DataCamp",
      year: "Completed",
      credentialUrl: "DataCamp Achievement"
    },
    {
      name: "Introduction to Statistics in Python",
      issuer: "DataCamp",
      year: "Completed",
      credentialUrl: "DataCamp Achievement"
    },
    {
      name: "Joining Data with pandas",
      issuer: "DataCamp",
      year: "Completed",
      credentialUrl: "DataCamp Achievement"
    },
    {
      name: "Data Manipulation with pandas (with AI Tutor)",
      issuer: "DataCamp",
      year: "Completed",
      credentialUrl: "DataCamp Achievement + AI Tutor"
    },
    {
      name: "Intermediate SQL",
      issuer: "DataCamp",
      year: "Completed",
      credentialUrl: "DataCamp Achievement"
    },
    {
      name: "Introduction to SQL",
      issuer: "DataCamp",
      year: "Completed",
      credentialUrl: "DataCamp Achievement"
    },
    {
      name: "Understanding Data Engineering",
      issuer: "DataCamp",
      year: "Completed",
      credentialUrl: "DataCamp Achievement"
    }
  ],

  achievements: [
    "Earned 11 professional certifications across GCP Cloud Infrastructure, AWS Generative AI, Google Data Analytics, and DataCamp.",
    "Built and deployed 5 full-stack web products including e-commerce platforms and AI applications.",
    "BCA Computer Science student maintaining high practical focus in MERN stack development, Python data analytics, and AI integration."
  ],

  contact: {
    email: "contact@rohanhiremathswami.dev",
    linkedin: "https://www.linkedin.com/in/rohan-hiremathswami",
    github: "https://github.com/hiremathswami",
    resumeUrl: "https://www.linkedin.com/in/rohan-hiremathswami",
    portfolioUrl: "https://mahalaxmi-jwellers-owb2-ivory.vercel.app/"
  }
};
