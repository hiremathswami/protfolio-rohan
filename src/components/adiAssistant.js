import { portfolioData } from '../data/portfolioData.js';

export class AdiAssistant {
  constructor() {
    this.data = portfolioData;
    this.speechSynth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
    this.speechRecognition = null;
    this.isListening = false;
    this.currentlySpeakingUtterance = null;
    this.activeSpeakerBtn = null;
    this.initVoiceRecognition();
  }

  // Initialize Speech-to-Text Recognition safely
  initVoiceRecognition() {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.speechRecognition = new SpeechRecognition();
      this.speechRecognition.continuous = false;
      this.speechRecognition.interimResults = false;
      this.speechRecognition.lang = 'en-US';
    }
  }

  // Toggle Microphone for Voice-to-Text Input
  toggleVoiceInput(onResultCallback, onEndCallback, onErrorCallback) {
    if (!this.speechRecognition) {
      if (onErrorCallback) onErrorCallback("Voice input is not supported in this browser.");
      return false;
    }

    if (this.isListening) {
      this.speechRecognition.stop();
      this.isListening = false;
      if (onEndCallback) onEndCallback(false);
      return false;
    }

    this.speechRecognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResultCallback) onResultCallback(transcript);
    };

    this.speechRecognition.onend = () => {
      this.isListening = false;
      if (onEndCallback) onEndCallback(false);
    };

    this.speechRecognition.onerror = (err) => {
      this.isListening = false;
      if (onEndCallback) onEndCallback(false);
      if (onErrorCallback) onErrorCallback("Voice recognition error or permission denied.");
    };

    try {
      this.speechRecognition.start();
      this.isListening = true;
      if (onEndCallback) onEndCallback(true);
      return true;
    } catch (e) {
      this.isListening = false;
      if (onEndCallback) onEndCallback(false);
      return false;
    }
  }

  // Read Response Aloud using SpeechSynthesis (Text-to-Speech)
  speakText(text, btnElement, onStateChange) {
    if (!this.speechSynth) return;

    // If currently speaking or pending, cancel speech immediately
    if (this.speechSynth.speaking || this.speechSynth.pending) {
      const isSameButton = (this.activeSpeakerBtn === btnElement);
      this.stopSpeech();
      if (isSameButton) {
        if (onStateChange) onStateChange(false);
        return;
      }
    }

    let cleanText = text.replace(/<[^>]*>/g, '').replace(/Source: [^\n]*/g, '').replace(/•/g, '').trim();
    // Phonetic replacement for Speech Synthesis so voice engines pronounce "Aadi" naturally instead of spelling "A-D-I"
    cleanText = cleanText.replace(/\bAdi\b/gi, 'Aadi');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    this.activeSpeakerBtn = btnElement;
    this.currentlySpeakingUtterance = utterance;

    utterance.onend = () => {
      if (this.activeSpeakerBtn === btnElement) {
        this.activeSpeakerBtn = null;
        this.currentlySpeakingUtterance = null;
        if (onStateChange) onStateChange(false);
      }
    };

    utterance.onerror = () => {
      if (this.activeSpeakerBtn === btnElement) {
        this.activeSpeakerBtn = null;
        this.currentlySpeakingUtterance = null;
        if (onStateChange) onStateChange(false);
      }
    };

    if (onStateChange) onStateChange(true);
    try {
      this.speechSynth.speak(utterance);
    } catch (e) {
      if (onStateChange) onStateChange(false);
    }
  }

  // Stop All Active Speech
  stopSpeech() {
    if (this.speechSynth) {
      try {
        this.speechSynth.pause();
        this.speechSynth.cancel();
      } catch (e) {}
    }
    if (this.activeSpeakerBtn) {
      this.activeSpeakerBtn.classList.remove('speaking');
      this.activeSpeakerBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> Listen`;
      this.activeSpeakerBtn = null;
    }
    this.currentlySpeakingUtterance = null;
  }

  // Get structured welcome message object
  getGreetingObject() {
    const hasVisited = sessionStorage.getItem('adi_has_visited');
    if (hasVisited) {
      return {
        text: "I’m Adi, Rohan Hiremathswami’s AI portfolio assistant. How can I help you explore Rohan’s work today?",
        spokenText: "I’m Adi, Rohan Hiremathswami’s AI portfolio assistant. How can I help you explore Rohan’s work today?",
        source: "Profile Summary"
      };
    }
    sessionStorage.setItem('adi_has_visited', 'true');
    return {
      text:
        "Hello, I’m Adi—Rohan Hiremathswami’s AI portfolio assistant. " +
        "Rohan is a Full-Stack and AI Developer based in Kolhapur, Maharashtra. " +
        "He builds MERN stack web applications, integrates AI capabilities, " +
        "and creates responsive, high-performance web products. " +
        "How can I help you explore his work today?",

      spokenText:
        "Hello, I’m Adi, Rohan Hiremathswami’s AI portfolio assistant. " +
        "Rohan is a Full-Stack and AI Developer based in Kolhapur, Maharashtra. " +
        "How can I help you explore his work today?",

      source: "Profile Summary"
    };
  }

  // Check if visitor is returning or first time in session
  getGreeting() {
    return this.getGreetingObject().text;
  }

  // Main Query Router (calls /api/adi if available, falls back gracefully to smart client engine)
  async queryAssistant(userQuery) {
    this.stopSpeech();
    const cleanQuery = userQuery.trim();

    if (!cleanQuery) return null;

    // Check for off-topic query check first
    if (this.isOffTopicQuery(cleanQuery)) {
      return {
        text: `I’m Adi, Rohan Hiremathswami’s AI portfolio assistant. I’m designed to help visitors learn about Rohan’s professional background, skills, projects, and contact details.`,
        sources: ["Portfolio Scope"],
        actions: this.getContactActions(),
        mode: "scope_redirect"
      };
    }

    // Attempt AI Server API call first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch('/api/adi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: cleanQuery }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data && data.text) {
          return {
            text: data.text,
            sources: data.sources || ["Portfolio Intelligence"],
            actions: data.actions || this.getContactActions(),
            mode: "ai"
          };
        }
      }
    } catch (err) {
      // Fallback silently to client-side rule-based search engine
    }

    // Smart Client-side Fallback Search Processor
    return this.processFallbackQuery(cleanQuery);
  }

  // Check if user question is completely unrelated to portfolio
  isOffTopicQuery(q) {
    const lower = q.toLowerCase();
    const offTopicKeywords = ["weather", "recipe", "politics", "president", "movie", "football", "joke", "crypto", "bitcoin", "solve math", "who is elon"];
    return offTopicKeywords.some(k => lower.includes(k)) && !lower.includes("rohan") && !lower.includes("skill") && !lower.includes("project");
  }

  // Client-Side Search Processor (Portfolio Search Mode)
  processFallbackQuery(query) {
    const q = query.toLowerCase();
    const p = this.data.profile;
    const s = this.data.skills;
    const proj = this.data.projects;
    const edu = this.data.education[0];
    const contact = this.data.contact;

    // 1. GREETING / INTRO
    if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('who are you')) {
      return {
        text: `I’m Adi, Rohan Hiremathswami’s AI portfolio assistant. Rohan is a ${p.title} based in ${p.location}. He specializes in building MERN stack web applications, integrating AI capabilities, and designing responsive web products.`,
        sources: ["Profile Summary"],
        actions: this.getContactActions(),
        mode: "search"
      };
    }

    // 2. TELL ME ABOUT ROHAN / OVERVIEW
    if (q.includes('tell me about') || q.includes('who is rohan') || q.includes('overview') || q.includes('background') || q.includes('bio')) {
      return {
        text: `Rohan is a ${p.title} based in ${p.location}. ${p.headline}\n\nKey Highlights:\n- Degree: ${edu.degree} (${edu.institution})\n- Core Tech: React.js, Node.js, Express.js, MongoDB (MERN Stack) & Python\n- Certifications: 11 verified credentials across Google Cloud, AWS Generative AI, and Data Analytics\n- Status: ${p.availability}`,
        sources: ["Profile", "Education", "Certifications"],
        actions: this.getContactActions(),
        mode: "search"
      };
    }

    // 3. SKILLS / TECH TOOLBOX
    if (q.includes('skill') || q.includes('stack') || q.includes('technology') || q.includes('languages') || q.includes('toolbox')) {
      return {
        text: `Rohan’s verified technical toolkit is organized into clear domains:\n\n` +
          `• Languages: ${s.languages.join(', ')}\n` +
          `• Frontend: ${s.frontend.join(', ')}\n` +
          `• Backend: ${s.backend.join(', ')}\n` +
          `• Databases: ${s.databases.join(', ')}\n` +
          `• Data & AI: ${s.dataAndAI.join(', ')}\n` +
          `• Tools & Cloud: ${s.toolsAndPlatforms.join(', ')}`,
        sources: ["Skills"],
        actions: this.getContactActions(),
        mode: "search"
      };
    }

    // 4. EDUCATION
    if (q.includes('education') || q.includes('degree') || q.includes('college') || q.includes('university') || q.includes('bca') || q.includes('study')) {
      return {
        text: `Rohan has completed a ${edu.degree} in ${edu.specialization} from ${edu.institution}.\n\nAcademic Highlights:\n` +
          edu.highlights.map(h => `• ${h}`).join('\n'),
        sources: ["Education"],
        actions: this.getContactActions(),
        mode: "search"
      };
    }

    // 5. SPECIFIC PROJECT LOOKUP
    for (const item of proj) {
      if (q.includes(item.name.toLowerCase()) || q.includes(item.id)) {
        let text = `Project: ${item.name} (${item.category})\n` +
          `Tagline: ${item.tagline}\n\n` +
          `• Problem: ${item.problem}\n` +
          `• Solution: ${item.solution}\n` +
          `• Rohan's Role: ${item.role}\n` +
          `• Technologies: ${item.technologies.join(', ')}\n` +
          `• Verified Outcome: ${item.outcomes.join(' ')}`;

        const actions = [];
        if (item.liveUrl) actions.push({ label: `View Live ${item.name} ↗`, url: item.liveUrl });
        if (item.githubUrl) actions.push({ label: `View GitHub ⌘`, url: item.githubUrl });
        actions.push({ label: "Contact Rohan", url: `mailto:${contact.email}` });

        return {
          text,
          sources: [`Project: ${item.name}`],
          actions,
          mode: "search"
        };
      }
    }

    // 6. SHOW ALL PROJECTS / BEST PROJECTS
    if (q.includes('project') || q.includes('portfolio') || q.includes('built') || q.includes('work') || q.includes('showcase')) {
      let text = `Rohan has built and deployed 5 featured software projects:\n\n`;
      proj.forEach((item, idx) => {
        text += `${idx + 1}. ${item.name} (${item.category})\n   ${item.tagline}\n   Tech: ${item.technologies.join(', ')}\n\n`;
      });

      return {
        text: text.trim(),
        sources: ["Projects"],
        actions: [
          { label: "View Live Ora Jewellers ↗", url: "https://orajweles.lovable.app/" },
          { label: "View Live Mahalaxmi Jewellers ↗", url: "https://mahalaxmi-jwellers-owb2-ivory.vercel.app/" },
          { label: "Contact Rohan", url: `mailto:${contact.email}` }
        ],
        mode: "search"
      };
    }

    // 7. SPECIFIC TECHNOLOGY QUERY (Does Rohan know X? / Which projects use X?)
    const techMatch = this.findTechMatch(q);
    if (techMatch) {
      const matchingProjects = proj.filter(item => 
        item.technologies.some(t => t.toLowerCase().includes(techMatch.toLowerCase()))
      );

      let text = `Yes, Rohan has verified experience with ${techMatch}.\n\n`;
      if (matchingProjects.length > 0) {
        text += `Projects utilizing ${techMatch}:\n` +
          matchingProjects.map(m => `• ${m.name}: ${m.tagline}`).join('\n');
      } else {
        text += `${techMatch} is documented in Rohan’s verified technical toolbox.`;
      }

      return {
        text,
        sources: ["Skills", "Projects"],
        actions: this.getContactActions(),
        mode: "search"
      };
    }

    // 8. CERTIFICATIONS
    if (q.includes('certif') || q.includes('credential') || q.includes('course') || q.includes('coursera') || q.includes('datacamp') || q.includes('aws') || q.includes('gcp')) {
      let text = `Rohan holds 11 verified professional certifications and course achievements:\n\n` +
        `Major Certifications:\n` +
        `• Essential Google Cloud Infrastructure: Foundation (Coursera / GCP)\n` +
        `• Google Data Analytics Professional Certificate (Coursera)\n` +
        `• Introducing Generative AI with AWS (Udacity / AWS)\n\n` +
        `DataCamp Achievements (8 Courses):\n` +
        `• Exploratory Data Analysis, Data Viz with Matplotlib, Statistics, Joining Data & Manipulation with pandas (+ AI Tutor), Intro/Intermediate SQL, Data Engineering.`;

      return {
        text,
        sources: ["Certifications"],
        actions: this.getContactActions(),
        mode: "search"
      };
    }

    // 9. CONTACT / EMAIL / LINKEDIN / RESUME
    if (q.includes('contact') || q.includes('email') || q.includes('linkedin') || q.includes('github') || q.includes('resume') || q.includes('hire') || q.includes('reach')) {
      return {
        text: `You can reach out to Rohan directly through any of the following verified channels:\n\n` +
          `• Email: ${contact.email}\n` +
          `• LinkedIn: ${contact.linkedin}\n` +
          `• GitHub: ${contact.github}\n` +
          `• Current Availability: ${p.availability}`,
        sources: ["Contact"],
        actions: [
          { label: "Send Email ✉", url: `mailto:${contact.email}` },
          { label: "LinkedIn Profile ↗", url: contact.linkedin },
          { label: "GitHub Profile ⌘", url: contact.github }
        ],
        mode: "search"
      };
    }

    // 10. AVAILABILITY
    if (q.includes('available') || q.includes('open to work') || q.includes('internship') || q.includes('full-time') || q.includes('freelance')) {
      return {
        text: `Rohan’s current verified availability status:\n` +
          `"${p.availability}"\n\n` +
          `Preferred roles include: ${p.preferredRoles.join(', ')}.`,
        sources: ["Availability"],
        actions: this.getContactActions(),
        mode: "search"
      };
    }

    // UNMATCHED / UNKNOWN FALLBACK (STRICT TRUTH RULE)
    return {
      text: `That detail is not currently listed in Rohan’s portfolio. You can contact Rohan directly for the most accurate answer.`,
      sources: ["Portfolio Verification"],
      actions: this.getContactActions(),
      mode: "search_unmatched"
    };
  }

  // Find tech match in skills or projects
  findTechMatch(q) {
    const allTechs = [
      "JavaScript", "React", "Next.js", "Node.js", "Express", "MongoDB",
      "Python", "C++", "R", "SQL", "Tailwind", "HTML", "CSS", "GCP", "AWS",
      "REST", "MERN", "Pandas", "NumPy", "Matplotlib", "Spline", "Git"
    ];
    return allTechs.find(t => q.toLowerCase().includes(t.toLowerCase())) || null;
  }

  // JOB DESCRIPTION FIT ANALYZER
  analyzeJobFit(jobDesc) {
    this.stopSpeech();
    const p = this.data.profile;
    const s = this.data.skills;
    const proj = this.data.projects;
    const jdLower = jobDesc.toLowerCase();

    // Key Tech Check
    const techChecklist = [
      { name: "React.js / Frontend", key: ["react", "frontend", "ui", "javascript", "web"] },
      { name: "Node.js / Express Backend", key: ["node", "express", "backend", "api", "rest"] },
      { name: "MongoDB / Database Architecture", key: ["mongodb", "mongo", "database", "nosql", "sql"] },
      { name: "Python / Data & AI", key: ["python", "ai", "machine learning", "data", "pandas"] },
      { name: "Full-Stack MERN Architecture", key: ["full stack", "fullstack", "mern", "architecture"] },
      { name: "Cloud Platforms (GCP / AWS)", key: ["cloud", "gcp", "aws", "docker", "deployment"] }
    ];

    const matches = [];
    const gaps = [];

    techChecklist.forEach(item => {
      const isMatched = item.key.some(k => jdLower.includes(k));
      if (isMatched) {
        matches.push(item.name);
      } else {
        gaps.push(item.name);
      }
    });

    let overview = `Based on verified portfolio evidence, ${p.name} demonstrates strong alignment with core web development, MERN full-stack architecture, and AI integration requirements.`;
    
    let text = `Role-Fit Overview:\n${overview}\n\n`;
    
    text += `Strong Portfolio Matches:\n`;
    if (matches.length > 0) {
      matches.forEach(m => {
        text += `• ${m} → Evidenced in ${p.name}’s technical toolbox and shipped projects (Mahalaxmi Jewellers, Ora Jewellers, SmartChef, StudyMentor).\n`;
      });
    } else {
      text += `• General Web Engineering → Evidenced in BCA coursework and 5 shipped web projects.\n`;
    }

    text += `\nPotential Gaps or Unverified Areas in Portfolio:\n`;
    if (gaps.length > 0) {
      gaps.forEach(g => {
        text += `• ${g} → Not explicitly detailed as a primary requirement in the current portfolio knowledge base.\n`;
      });
    } else {
      text += `• Specific enterprise scale metrics or proprietary framework requirements not listed.\n`;
    }

    text += `\nSuggested Next Step:\n` +
      `Review ${proj[2].name} (${proj[2].category}) or contact ${p.name} directly to discuss how his background fits your exact team requirements.`;

    return {
      text,
      sources: ["Experience", "Skills", "Projects"],
      actions: [
        { label: "View Mahalaxmi Jewellers (MERN) ↗", url: proj[2].liveUrl },
        { label: "Contact Rohan ✉", url: `mailto:${this.data.contact.email}` },
        { label: "LinkedIn Profile ↗", url: this.data.contact.linkedin }
      ],
      mode: "job_match"
    };
  }

  // Get default contact actions
  getContactActions() {
    return [
      { label: "Contact Rohan ✉", url: `mailto:${this.data.contact.email}` },
      { label: "LinkedIn ↗", url: this.data.contact.linkedin },
      { label: "GitHub ⌘", url: this.data.contact.github }
    ];
  }
}
