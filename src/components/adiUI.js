import { AdiAssistant } from './adiAssistant.js';

const MIC_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>`;
const TRASH_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`;
const CLOSE_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
const SPEAKER_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
const STOP_SPEAKER_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>`;
const SEND_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;

function getAdiLogoSvg(size = 24) {
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" class="adi-svg-icon">
      <circle cx="18" cy="18" r="16" stroke="url(#adiRingGrad)" stroke-width="1.8" stroke-dasharray="5 2.5"/>
      <circle cx="18" cy="18" r="10" fill="url(#adiCoreGrad)"/>
      <path d="M18 9L21.5 18L18 27L14.5 18L18 9Z" fill="#ffffff" style="filter: drop-shadow(0 0 4px var(--cyan));"/>
      <path d="M9 18L18 14.5L27 18L18 21.5L9 18Z" fill="var(--cyan)"/>
      <defs>
        <linearGradient id="adiRingGrad" x1="0" y1="0" x2="36" y2="36">
          <stop offset="0%" stop-color="var(--cyan)"/>
          <stop offset="50%" stop-color="var(--mint)"/>
          <stop offset="100%" stop-color="var(--cyan)"/>
        </linearGradient>
        <radialGradient id="adiCoreGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="var(--cyan-soft)"/>
          <stop offset="100%" stop-color="var(--deep)"/>
        </radialGradient>
      </defs>
    </svg>
  `;
}

export class AdiUI {
  constructor() {
    this.assistant = new AdiAssistant();
    this.isOpen = false;
    this.isJobMatchOpen = false;
    this.voiceRepliesEnabled = localStorage.getItem('adi_voice_replies') !== 'false';
    this.messages = [];
    this.container = null;
    this.init();
  }

  init() {
    if (typeof document === 'undefined') return;

    // Load persisted chat history or initial greeting
    this.loadHistory();

    // Render HTML structure
    this.render();

    // Attach Event Listeners
    this.attachEvents();

    // Check keyboard Esc listener
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeChat();
      }
    });
  }

  loadHistory() {
    try {
      const saved = sessionStorage.getItem('adi_chat_history');
      if (saved) {
        this.messages = JSON.parse(saved);
      } else {
        const welcomeObj = this.assistant.getGreetingObject();
        this.messages = [
          {
            sender: 'adi',
            text: welcomeObj.text,
            spokenText: welcomeObj.spokenText,
            sources: [welcomeObj.source],
            actions: this.assistant.getContactActions()
          }
        ];
        this.saveHistory();
      }
    } catch (e) {
      const welcomeObj = this.assistant.getGreetingObject();
      this.messages = [
        {
          sender: 'adi',
          text: welcomeObj.text,
          spokenText: welcomeObj.spokenText,
          sources: [welcomeObj.source],
          actions: this.assistant.getContactActions()
        }
      ];
    }
  }

  saveHistory() {
    try {
      sessionStorage.setItem('adi_chat_history', JSON.stringify(this.messages.slice(-20)));
    } catch (e) {}
  }

  render() {
    let mount = document.getElementById('adiContainer');
    if (!mount) {
      mount = document.createElement('div');
      mount.id = 'adiContainer';
      document.body.appendChild(mount);
    }
    this.container = mount;

    const isFirstTime = !sessionStorage.getItem('adi_has_pulsed');
    if (isFirstTime) {
      sessionStorage.setItem('adi_has_pulsed', 'true');
    }

    this.container.innerHTML = `
      <!-- Adi Floating Launcher Widget -->
      <button class="adi-launcher ${isFirstTime ? 'first-pulse' : ''}" id="adiLauncher" aria-label="Open Adi Portfolio AI Assistant" title="Ask Adi about my work">
        <div class="adi-launcher-icon">
          ${getAdiLogoSvg(32)}
        </div>
        <span class="adi-tooltip">Ask Adi about my work</span>
      </button>

      <!-- Adi Chat Window Drawer/Modal -->
      <section class="adi-chat-panel ${this.isOpen ? 'active' : ''}" id="adiPanel" role="dialog" aria-label="Adi Portfolio Assistant Chat" aria-hidden="${!this.isOpen}">
        <header class="adi-header">
          <div class="adi-avatar-box">
            ${getAdiLogoSvg(26)}
            <span class="adi-status-dot" title="Online"></span>
          </div>
          <div class="adi-header-info">
            <h4>Adi <span class="adi-badge-pill">AI</span></h4>
            <span class="adi-status-text">Portfolio Intelligence • Online</span>
          </div>
          <div class="adi-header-actions">
            <button class="adi-icon-btn ${this.voiceRepliesEnabled ? 'active' : ''}" id="adiVoiceToggleBtn" title="${this.voiceRepliesEnabled ? 'Voice Replies Enabled' : 'Voice Replies Muted'}" aria-label="Toggle Voice Replies">${this.voiceRepliesEnabled ? SPEAKER_SVG : '🔇'}</button>
            <button class="adi-icon-btn" id="adiMicHeaderBtn" title="Voice Input (Mic)" aria-label="Toggle Voice Input">${MIC_SVG}</button>
            <button class="adi-icon-btn" id="adiClearBtn" title="Clear Chat" aria-label="Clear Chat History">${TRASH_SVG}</button>
            <button class="adi-icon-btn adi-close-btn" id="adiCloseBtn" title="Close Assistant" aria-label="Close Chat Window">${CLOSE_SVG}</button>
          </div>
        </header>

        <!-- Mode Notification Badge -->
        <div class="adi-mode-bar">
          <span><i>✦</i> Adi is running in portfolio search mode.</span>
        </div>

        <!-- Quick Prompts Bar -->
        <div class="adi-quick-prompts" id="adiQuickPrompts">
          <button class="adi-prompt-btn" data-q="What are Rohan Hiremathswami’s strongest skills?">⚡ Skills</button>
          <button class="adi-prompt-btn" data-q="Show me Rohan’s best projects">📁 Projects</button>
          <button class="adi-prompt-btn" data-q="What is Rohan’s educational background?">🎓 Education</button>
          <button class="adi-prompt-btn" data-q="Which project demonstrates full-stack experience?">💻 Full-Stack</button>
          <button class="adi-prompt-btn highlight" id="adiJobMatchBtn">💼 Match Job Description</button>
          <button class="adi-prompt-btn" data-q="How can I contact Rohan Hiremathswami?">✉ Contact</button>
        </div>

        <!-- Chat Messages Container -->
        <div class="adi-messages" id="adiMessages">
          ${this.renderMessagesHTML()}
        </div>

        <!-- Typing Indicator -->
        <div class="adi-typing-indicator" id="adiTyping" style="display:none">
          <span class="dot"></span><span class="dot"></span><span class="dot"></span>
        </div>

        <!-- Job Match Modal Form Overlay -->
        <div class="adi-jd-overlay ${this.isJobMatchOpen ? 'active' : ''}" id="adiJdOverlay">
          <div class="adi-jd-box">
            <div class="adi-jd-header">
              <h5>Match Rohan to a Job Description</h5>
              <button class="adi-icon-btn" id="adiJdCloseBtn">${CLOSE_SVG}</button>
            </div>
            <p>Paste a job description to compare it with verified portfolio evidence.</p>
            <textarea id="adiJdInput" rows="5" placeholder="Paste requirements, roles, or tech stack here..."></textarea>
            <div class="adi-jd-footer">
              <span class="adi-disclaimer">Adi compares roles with verified portfolio evidence. It does not make hiring guarantees.</span>
              <button class="adi-submit-btn" id="adiJdAnalyzeBtn">Analyze Fit ↗</button>
            </div>
          </div>
        </div>

        <!-- Input Bar -->
        <footer class="adi-footer">
          <div class="adi-input-wrapper">
            <button class="adi-input-mic-btn" id="adiMicInputBtn" title="Speak question" aria-label="Microphone Voice Input">${MIC_SVG}</button>
            <textarea id="adiInput" rows="1" placeholder="Ask Adi about Rohan’s work..." aria-label="Ask Adi about Rohan's work"></textarea>
            <button class="adi-send-btn" id="adiSendBtn" aria-label="Send message">${SEND_SVG}</button>
          </div>
          <p class="adi-privacy-note">Adi answers from this portfolio. Please avoid sharing sensitive personal information.</p>
        </footer>
      </section>
    `;
  }

  renderMessagesHTML() {
    return this.messages.map((m, idx) => {
      const isUser = m.sender === 'user';
      return `
        <div class="adi-msg-row ${isUser ? 'user' : 'assistant'}">
          ${!isUser ? `<div class="adi-msg-avatar">${getAdiLogoSvg(22)}</div>` : ''}
          <div class="adi-msg-bubble">
            <div class="adi-msg-text">${this.formatMessageText(m.text)}</div>
            ${!isUser && m.sources && m.sources.length ? `
              <div class="adi-sources-row">
                ${m.sources.map(s => `<span class="adi-source-chip">Source: ${s}</span>`).join('')}
              </div>
            ` : ''}
            ${!isUser && m.actions && m.actions.length ? `
              <div class="adi-actions-row">
                ${m.actions.map(a => `<a href="${a.url}" target="_blank" rel="noreferrer noopener" class="adi-action-btn">${a.label}</a>`).join('')}
              </div>
            ` : ''}
            ${!isUser ? `
              <button class="adi-speaker-btn" data-msg-idx="${idx}" title="Read message aloud" aria-label="Read response aloud">${SPEAKER_SVG} Listen</button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  formatMessageText(text) {
    if (!text) return '';
    let formatted = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br/>")
      .replace(/• (.*?)(<br\/>|$)/g, "<li>$1</li>");

    if (formatted.includes("<li>")) {
      formatted = formatted.replace(/(<li>.*?<\/li>)/gs, "<ul>$1</ul>");
    }
    return formatted;
  }

  attachEvents() {
    const launcher = document.getElementById('adiLauncher');
    const closeBtn = document.getElementById('adiCloseBtn');
    const clearBtn = document.getElementById('adiClearBtn');
    const sendBtn = document.getElementById('adiSendBtn');
    const input = document.getElementById('adiInput');
    const quickPrompts = document.getElementById('adiQuickPrompts');
    const jobMatchBtn = document.getElementById('adiJobMatchBtn');
    const jdCloseBtn = document.getElementById('adiJdCloseBtn');
    const jdAnalyzeBtn = document.getElementById('adiJdAnalyzeBtn');
    const micHeaderBtn = document.getElementById('adiMicHeaderBtn');
    const micInputBtn = document.getElementById('adiMicInputBtn');
    const messagesContainer = document.getElementById('adiMessages');

    launcher.addEventListener('click', () => this.toggleChat());
    closeBtn.addEventListener('click', () => this.closeChat());
    clearBtn.addEventListener('click', () => this.clearChat());

    sendBtn.addEventListener('click', () => this.handleUserSubmit());

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleUserSubmit();
      }
    });

    quickPrompts.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-q]');
      if (btn) {
        const q = btn.dataset.q;
        this.submitQuery(q);
      }
    });

    jobMatchBtn.addEventListener('click', () => {
      this.isJobMatchOpen = true;
      document.getElementById('adiJdOverlay').classList.add('active');
    });

    jdCloseBtn.addEventListener('click', () => {
      this.isJobMatchOpen = false;
      document.getElementById('adiJdOverlay').classList.remove('active');
    });

    jdAnalyzeBtn.addEventListener('click', () => {
      const jdText = document.getElementById('adiJdInput').value.trim();
      if (!jdText) return;
      this.isJobMatchOpen = false;
      document.getElementById('adiJdOverlay').classList.remove('active');
      document.getElementById('adiJdInput').value = '';

      this.addMessage({ sender: 'user', text: `Match Rohan to Job Description:\n${jdText.substring(0, 140)}...` });
      this.showTyping(true);

      setTimeout(() => {
        const result = this.assistant.analyzeJobFit(jdText);
        this.showTyping(false);
        this.addMessage({
          sender: 'adi',
          text: result.text,
          sources: result.sources,
          actions: result.actions
        });
      }, 500);
    });

    // Mic Voice Toggle
    const handleMicToggle = (btnEl) => {
      this.assistant.toggleVoiceInput(
        (transcript) => {
          input.value = transcript;
        },
        (isListening) => {
          if (isListening) {
            btnEl.classList.add('listening');
          } else {
            btnEl.classList.remove('listening');
          }
        },
        (err) => {
          btnEl.classList.remove('listening');
        }
      );
    };

    micHeaderBtn.addEventListener('click', () => handleMicToggle(micHeaderBtn));
    micInputBtn.addEventListener('click', () => handleMicToggle(micInputBtn));

    // Voice Reply Mute/Unmute Toggle
    const voiceToggleBtn = document.getElementById('adiVoiceToggleBtn');
    if (voiceToggleBtn) {
      voiceToggleBtn.addEventListener('click', () => {
        this.voiceRepliesEnabled = !this.voiceRepliesEnabled;
        localStorage.setItem('adi_voice_replies', this.voiceRepliesEnabled ? 'true' : 'false');
        voiceToggleBtn.classList.toggle('active', this.voiceRepliesEnabled);
        voiceToggleBtn.title = this.voiceRepliesEnabled ? 'Voice Replies Enabled' : 'Voice Replies Muted';
        voiceToggleBtn.innerHTML = this.voiceRepliesEnabled ? SPEAKER_SVG : '🔇';
        if (!this.voiceRepliesEnabled) {
          this.assistant.stopSpeech();
        }
      });
    }

    // Speaker Listen Button Click
    messagesContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.adi-speaker-btn');
      if (btn) {
        const idx = parseInt(btn.dataset.msgIdx, 10);
        const msg = this.messages[idx];
        if (msg) {
          const textToSpeak = msg.spokenText || msg.text;
          this.assistant.speakText(textToSpeak, btn, (isSpeaking) => {
            if (isSpeaking) {
              btn.classList.add('speaking');
              btn.innerHTML = `${STOP_SPEAKER_SVG} Stop Listening`;
            } else {
              btn.classList.remove('speaking');
              btn.innerHTML = `${SPEAKER_SVG} Listen`;
            }
          });
        }
      }
    });
  }

  toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  openChat() {
    this.isOpen = true;
    const panel = document.getElementById('adiPanel');
    panel.classList.add('active');
    panel.setAttribute('aria-hidden', 'false');
    this.scrollToBottom();
    document.getElementById('adiInput').focus();

    // Auto-speak welcome message on first launcher click in session
    const hasSpokenWelcome = sessionStorage.getItem('adiWelcomeSpoken');
    if (!hasSpokenWelcome && this.voiceRepliesEnabled) {
      sessionStorage.setItem('adiWelcomeSpoken', 'true');

      // Wait for panel open animation to complete (320ms)
      setTimeout(() => {
        const container = document.getElementById('adiMessages');
        if (container) {
          const firstRow = container.querySelector('.adi-msg-row.assistant');
          if (firstRow) {
            const speakerBtn = firstRow.querySelector('.adi-speaker-btn');
            const firstMsg = this.messages[0];
            const textToSpeak = firstMsg?.spokenText || firstMsg?.text;
            if (textToSpeak && speakerBtn) {
              this.assistant.speakText(textToSpeak, speakerBtn, (isSpeaking) => {
                if (isSpeaking) {
                  speakerBtn.classList.add('speaking');
                  speakerBtn.innerHTML = `${STOP_SPEAKER_SVG} Stop Listening`;
                } else {
                  speakerBtn.classList.remove('speaking');
                  speakerBtn.innerHTML = `${SPEAKER_SVG} Listen`;
                }
              });
            }
          }
        }
      }, 320);
    }
  }

  closeChat() {
    this.isOpen = false;
    this.assistant.stopSpeech();
    const panel = document.getElementById('adiPanel');
    panel.classList.remove('active');
    panel.setAttribute('aria-hidden', 'true');
  }

  clearChat() {
    this.assistant.stopSpeech();
    const welcomeObj = this.assistant.getGreetingObject();
    this.messages = [
      {
        sender: 'adi',
        text: welcomeObj.text,
        spokenText: welcomeObj.spokenText,
        sources: [welcomeObj.source],
        actions: this.assistant.getContactActions()
      }
    ];
    this.saveHistory();
    this.updateMessagesDOM();
  }

  async handleUserSubmit() {
    const input = document.getElementById('adiInput');
    const q = input.value.trim();
    if (!q) return;

    input.value = '';
    await this.submitQuery(q);
  }

  async submitQuery(q) {
    this.addMessage({ sender: 'user', text: q });
    this.showTyping(true);

    const response = await this.assistant.queryAssistant(q);
    this.showTyping(false);

    if (response) {
      this.addMessage({
        sender: 'adi',
        text: response.text,
        sources: response.sources,
        actions: response.actions
      });
    }
  }

  addMessage(msg) {
    this.messages.push(msg);
    this.saveHistory();
    this.updateMessagesDOM();

    // Trigger live token streaming animation for assistant messages
    if (msg.sender === 'adi') {
      const container = document.getElementById('adiMessages');
      if (container) {
        const rows = container.querySelectorAll('.adi-msg-row.assistant');
        const lastRow = rows[rows.length - 1];
        if (lastRow) {
          const textEl = lastRow.querySelector('.adi-msg-text');
          const sourcesEl = lastRow.querySelector('.adi-sources-row');
          const actionsEl = lastRow.querySelector('.adi-actions-row');
          const speakerBtn = lastRow.querySelector('.adi-speaker-btn');

          if (sourcesEl) sourcesEl.style.display = 'none';
          if (actionsEl) actionsEl.style.display = 'none';
          if (speakerBtn) speakerBtn.style.display = 'none';

          this.streamChatGPTTokenText(textEl, msg.text, () => {
            if (sourcesEl) sourcesEl.style.display = 'flex';
            if (actionsEl) actionsEl.style.display = 'flex';
            if (speakerBtn) speakerBtn.style.display = 'inline-block';
            this.scrollToBottom();
          });
        }
      }
    }
  }

  streamChatGPTTokenText(el, text, onComplete) {
    if (!text) return;
    el.textContent = '';
    el.classList.add('is-generating');

    const words = text.match(/\S+|\s+/g) || [text];
    let tokenIdx = 0;

    const cursor = document.createElement('span');
    cursor.className = 'chatgpt-cursor';
    cursor.textContent = '▋';
    el.appendChild(cursor);

    const step = () => {
      if (tokenIdx < words.length) {
        const token = words[tokenIdx];
        const span = document.createElement('span');
        span.className = 'chatgpt-token';
        span.textContent = token;
        cursor.insertAdjacentElement('beforebegin', span);
        tokenIdx++;
        this.scrollToBottom();

        let delay = 35 + Math.floor(Math.random() * 25);
        if (token.includes('.') || token.includes('!') || token.includes('?')) {
          delay += 180;
        } else if (token.includes(',') || token.includes(';')) {
          delay += 90;
        }
        setTimeout(step, delay);
      } else {
        el.classList.remove('is-generating');
        cursor.remove();
        el.innerHTML = this.formatMessageText(text);
        if (onComplete) onComplete();
        this.scrollToBottom();
      }
    };
    step();
  }

  updateMessagesDOM() {
    const container = document.getElementById('adiMessages');
    if (container) {
      container.innerHTML = this.renderMessagesHTML();
      this.scrollToBottom();
    }
  }

  showTyping(show) {
    const el = document.getElementById('adiTyping');
    if (el) {
      el.style.display = show ? 'flex' : 'none';
      if (show) this.scrollToBottom();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      const container = document.getElementById('adiMessages');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 50);
  }
}
