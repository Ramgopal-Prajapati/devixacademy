/**
 * DeviX Academy - Academy Content, Curriculum & Learner Data Store
 * --------------------------------------------------------------------------
 * Structured programs, industry solutions, learning methodology, mentor
 * profile, learner testimonials, gallery showcases, and academy FAQs.
 * Set `brochureUrl` to an uploaded PDF path once published; when null, the UI
 * routes directly to a tailored syllabus request without broken downloads.
 */

window.DEVIX_DATA = {
  // ------------------------------------------------------------------------
  // 1. Academy Impact Overview
  // ------------------------------------------------------------------------
  stats: [
    {
      id: "students",
      label: "Learners Mentored",
      value: 500,
      suffix: "+",
      note: "College & Working Professionals",
      icon: "fa-user-graduate"
    },
    {
      id: "programs",
      label: "Training Programs",
      value: 8,
      suffix: "",
      note: "Industry-Aligned Tracks",
      icon: "fa-layer-group"
    },
    {
      id: "projects",
      label: "Projects Built",
      value: 120,
      suffix: "+",
      note: "Hands-On Student Capstones",
      icon: "fa-diagram-project"
    },
    {
      id: "workshops",
      label: "Technical Workshops",
      value: 25,
      suffix: "+",
      note: "Campus & Team Sessions",
      icon: "fa-building"
    }
  ],

  // ------------------------------------------------------------------------
  // 2. Ecosystem & Collaboration Categories
  // ------------------------------------------------------------------------
  partners: [
    {
      name: "Academic Institutions",
      sub: "Engineering & IT Colleges",
      icon: "fa-university"
    },
    {
      name: "Corporate L&D Teams",
      sub: "Workforce Upskilling Cohorts",
      icon: "fa-building"
    },
    {
      name: "Cloud & AI Stack",
      sub: "Modern Engineering Ecosystem",
      icon: "fa-microchip"
    },
    {
      name: "Student Developer Chapters",
      sub: "Indore & Campus Buildathons",
      icon: "fa-graduation-cap"
    },
    {
      name: "Engineering Practitioners",
      sub: "Real-World Code Workflows",
      icon: "fa-network-wired"
    },
    {
      name: "Startup & Tech Builders",
      sub: "MVP & Automation Sprints",
      icon: "fa-rocket"
    }
  ],

  // ------------------------------------------------------------------------
  // 3. Technology Training Programs (8 Comprehensive Tracks, 6 Modules Each)
  // ------------------------------------------------------------------------
  programs: [
    {
      slug: "python-programming",
      title: "Python Programming",
      category: "programming-web",
      categoryLabel: "Programming & Web",
      badge: "Core Foundation",
      icon: "fa-brands fa-python",
      image: "assets/images/programs/prog-python.webp",
      imageAlt: "Futuristic 3D visual representing Python Programming at DeviX Academy",
      duration: "8 - 10 Weeks (Flexible)",
      mode: "Online / Offline (Indore) / Hybrid",
      audience: "Beginners, B.Tech, BCA, MCA, BSc, MSc & Career Switchers",
      shortDesc:
        "Master Python from core syntax and data structures to OOP architecture, Django/FastAPI backends, database querying, and automation.",
      overview:
        "Designed for zero-to-production fluency, this track builds deep problem-solving logic in Python before advancing into Object-Oriented system design, SQLite/PostgreSQL connectivity, REST APIs, and automated testing.",
      tools: ["Python 3.12", "OOP Patterns", "Git & GitHub", "SQL & ORM", "FastAPI / Django", "Pytest"],
      topics: [
        "Core Python",
        "Advanced Python",
        "Object-Oriented Programming",
        "Real-world projects"
      ],
      curriculum: [
        {
          module: "Module 01: Python Core & Problem Solving",
          details: "Variables, memory model, conditionals, loops, functions, recursion basics, and clean debugging workflows."
        },
        {
          module: "Module 02: Collections, Strings & Algorithms",
          details: "Lists, tuples, sets, dictionaries, comprehensions, string parsing, and algorithmic complexity thinking."
        },
        {
          module: "Module 03: Object-Oriented Architecture",
          details: "Classes, encapsulation, inheritance, polymorphism, magic methods, dataclasses, and clean design patterns."
        },
        {
          module: "Module 04: Files, Modules & Exception Safety",
          details: "CSV/JSON/PDF parsing, regular expressions, decorators, generators, virtual environments, and logging."
        },
        {
          module: "Module 05: Databases, APIs & Web Foundations",
          details: "SQL integration, consuming and building REST APIs with FastAPI/Django basics, and JSON schema validation."
        },
        {
          module: "Module 06: Automation, Testing & Capstone",
          details: "Pytest unit testing, task scheduling scripts, Git version control, and an evaluated production CLI/web build."
        }
      ],
      projects: [
        "Automated CSV/Invoice & Report Processor (CLI)",
        "RESTful Task Manager with SQLite & FastAPI",
        "Django/Flask Campus Portal Capstone with Git History"
      ],
      outcomes: [
        "Write clean, modular, PEP-8 compliant production Python code",
        "Design extensible software systems using Object-Oriented Programming",
        "Build database-backed utilities, web endpoints, and automated test suites",
        "Debug logic step-by-step and ship documented GitHub projects"
      ],
      brochureUrl: null
    },
    {
      slug: "data-analytics",
      title: "Data Analytics",
      category: "data-ai",
      categoryLabel: "Data & AI",
      badge: "Business Insights",
      icon: "fa-solid fa-chart-column",
      image: "assets/images/programs/prog-analytics.webp",
      imageAlt: "3D luminous Data Analytics and Business Intelligence chart visual",
      duration: "10 - 12 Weeks (Flexible)",
      mode: "Online / Offline (Indore) / Hybrid",
      audience: "Graduates, Business Analysts, Finance & Working Professionals",
      shortDesc:
        "Transform raw business datasets into executive decisions using Advanced Excel, SQL querying, interactive Power BI dashboards, and Python.",
      overview:
        "Built around real business reporting bottlenecks, you progress from structured Power Query transformations in Excel and complex SQL joins to star-schema data modeling in Power BI and automated Pandas EDA.",
      tools: ["Excel & Power Query", "PostgreSQL / MySQL", "Power BI", "DAX Formulas", "Pandas & NumPy", "KPI Design"],
      topics: [
        "Excel",
        "SQL",
        "Power BI",
        "Python for Analytics",
        "Business Intelligence"
      ],
      curriculum: [
        {
          module: "Module 01: Advanced Excel & Power Query",
          details: "XLOOKUP, dynamic arrays, PivotTables, Power Query ETL cleanup, conditional formatting, and KPI trackers."
        },
        {
          module: "Module 02: Relational Databases & Core SQL",
          details: "Database schemas, filtering, grouping, multi-table JOINs, subqueries, and query optimization fundamentals."
        },
        {
          module: "Module 03: Advanced SQL Analytics",
          details: "Common Table Expressions (CTEs), window functions (RANK, LAG, LEAD), cohort analysis, and views."
        },
        {
          module: "Module 04: Power BI Data Modeling & Star Schema",
          details: "Connecting multi-source data, relationship cardinality, calendar tables, and clean BI warehouse structure."
        },
        {
          module: "Module 05: DAX Measures & Executive Dashboards",
          details: "Time-intelligence DAX calculations, drill-through tooltips, bookmarks, row-level security concepts, and storytelling."
        },
        {
          module: "Module 06: Python EDA & End-to-End Case Study",
          details: "Pandas data wrangling, outlier handling, visual summaries, and presenting an executive sales/ops capstone."
        }
      ],
      projects: [
        "Retail & E-Commerce Profit/Margin Power BI Dashboard",
        "SaaS Cohort Retention & Funnel Audit in SQL",
        "Automated Weekly Excel + Pandas Operations Report"
      ],
      outcomes: [
        "Extract, join, and aggregate complex business tables using fluent SQL",
        "Architect clean star-schema Power BI reports powered by custom DAX measures",
        "Automate repetitive spreadsheet cleanup using Power Query and Python Pandas",
        "Present clear data-driven recommendations tailored for stakeholders"
      ],
      brochureUrl: null
    },
    {
      slug: "data-science",
      title: "Data Science",
      category: "data-ai",
      categoryLabel: "Data & AI",
      badge: "ML & Modeling",
      icon: "fa-solid fa-brain",
      image: "assets/images/programs/prog-datascience.webp",
      imageAlt: "3D neural data topology representing Data Science and Machine Learning",
      duration: "14 - 16 Weeks (Flexible)",
      mode: "Online / Offline (Indore) / Hybrid",
      audience: "Engineering Students, Analysts & Aspiring Data Scientists",
      shortDesc:
        "Build strong statistical intuition, clean real datasets, train predictive Machine Learning models, and serve visual insights.",
      overview:
        "Rather than blindly calling library functions, this curriculum pairs probability & statistical reasoning with Scikit-learn pipelines, feature engineering, hyperparameter tuning, and interactive model deployment.",
      tools: ["Python & Jupyter", "NumPy & Pandas", "Scikit-learn", "Matplotlib & Seaborn", "XGBoost Basics", "Streamlit"],
      topics: [
        "Statistics",
        "Python",
        "Machine Learning",
        "Data Visualization",
        "Practical projects"
      ],
      curriculum: [
        {
          module: "Module 01: Applied Statistics & Probability",
          details: "Distributions, variance, confidence intervals, A/B hypothesis testing, covariance, and correlation diagnostics."
        },
        {
          module: "Module 02: Scientific Python & Visual Storytelling",
          details: "Vectorized NumPy operations, Pandas pipelines, Matplotlib, Seaborn, Plotly charts, and missing-data strategy."
        },
        {
          module: "Module 03: Feature Engineering & Preprocessing",
          details: "Encoding, scaling, leakage prevention, SMOTE/imbalance handling, PCA concepts, and reproducible Scikit-learn pipelines."
        },
        {
          module: "Module 04: Regression & Classification Algorithms",
          details: "Linear/logistic models, decision trees, random forests, gradient boosting, ROC-AUC, precision-recall, and CV tuning."
        },
        {
          module: "Module 05: Unsupervised Learning & Time Series",
          details: "K-Means, hierarchical clustering, anomaly detection, PCA dimensionality reduction, and forecasting fundamentals."
        },
        {
          module: "Module 06: Model Packaging & Interactive Capstone",
          details: "SHAP feature interpretability, model serialization, building a live Streamlit inference UI, and technical defense."
        }
      ],
      projects: [
        "Customer Churn Prediction Pipeline with Explainability",
        "Housing / Demand Forecasting Regression Engine",
        "Deployed Streamlit ML Explorer Web App"
      ],
      outcomes: [
        "Audit and clean noisy datasets with sound statistical reasoning",
        "Build leak-free feature engineering and cross-validated ML pipelines",
        "Evaluate regression, classification, and clustering models accurately",
        "Ship interactive ML demos with visual explanations for non-technical users"
      ],
      brochureUrl: null
    },
    {
      slug: "artificial-intelligence",
      title: "Artificial Intelligence",
      category: "data-ai",
      categoryLabel: "Data & AI",
      badge: "GenAI & Agents",
      icon: "fa-solid fa-wand-magic-sparkles",
      image: "assets/images/programs/prog-ai.webp",
      imageAlt: "Luminous crystal lattice representing Artificial Intelligence and Generative AI",
      duration: "8 - 12 Weeks (Flexible)",
      mode: "Online / Offline (Indore) / Hybrid",
      audience: "Students, Developers, Leaders, Creators & Corporate Teams",
      shortDesc:
        "Master Generative AI architecture, structured prompt engineering, RAG workflows, AI developer APIs, and multi-step automation.",
      overview:
        "Move well beyond surface chat prompts. Learn how Large Language Models, embeddings, vector retrieval, function calling, and automation workflows solve real software, research, and enterprise bottlenecks safely.",
      tools: ["LLM APIs (Gemini/OpenAI)", "Prompt Frameworks", "Vector Embeddings & RAG", "Function Calling", "Python Automation", "Eval Testing"],
      topics: [
        "Generative AI",
        "Prompt Engineering",
        "AI Tools",
        "AI Automation",
        "Practical AI applications"
      ],
      curriculum: [
        {
          module: "Module 01: Foundations of Generative AI & LLMs",
          details: "Transformer intuition, tokens, context windows, temperature controls, multimodal models, and latency/cost tradeoffs."
        },
        {
          module: "Module 02: Structured Prompt & Context Engineering",
          details: "System roles, few-shot patterns, JSON schema outputs, guardrail constraints, and systematic prompt evaluation."
        },
        {
          module: "Module 03: Embeddings & Retrieval-Augmented Generation",
          details: "Chunking documents, semantic vector similarity search, citation grounding, and reducing model hallucinations."
        },
        {
          module: "Module 04: Tool Calling & Agentic Workflows",
          details: "Structured function schemas, multi-step task routing, API orchestration, and human-in-the-loop checkpoints."
        },
        {
          module: "Module 05: AI Productivity & Developer Copilots",
          details: "Accelerating coding, automated document synthesis, SQL/sheet generation, and responsible AI data privacy rules."
        },
        {
          module: "Module 06: Custom Generative AI Capstone Deployment",
          details: "Designing, evaluating, and deploying a domain knowledge assistant or automated workflow pipeline with live demo."
        }
      ],
      projects: [
        "Document Q&A Assistant with Source Citations (RAG)",
        "Automated Support Triage & Email Extraction Agent",
        "Custom Prompt Evaluation Benchmark & AI Utility App"
      ],
      outcomes: [
        "Design deterministic, schema-validated prompts for reliable production workflows",
        "Build Retrieval-Augmented Generation pipelines grounded in private documents",
        "Integrate AI APIs and tool-calling agents into practical software automation",
        "Audit outputs for safety, privacy hygiene, and hallucination resistance"
      ],
      brochureUrl: null
    },
    {
      slug: "web-development",
      title: "Web Development",
      category: "programming-web",
      categoryLabel: "Programming & Web",
      badge: "Modern Web",
      icon: "fa-solid fa-code",
      image: "assets/images/programs/prog-web.webp",
      imageAlt: "Layered futuristic UI and code frames for Web Development training",
      duration: "10 - 12 Weeks (Flexible)",
      mode: "Online / Offline (Indore) / Hybrid",
      audience: "College Students, Fresh Graduates & UI/Web Builders",
      shortDesc:
        "Craft responsive, accessible websites and interactive database-connected web applications from pixel-clean UI to live hosting.",
      overview:
        "Focuses on web standards that never go out of fashion: semantic HTML5, clean Flexbox & CSS Grid layouts, Bootstrap 5 composition, asynchronous Vanilla JavaScript, server routing, and live database persistence.",
      tools: ["HTML5 & Accessibility", "CSS3 Grid & Flex", "JavaScript ES6+", "Bootstrap 5", "Node / Backend Routing", "MySQL / PostgreSQL"],
      topics: [
        "HTML",
        "CSS",
        "JavaScript",
        "Bootstrap",
        "Backend development",
        "Database integration"
      ],
      curriculum: [
        {
          module: "Module 01: Semantic HTML5 & Technical SEO",
          details: "Document structure, accessible landmarks, forms, ARIA basics, Open Graph tags, and Core Web Vitals awareness."
        },
        {
          module: "Module 02: Modern CSS3, Grid, Flex & Bootstrap 5",
          details: "Responsive breakpoints, custom CSS properties, interactive transitions, clean glassmorphism, and Bootstrap utilities."
        },
        {
          module: "Module 03: JavaScript DOM, Events & Browser APIs",
          details: "ES6+ syntax, DOM manipulation, modular functions, form validation, interactive tabs/modals, and local state."
        },
        {
          module: "Module 04: Asynchronous JS & REST Integration",
          details: "Promises, async/await, Fetch API error handling, JSON rendering, filtering, search, and loading states."
        },
        {
          module: "Module 05: Server-Side Logic & Database CRUD",
          details: "Express/backend routing concepts, form processing, relational schema basics, CRUD queries, and validation."
        },
        {
          module: "Module 06: Responsive Audits & Live Publishing",
          details: "Cross-device browser testing (mobile to widescreen), asset optimization, custom domains, and live capstone deploy."
        }
      ],
      projects: [
        "Responsive Developer Portfolio & Case Study Showcase",
        "Interactive E-Commerce Storefront with Live Cart Filter",
        "Database-Backed Appointment / Enquiry Web App"
      ],
      outcomes: [
        "Architect responsive mobile-first layouts across phones, tablets, and desktops",
        "Write clean vanilla ES6+ JavaScript without relying blindly on heavy wrappers",
        "Integrate live REST endpoints and database CRUD workflows safely",
        "Publish SEO-ready websites with accessible markup and fast load speed"
      ],
      brochureUrl: null
    },
    {
      slug: "full-stack-development",
      title: "Full Stack Development",
      category: "programming-web",
      categoryLabel: "Programming & Web",
      badge: "End-to-End Engineering",
      icon: "fa-solid fa-cubes",
      image: "assets/images/programs/prog-fullstack.webp",
      imageAlt: "Interconnected 3D architecture stack representing Full Stack Development",
      duration: "16 - 20 Weeks (Flexible)",
      mode: "Online / Offline (Indore) / Hybrid",
      audience: "Aspiring Software Engineers, B.Tech/MCA Students & Developers",
      shortDesc:
        "Architect production web applications end-to-end across modular frontends, scalable REST APIs, database modeling, and cloud deployment.",
      overview:
        "Comprehensive software engineering training covering client state, authentication & RBAC, transactional database design, API documentation, containerized deployment, and real engineering team Git workflows.",
      tools: ["Modern Frontend JS/React", "Node.js / Express", "PostgreSQL / MongoDB", "JWT & Auth", "Docker & CI/CD", "Git Workflows"],
      topics: [
        "Frontend",
        "Backend",
        "APIs",
        "Database",
        "Deployment"
      ],
      curriculum: [
        {
          module: "Module 01: Component UI & Client Architecture",
          details: "Modular component structure, state/props flow, routing, reusable UI systems, and predictable error boundaries."
        },
        {
          module: "Module 02: Scalable Backend & REST API Design",
          details: "Controller-service layering, pagination, rate limiting, structured validation, middleware, and OpenAPI docs."
        },
        {
          module: "Module 03: Database Schema Design & Indexing",
          details: "Relational normalization, MongoDB document patterns, migrations, query indexing, and transaction integrity."
        },
        {
          module: "Module 04: Authentication, JWT & Role Guards",
          details: "Password hashing, JWT vs session tradeoffs, OAuth concepts, CORS, input sanitization, and RBAC routes."
        },
        {
          module: "Module 05: Automated Testing & Git Collaboration",
          details: "Unit & API integration tests, feature branching, pull request reviews, environment secrets, and logging."
        },
        {
          module: "Module 06: Docker, CI/CD & Production Capstone",
          details: "Multi-stage Docker builds, GitHub Actions automation, cloud hosting setup, and full-stack capstone defense."
        }
      ],
      projects: [
        "Multi-Role Learning / Project Tracker Platform (Auth + CRUD)",
        "Scalable E-Commerce / Booking Backend API + Dashboard",
        "Containerized Production Full-Stack Capstone on Cloud"
      ],
      outcomes: [
        "Design cleanly layered frontend and backend architectures that scale",
        "Secure applications with proper authentication, authorization, and validation",
        "Model relational and document databases for speed and consistency",
        "Ship full-stack systems using Git workflows, Docker, and cloud CI/CD"
      ],
      brochureUrl: null
    },
    {
      slug: "cloud-computing",
      title: "Cloud Computing",
      category: "cloud-security",
      categoryLabel: "Cloud & Security",
      badge: "Infrastructure",
      icon: "fa-solid fa-cloud",
      image: "assets/images/programs/prog-cloud.webp",
      imageAlt: "Crystalline cloud server matrix visual for Cloud Computing",
      duration: "8 - 10 Weeks (Flexible)",
      mode: "Online / Offline (Indore) / Hybrid",
      audience: "Developers, IT Graduates, System Admins & Tech Teams",
      shortDesc:
        "Master modern cloud architecture, Linux/networking essentials, IAM policies, container workloads, and reliable production deployment.",
      overview:
        "Turn abstract cloud buzzwords into hands-on infrastructure confidence. Configure compute instances, object storage, VPC subnets, serverless functions, Docker containers, and monitoring alarms step by step.",
      tools: ["Linux CLI", "AWS / Cloud Core", "IAM & VPC Networking", "Docker Containers", "Nginx Reverse Proxy", "CI/CD & Monitoring"],
      topics: [
        "Cloud Fundamentals",
        "Cloud Deployment",
        "Cloud Platforms",
        "Practical cloud projects"
      ],
      curriculum: [
        {
          module: "Module 01: Cloud Architecture & Service Models",
          details: "IaaS, PaaS, SaaS, regions & availability zones, shared responsibility, and billing/free-tier cost controls."
        },
        {
          module: "Module 02: Linux Administration & Cloud Networking",
          details: "Shell commands, SSH keys, systemd services, IP CIDR, VPC subnets, security groups, DNS, and TLS certificates."
        },
        {
          module: "Module 03: Identity Management (IAM) & Storage",
          details: "Least-privilege policies, roles, S3/object storage lifecycle, static hosting, and managed relational backups."
        },
        {
          module: "Module 04: Compute, Load Balancing & Serverless",
          details: "Virtual machines, reverse proxy routing with Nginx, auto-scaling concepts, and event-driven cloud functions."
        },
        {
          module: "Module 05: Docker Containers & App Deployment",
          details: "Container images, Docker Compose stacks, environment secrets, zero-downtime release steps, and health probes."
        },
        {
          module: "Module 06: Observability, Alerts & Cloud Capstone",
          details: "Centralized logs, uptime dashboards, budget alerts, and deploying a fault-tolerant live cloud application."
        }
      ],
      projects: [
        "Hardened Cloud VM with Nginx, Custom Domain & HTTPS",
        "Static Assets + Serverless Backend Workflow with Storage",
        "Containerized App Deployment with Monitoring & Budget Alarms"
      ],
      outcomes: [
        "Provision and troubleshoot Linux compute, storage, and VPC networking safely",
        "Enforce IAM least-privilege access and budget safeguards from day one",
        "Deploy applications using reverse proxies, containers, and automated pipelines",
        "Monitor service uptime, logs, and resource utilization proactively"
      ],
      brochureUrl: null
    },
    {
      slug: "cyber-security",
      title: "Cyber Security",
      category: "cloud-security",
      categoryLabel: "Cloud & Security",
      badge: "Defense & Hygiene",
      icon: "fa-solid fa-shield-halved",
      image: "assets/images/programs/prog-cyber.webp",
      imageAlt: "3D dark cryptographic shield visual representing Cyber Security",
      duration: "8 - 12 Weeks (Flexible)",
      mode: "Online / Offline (Indore) / Hybrid",
      audience: "Students, Web Developers, IT Administrators & Enterprise Staff",
      shortDesc:
        "Develop practical defensive security fluency across system hardening, TCP/IP defense, OWASP Top 10 mitigation, and threat triage.",
      overview:
        "Essential for developers, IT graduates, and teams responsible for keeping data safe. Combine foundational networking & cryptography with hands-on OWASP web vulnerability remediation and incident response checklists.",
      tools: ["TCP/IP & Wireshark Basics", "Linux Permissions", "OWASP Top 10", "TLS / Hashing", "HTTP Security Headers", "Audit Checklists"],
      topics: [
        "Security Fundamentals",
        "Network Security",
        "Web Security",
        "Practical security awareness"
      ],
      curriculum: [
        {
          module: "Module 01: Security Principles & Threat Modeling",
          details: "CIA triad, attack surfaces, threat actors, defense-in-depth, MFA hygiene, and risk prioritization basics."
        },
        {
          module: "Module 02: Cryptography, Hashing & Identity",
          details: "Symmetric vs asymmetric encryption, bcrypt/Argon2 password hashing, digital signatures, and TLS handshakes."
        },
        {
          module: "Module 03: Network Defense & Packet Awareness",
          details: "Ports, DNS security, firewall rules, VPN tunneling, packet inspection fundamentals, and Wi-Fi hardening."
        },
        {
          module: "Module 04: OWASP Top 10 & Secure Web Coding",
          details: "Preventing SQL Injection, XSS, CSRF, SSRF, broken access control, and configuring CSP/CORS headers properly."
        },
        {
          module: "Module 05: OS Hardening & Secrets Management",
          details: "Linux privilege boundaries, SSH hardening, keeping dependencies patched, and eliminating hardcoded keys."
        },
        {
          module: "Module 06: Phishing Defense & Audit Capstone",
          details: "Log review fundamentals, phishing triage drills, vulnerability remediation reporting, and web security audit."
        }
      ],
      projects: [
        "OWASP Top 10 Vulnerability Audit & Patch Report on Sample App",
        "Hardened HTTP Security Header & TLS Verification Setup",
        "Team Cyber Hygiene & Incident Response Playbook"
      ],
      outcomes: [
        "Identify and remediate common OWASP Top 10 web vulnerabilities in code",
        "Analyze network traffic patterns, firewall boundaries, and authentication flows",
        "Implement proper secret management, hashing, and secure HTTP headers",
        "Elevate organizational defense against phishing and misconfiguration risks"
      ],
      brochureUrl: null
    }
  ],

  // ------------------------------------------------------------------------
  // 4. Interactive Industry Solutions (8 Dynamic Industries)
  // ------------------------------------------------------------------------
  industries: [
    {
      id: "it-software",
      name: "IT and Software",
      icon: "fa-laptop-code",
      tagline: "Accelerate engineering velocity & intelligent automation",
      description:
        "Equip software engineers, QA specialists, and product squads with AI-assisted coding workflows, modern full-stack practices, and cloud deployment mastery.",
      useCases: [
        "AI-assisted software development",
        "Code optimization & refactoring",
        "Automated testing & QA pipelines",
        "Scalable application development"
      ],
      recommendedPrograms: [
        "artificial-intelligence",
        "full-stack-development",
        "python-programming",
        "cloud-computing"
      ],
      accentColor: "#8B5CF6",
      visualTitle: "Engineering Velocity Matrix",
      visualStats: [
        { label: "Focus", value: "AI Dev Workflows" },
        { label: "Stack", value: "Python • Full Stack • Cloud" }
      ]
    },
    {
      id: "banking-finance",
      name: "Banking and Finance",
      icon: "fa-landmark",
      tagline: "Precision reporting, compliance automation & risk modeling",
      description:
        "Empower analysts and operations teams to replace manual spreadsheet bottlenecks with automated Python scripts, SQL pipelines, and executive Power BI intelligence.",
      useCases: [
        "Financial data analysis & reconciliation",
        "Interactive Power BI executive dashboards",
        "Python workflow & reporting automation",
        "Data-driven risk analytics & forecasting"
      ],
      recommendedPrograms: [
        "data-analytics",
        "python-programming",
        "data-science",
        "cyber-security"
      ],
      accentColor: "#22D3EE",
      visualTitle: "Quantitative Intelligence Hub",
      visualStats: [
        { label: "Focus", value: "BI & Risk Pipelines" },
        { label: "Stack", value: "SQL • Power BI • Python" }
      ]
    },
    {
      id: "healthcare",
      name: "Healthcare",
      icon: "fa-heart-pulse",
      tagline: "Streamline clinical reporting, analytics & patient workflows",
      description:
        "Support healthcare analysts, medical administrators, and health-tech builders in turning operational records into clear insights with strict security awareness.",
      useCases: [
        "Healthcare operational & patient data analytics",
        "AI-assisted administrative documentation & reporting",
        "Automated appointment & intake workflow routing",
        "Data privacy & cyber security hygiene"
      ],
      recommendedPrograms: [
        "data-analytics",
        "artificial-intelligence",
        "cyber-security"
      ],
      accentColor: "#A78BFA",
      visualTitle: "Health-Tech Operations Grid",
      visualStats: [
        { label: "Focus", value: "Clinical Analytics & Privacy" },
        { label: "Stack", value: "BI • GenAI • Security" }
      ]
    },
    {
      id: "education",
      name: "Education",
      icon: "fa-graduation-cap",
      tagline: "Modernize curricula, faculty enablement & academic operations",
      description:
        "Partner with universities, colleges, and faculty teams to bring practical AI literacy, student coding labs, and academic workflow automation onto campus.",
      useCases: [
        "AI-powered personalized learning & lab assistance",
        "Educational performance & cohort analytics",
        "Automation of academic & administrative workflows",
        "Faculty enablement & campus bootcamps"
      ],
      recommendedPrograms: [
        "artificial-intelligence",
        "python-programming",
        "web-development",
        "data-analytics"
      ],
      accentColor: "#38BDF8",
      visualTitle: "Campus Innovation Blueprint",
      visualStats: [
        { label: "Focus", value: "Campus Tech & AI Readiness" },
        { label: "Stack", value: "Python • GenAI • Web" }
      ]
    },
    {
      id: "manufacturing",
      name: "Manufacturing",
      icon: "fa-industry",
      tagline: "Operational visibility, predictive analytics & process control",
      description:
        "Enable production engineers and plant analysts to monitor throughput KPIs, reduce downtime through predictive modeling, and automate inventory reporting.",
      useCases: [
        "Production floor KPI & quality dashboards",
        "Predictive maintenance modeling with ML",
        "Supply-chain & inventory Python automation",
        "Operational OT/IT security awareness"
      ],
      recommendedPrograms: [
        "data-analytics",
        "data-science",
        "python-programming",
        "cyber-security"
      ],
      accentColor: "#8B5CF6",
      visualTitle: "Smart Production Telemetry",
      visualStats: [
        { label: "Focus", value: "Throughput & Predictive ML" },
        { label: "Stack", value: "Power BI • Python • ML" }
      ]
    },
    {
      id: "retail-ecommerce",
      name: "Retail and E-commerce",
      icon: "fa-cart-shopping",
      tagline: "Conversion intelligence, personalization & digital storefronts",
      description:
        "Equip digital commerce teams to analyze buyer cohorts, automate catalog operations using Generative AI, and scale responsive web storefronts.",
      useCases: [
        "Customer cohort & basket-size analytics",
        "AI-assisted product catalog & support workflows",
        "High-converting responsive e-commerce interfaces",
        "Cloud scaling for peak seasonal traffic"
      ],
      recommendedPrograms: [
        "web-development",
        "full-stack-development",
        "data-analytics",
        "artificial-intelligence"
      ],
      accentColor: "#22D3EE",
      visualTitle: "Commerce Growth Engine",
      visualStats: [
        { label: "Focus", value: "Storefronts & Buyer Insights" },
        { label: "Stack", value: "Web • Full Stack • Analytics" }
      ]
    },
    {
      id: "marketing-media",
      name: "Marketing and Media",
      icon: "fa-bullhorn",
      tagline: "Creative velocity, campaign attribution & GenAI workflows",
      description:
        "Train growth marketers, content teams, and creative strategists to multiply campaign output with structured Generative AI and measurable analytics.",
      useCases: [
        "Generative AI content & ideation pipelines",
        "Campaign attribution & conversion dashboards",
        "Automated research & reporting workflows",
        "Landing page prototyping & web optimization"
      ],
      recommendedPrograms: [
        "artificial-intelligence",
        "data-analytics",
        "web-development"
      ],
      accentColor: "#A78BFA",
      visualTitle: "Creative AI & Attribution Lab",
      visualStats: [
        { label: "Focus", value: "GenAI Content & ROI Metrics" },
        { label: "Stack", value: "GenAI • Prompts • BI" }
      ]
    },
    {
      id: "startups-entrepreneurship",
      name: "Startups and Entrepreneurship",
      icon: "fa-rocket",
      tagline: "Ship faster with lean AI stacks & full-stack execution",
      description:
        "Help founders, early-stage teams, and student innovators validate products rapidly using modern full-stack engineering, AI agents, and cloud infrastructure.",
      useCases: [
        "Rapid MVP engineering & API integration",
        "Lean team productivity with AI automation",
        "Product telemetry & early-user analytics",
        "Cost-efficient cloud deployment"
      ],
      recommendedPrograms: [
        "full-stack-development",
        "artificial-intelligence",
        "cloud-computing",
        "python-programming"
      ],
      accentColor: "#34D399",
      visualTitle: "Venture Launchpad Stack",
      visualStats: [
        { label: "Focus", value: "Rapid MVP & Lean AI" },
        { label: "Stack", value: "Full Stack • AI • Cloud" }
      ]
    }
  ],

  // ------------------------------------------------------------------------
  // 5. Why Choose DeviX Academy (8 Pillars)
  // ------------------------------------------------------------------------
  whyChooseUs: [
    {
      title: "Practical, Hands-On Learning",
      desc: "Every concept is reinforced immediately inside live coding labs, real software tools, and guided implementation sprints.",
      icon: "fa-laptop-code"
    },
    {
      title: "Industry-Oriented Curriculum",
      desc: "Syllabi are structured around real workflows, frameworks, and tools actively used by engineering and analytics teams.",
      icon: "fa-layer-group"
    },
    {
      title: "Experienced Technical Trainers",
      desc: "Learn directly from technical practitioners who translate complex architecture into clear, repeatable mental models.",
      icon: "fa-chalkboard-user"
    },
    {
      title: "Real-World Projects",
      desc: "Build portfolio-grade dashboards, APIs, ML models, and AI automation pipelines instead of memorizing textbook slides.",
      icon: "fa-diagram-project"
    },
    {
      title: "Live Coding Sessions",
      desc: "Watch real debugging, architecture decisions, and prompt iteration unfold live with interactive Q&A during every module.",
      icon: "fa-terminal"
    },
    {
      title: "Career-Focused Skill Development",
      desc: "Bridge academic theory and workplace readiness through technical review, problem solving, and structured project showcases.",
      icon: "fa-compass"
    },
    {
      title: "Updated Technology Training",
      desc: "Continuous syllabus updates keep learners aligned with rapidly evolving Generative AI, Python, cloud, and web ecosystems.",
      icon: "fa-arrows-rotate"
    },
    {
      title: "Personalized Learning Support",
      desc: "Dedicated doubt resolution, individualized pace check-ins, and actionable feedback tailored to your current skill level.",
      icon: "fa-headset"
    }
  ],

  // ------------------------------------------------------------------------
  // 6. Five-Step Learning Methodology
  // ------------------------------------------------------------------------
  methodology: [
    {
      step: "01",
      title: "Understanding Learning Goals",
      shortTitle: "Learning Goals",
      subtitle: "Diagnostic Alignment & Skill Mapping",
      description:
        "We begin by understanding the learner's academic or professional background, technical baseline, career objectives, and organization-specific requirements.",
      deliverables: [
        "Skill baseline assessment",
        "Career or corporate outcome alignment",
        "Learning pace & format recommendation"
      ],
      icon: "fa-bullseye"
    },
    {
      step: "02",
      title: "Curriculum Planning",
      shortTitle: "Curriculum Plan",
      subtitle: "Structured Industry-Aligned Roadmap",
      description:
        "Create a clear, milestone-driven learning roadmap tailored to the learner's goals and real-world industry requirements, eliminating outdated filler.",
      deliverables: [
        "Module-by-module milestone blueprint",
        "Tooling & environment setup checklist",
        "Targeted real-world use cases"
      ],
      icon: "fa-map-location-dot"
    },
    {
      step: "03",
      title: "Practical Training",
      shortTitle: "Practical Labs",
      subtitle: "Live Coding, Demos & Interactive Sessions",
      description:
        "Deliver high-engagement interactive sessions featuring live coding, guided system demonstrations, and hands-on lab exercises you build alongside the mentor.",
      deliverables: [
        "Interactive mentor-led live sessions",
        "Hands-on sandbox & coding challenges",
        "Real-time architectural walkthroughs"
      ],
      icon: "fa-code-branch"
    },
    {
      step: "04",
      title: "Projects and Assessment",
      shortTitle: "Projects & Review",
      subtitle: "Evaluated Builds & Capstone Execution",
      description:
        "Evaluate practical mastery through structured assignments, technical checkpoints, and end-to-end real-world projects that prove capability.",
      deliverables: [
        "Practical checkpoint assignments",
        "Evaluated capstone system build",
        "Code & dashboard quality feedback"
      ],
      icon: "fa-cubes-stacked"
    },
    {
      step: "05",
      title: "Continuous Improvement",
      shortTitle: "Growth Loop",
      subtitle: "Mentorship, Doubt Resolution & Next Steps",
      description:
        "Provide ongoing feedback, dedicated doubt-solving support, portfolio refinement tips, and clear guidance for continued technical growth.",
      deliverables: [
        "Dedicated doubt-clearing support",
        "Portfolio & GitHub polish guidance",
        "Next-stage specialization roadmap"
      ],
      icon: "fa-arrow-trend-up"
    }
  ],

  // ------------------------------------------------------------------------
  // 7. Corporate Training Offerings
  // ------------------------------------------------------------------------
  corporateTracks: [
    {
      title: "AI Literacy Programs",
      desc: "Build confident, responsible AI fluency across non-technical and cross-functional corporate departments.",
      icon: "fa-lightbulb"
    },
    {
      title: "Generative AI Training",
      desc: "Equip teams with structured prompting, custom AI workflows, and real operational automation pipelines.",
      icon: "fa-wand-magic-sparkles"
    },
    {
      title: "Data Analytics Training",
      desc: "Upskill analysts and managers in Excel automation, SQL querying, and executive storytelling.",
      icon: "fa-chart-pie"
    },
    {
      title: "Python and Automation",
      desc: "Automate repetitive file processing, reporting, and API integrations across engineering & ops teams.",
      icon: "fa-brands fa-python"
    },
    {
      title: "Web Development",
      desc: "Train internal engineering squads on modern responsive UI, JavaScript, and backend integration.",
      icon: "fa-globe"
    },
    {
      title: "Business Intelligence",
      desc: "Design scalable Power BI data models and real-time enterprise dashboards for leadership visibility.",
      icon: "fa-chart-line"
    },
    {
      title: "Customized Technical Workshops",
      desc: "Tailored 1-day to multi-week sprints built directly around your company's real tech stack and KPIs.",
      icon: "fa-gears"
    }
  ],

  // ------------------------------------------------------------------------
  // 8. Verified Student & Cohort Reviews (mreviews + Visual Portrait Profiles)
  // ------------------------------------------------------------------------
  testimonials: [
    {
      name: "Aarav Verma",
      role: "B.Tech CSE Learner • Batch Project",
      organization: "Verified Review • mreviews",
      program: "Python & Django",
      avatar: "assets/images/reviews/reviewer-1.webp",
      rating: 5,
      quote:
        "Excellent mentor and teacher. The Python course covered everything from basics to Django. I built my first web app within weeks of joining. Thank you Ram Sir!"
    },
    {
      name: "Sneha Deshmukh",
      role: "Web Developer • Portfolio Cohort",
      organization: "Verified Review • mreviews",
      program: "Web Development",
      avatar: "assets/images/reviews/reviewer-2.webp",
      rating: 5,
      quote:
        "The web development course is comprehensive and very well-structured. I built my complete portfolio website after finishing it! Ram Sir's guidance is exceptional."
    },
    {
      name: "Ananya Joshi",
      role: "Data Science Learner • Indore",
      organization: "Verified Review • mreviews",
      program: "ML & Data Visualization",
      avatar: "assets/images/reviews/reviewer-3.webp",
      rating: 5,
      quote:
        "One of the best teachers I've ever learned from! Explains every concept practically. Finally understand machine learning and data visualization clearly. Truly amazing teaching style!"
    },
    {
      name: "Priya Nair",
      role: "MCA Graduate • Cloud Engineering Track",
      organization: "Verified Review • mreviews",
      program: "Cloud Computing",
      avatar: "assets/images/reviews/reviewer-4.webp",
      rating: 5,
      quote:
        "Ram Sir made cloud computing so easy to understand! His real-world examples and hands-on projects helped me get an internship in cloud engineering. Highly recommended!"
    },
    {
      name: "Rohan Tiwari",
      role: "B.Tech Final Year • Indore",
      organization: "Verified Review • mreviews",
      program: "Coding & Project Mentorship",
      avatar: "assets/images/reviews/reviewer-5.webp",
      rating: 5,
      quote:
        "Best coding coach in Indore! Very patient with doubts, explains in Hindi/English mix that makes everything clear. My B.Tech project was a success because of Ram Sir!"
    },
    {
      name: "Meera Kulkarni",
      role: "Business Analyst • Working Professional",
      organization: "Analytics Cohort • DeviX Academy",
      program: "Data Analytics & Power BI",
      avatar: "assets/images/reviews/reviewer-6.webp",
      rating: 5,
      quote:
        "Moving from manual Excel spreadsheets to clean SQL queries and interactive Power BI dashboards completely transformed how I structure and deliver business reports."
    },
    {
      name: "Karan Malhotra",
      role: "Full Stack Trainee • Capstone Track",
      organization: "Verified Review • mreviews",
      program: "Full Stack Development",
      avatar: "assets/images/reviews/reviewer-7.webp",
      rating: 5,
      quote:
        "Ram Sir's practical approach helped me build a real project and land my first internship. Very approachable and knowledgeable teacher."
    },
    {
      name: "Ishita Sharma",
      role: "BCA First-Time Coder • Indore",
      organization: "Verified Review • mreviews",
      program: "Zero-to-Advanced Foundation",
      avatar: "assets/images/reviews/reviewer-8.webp",
      rating: 5,
      quote:
        "Teaching methods are engaging and help understand difficult topics easily. Always ready to help and gives 100% so even zero-level students can reach high level!"
    },
    {
      name: "Vivek Patel",
      role: "Software Engineer • Backend & SQL",
      organization: "Verified Review • mreviews",
      program: "Python & Queries",
      avatar: "assets/images/reviews/reviewer-9.webp",
      rating: 5,
      quote:
        "Ram Sir's sessions are crystal clear, well-structured and very practical. He explains complex queries in the simplest way possible. Best Python teacher I've had!"
    },
    {
      name: "Rajesh Agarwal",
      role: "Engineering Lead • Corporate Workshop",
      organization: "Enterprise Upskilling • DeviX Academy",
      program: "Generative AI & Cyber Security",
      avatar: "assets/images/reviews/reviewer-10.webp",
      rating: 5,
      quote:
        "Focused, practical training sessions on Generative AI workflow automation and web security hygiene that our engineers applied straight away in daily sprints."
    }
  ],

  // ------------------------------------------------------------------------
  // 9. Lead Technical Mentor (Single Dedicated Lead Mentor)
  // ------------------------------------------------------------------------
  trainers: [
    {
      isLead: true,
      name: "Ramgopal Prajapati (Ram Sir)",
      handle: "@iamramsir",
      badgeNote: "@iamramsir • B.Tech & M.Tech • Indore, India",
      designation: "Founder & Lead Technical Trainer — Programming Teacher & AI Mentor",
      image: "assets/images/team/trainer-lead.webp",
      imageAlt: "Ramgopal Prajapati (Ram Sir | iamramsir) — Lead Technical Trainer & Programming Teacher in Indore at DeviX Academy",
      expertise: [
        "Python & Django / FastAPI",
        "Generative AI & Machine Learning",
        "Full Stack Web Development",
        "SQL, Power BI & Data Analytics",
        "Cloud Architecture & Dev Mentorship"
      ],
      bio: "Ramgopal Prajapati — widely recognized as Ram Sir (@iamramsir), B.Tech (IT) and M.Tech graduate — is a dedicated technical trainer, programming teacher, and software & cloud engineering mentor in Indore, Madhya Pradesh. Every batch at DeviX Academy is personally mentored by Ram Sir with crystal-clear Hindi/English concept breakdowns, live debugging, and production capstone builds.",
      social: {
        linkedin: "https://www.linkedin.com/",
        github: "https://github.com/ramgopal-prajapati",
        portfolio: "https://ramgopal-prajapati.github.io/",
        reviews: "https://ramgopal-prajapati.github.io/mreviews/"
      }
    }
  ],

  // ------------------------------------------------------------------------
  // 10. Events & Training Gallery (Clean Category Filters Matching UI)
  // ------------------------------------------------------------------------
  gallery: [
    {
      id: "gal-1",
      category: "workshops",
      categoryLabel: "Workshops",
      title: "Generative AI & Python Live Coding Sprint",
      caption: "Hands-on LLM prompt engineering, vector search, and FastAPI automation pipeline built live in studio.",
      image: "assets/images/gallery/gallery-bootcamp.webp"
    },
    {
      id: "gal-2",
      category: "corporate",
      categoryLabel: "Corporate Sessions",
      title: "Enterprise AI & Analytics Enablement",
      caption: "Customized corporate workshops aligning engineering and business teams on modern AI & automation tools.",
      image: "assets/images/gallery/gallery-corporate.webp"
    },
    {
      id: "gal-3",
      category: "demos",
      categoryLabel: "Project Demos",
      title: "Power BI & Data Science Capstone Showcase",
      caption: "Learners presenting executive DAX dashboards, SQL analytics pipelines, and evaluated ML benchmarks.",
      image: "assets/images/gallery/gallery-demo.webp"
    },
    {
      id: "gal-4",
      category: "events",
      categoryLabel: "Tech Events",
      title: "Campus Buildathon & Full-Stack Review",
      caption: "Collaborative Git branching, REST API integration, and live deployment sprints for B.Tech, BCA & MCA students.",
      image: "assets/images/gallery/gallery-hackathon.webp"
    },
    {
      id: "gal-5",
      category: "workshops",
      categoryLabel: "Workshops",
      title: "Cloud Infrastructure & Cyber Defense Lab",
      caption: "Practical cloud VM provisioning, Nginx/HTTPS hardening, and OWASP security walkthroughs.",
      image: "assets/images/gallery/gallery-cloud-lab.webp"
    },
    {
      id: "gal-6",
      category: "events",
      categoryLabel: "Tech Events",
      title: "DeviX Innovation & Tech Symposium",
      caption: "Community tech showcase uniting Python, GenAI, Data Analytics, Full Stack, Cloud, and Cyber cohorts.",
      image: "assets/images/gallery/gallery-summit.webp",
      isVideoShowcase: true
    }
  ],

  // ------------------------------------------------------------------------
  // 11. Frequently Asked Questions (All 9 Core Questions)
  // ------------------------------------------------------------------------
  faqs: [
    {
      question: "What training programs does DeviX Academy offer?",
      answer:
        "DeviX Academy offers practical, industry-oriented programs in Python Programming, Data Analytics (Excel, SQL, Power BI, Python), Data Science, Artificial Intelligence (Generative AI & Automation), Web Development, Full Stack Development, Cloud Computing, Cyber Security, and customized Corporate Technical Training."
    },
    {
      question: "Are programs suitable for beginners?",
      answer:
        "Yes. Tracks such as Python Programming, Web Development, Data Analytics, and AI Literacy begin with structured fundamentals before progressing to intermediate and real-world project levels. During Stage 1 (Understanding Learning Goals), our team helps match you to the right starting point."
    },
    {
      question: "Do you provide practical projects?",
      answer:
        "Yes. Practical execution is central to our five-step learning journey. Every track includes live coding exercises, domain assignments, and evaluated capstone projects designed to build real capability and a verifiable portfolio."
    },
    {
      question: "Are online and offline sessions available?",
      answer:
        "Yes, we offer interactive offline classroom training and workshops in Indore, Madhya Pradesh alongside live mentor-led online batches and hybrid learning formats across India for students, developers, and corporate teams."
    },
    {
      question: "Do you provide internship opportunities?",
      answer:
        "DeviX Academy offers structured internship and project-based learning pathways focused on technical skill development, practical assignments, and portfolio building. You can apply directly via our Careers & Internships form. Note that internships focus on hands-on training and project execution rather than guaranteed job placement."
    },
    {
      question: "Is there any certificate after training?",
      answer:
        "Yes. Learners who actively complete the training modules, required assignments, and project assessments receive a DeviX Academy Certificate of Completion reflecting the skills and project track completed."
    },
    {
      question: "How can I enrol?",
      answer:
        "You can enrol by submitting the Enquiry Form on our website, selecting your preferred program from the Programs section, or messaging our admissions desk directly on WhatsApp (+91 97535 28324) to confirm upcoming batch schedules."
    },
    {
      question: "Can companies request customized training?",
      answer:
        "Yes. Organizations can request bespoke workshops or multi-week corporate upskilling cohorts tailored to their exact team roles, internal tools, and business objectives via our Corporate Training section or dedicated Corporate Training page."
    },
    {
      question: "How can I contact the academy?",
      answer:
        "You can reach DeviX Academy immediately via WhatsApp at +91 97535 28324, submit an enquiry through our online forms on any page, or visit our Contact page for direct communication options."
    },
    {
      question: "Who leads technical training at DeviX Academy?",
      answer:
        "Technical mentorship at DeviX Academy is led by Ramgopal Prajapati (popularly known as Ram Sir / @iamramsir), a dedicated technical trainer, programming teacher, and hands-on developer mentor based in Indore, helping coders, B.Tech/BCA/MCA students, and corporate teams build industry-ready engineering and AI skills."
    }
  ]
};
