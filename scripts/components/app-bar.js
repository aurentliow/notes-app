class AppBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  static get observedAttributes() {
    return ['app-title'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'app-title' && oldValue !== newValue) {
      const titleElement = this.shadowRoot.querySelector('#app-title');
      if (titleElement) {
        titleElement.textContent = newValue;
      }
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          background-color: var(--primary-color, #FFC0CB);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .app-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .app-bar-brand h1 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: #333;
        }
        
        #dark-mode-toggle {
          background-color: rgba(255, 255, 255, 0.2);
          color: #333;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-family: 'Quicksand', sans-serif;
          font-weight: 500;
          transition: background-color 0.3s ease;
        }
        
        #dark-mode-toggle:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }
        
        @media (max-width: 768px) {
          .app-bar {
            padding: 0 1rem;
            flex-direction: column;
            gap: 0.5rem;
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
          }
        }
      </style>
      
      <div class="app-bar">
        <div class="app-bar-brand">
          <h1 id="app-title">Aplikasi Catatan</h1>
        </div>
        <div class="app-bar-navigation">
          <button id="dark-mode-toggle">Mode Gelap</button>
        </div>
      </div>
    `;

    const darkModeToggle = this.shadowRoot.querySelector('#dark-mode-toggle');
    if (darkModeToggle) {
      darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
          darkModeToggle.textContent = 'Mode Terang';
          // Set CSS variables for dark mode
          document.documentElement.style.setProperty('--background-color', '#222');
          document.documentElement.style.setProperty('--text-color', '#eee');
          document.documentElement.style.setProperty('--card-color', '#333');
          document.documentElement.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.3)');
        } else {
          darkModeToggle.textContent = 'Mode Gelap';
          // Reset CSS variables for light mode
          document.documentElement.style.setProperty('--background-color', '#f5f5f5');
          document.documentElement.style.setProperty('--text-color', '#333');
          document.documentElement.style.setProperty('--card-color', '#fff');
          document.documentElement.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');
        }
      });
    }
  }
}

customElements.define('app-bar', AppBar);