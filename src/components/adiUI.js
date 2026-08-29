import { AdiAssistant } from './adiAssistant.js';

export class AdiUI {
  constructor() {
    this.assistant = new AdiAssistant();
    this.isOpen = false;
    this.isJobMatchOpen = false;
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
        const greetingText = this.assistant.getGreeting();
        this.messages = [
          {
            sender: 'adi',
            text: greetingText,
            sources: ['Portfolio Intelligence'],
            actions: this.assistant.getContactActions()
          }
        ];
        this.saveHistory();
      }
    } catch (e) {
      this.messages = [
        {
          sender: 'adi',
          text: this.assistant.getGreeting(),
          sources: ['Portfolio Intelligence'],
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
          <span class="adi-monogram">A</span>
          <span class="adi-orbit"></span>
        </div>
        <span class="adi-tooltip">Ask Adi about my work</span>
      </button>

      <!-- Adi Chat Window Drawer/Modal -->
      <section class="adi-chat-panel ${this.isOpen ? 'active' : ''}" id="adiPanel" role="dialog" aria-label="Adi Portfolio Assistant Chat" aria-hidden="${!this.isOpen}">
        <header class="adi-header">
          <div class="adi-avatar-box">
            <span class="adi-avatar">A</span>
            <span class="adi-status-dot" title="Online"></span>
          </div>
          <div class="adi-header-info">
            <h4>Adi <span class="adi-badge-pill">AI</span></h4>
            <span class="adi-status-text">Portfolio Intelligence • Online</span>
          </div>
          <div class="adi-header-actions">
            <button class="adi-icon-btn" id="adiMicHeaderBtn" title="Voice Input (Mic)" aria-label="Toggle Voice Input">🎤</button>
            <button class="adi-icon-btn" id="adiClearBtn" title="Clear Chat" aria-label="Clear Chat History">🗑️</button>
            <button class="adi-icon-btn adi-close-btn" id="adiCloseBtn" title="Close Assistant" aria-label="Close Chat Window">×</button>
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
              <button class="adi-icon-btn" id="adiJdCloseBtn">×</button>
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
            <button class="adi-input-mic-btn" id="adiMicInputBtn" title="Speak question" aria-label="Microphone Voice Input">🎤</button>
            <textarea id="adiInput" rows="1" placeholder="Ask Adi about Rohan’s work..." aria-label="Ask Adi about Rohan's work"></textarea>
            <button class="adi-send-btn" id="adiSendBtn" aria-label="Send message">➤</button>
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
          ${!isUser ? `<div class="adi-msg-avatar">A</div>` : ''}
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
              <button class="adi-speaker-btn" data-msg-idx="${idx}" title="Read message aloud" aria-label="Read response aloud">🔊 Listen</button>
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

    // Speaker Listen Button Click
    messagesContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.adi-speaker-btn');
      if (btn) {
        const idx = parseInt(btn.dataset.msgIdx, 10);
        const msg = this.messages[idx];
        if (msg) {
          this.assistant.speakText(msg.text, btn, (isSpeaking) => {
            if (isSpeaking) {
              btn.classList.add('speaking');
              btn.textContent = '⏹ Stop Listening';
            } else {
              btn.classList.remove('speaking');
              btn.textContent = '🔊 Listen';
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
    this.messages = [
      {
        sender: 'adi',
        text: this.assistant.getGreeting(),
        sources: ['Portfolio Intelligence'],
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
