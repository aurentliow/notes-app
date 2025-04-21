class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .loading-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .loading-content {
          background-color: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          text-align: center;
          max-width: 300px;
          width: 80%;
        }
        
        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255, 192, 203, 0.3);
          border-top: 4px solid var(--primary-color, #FFC0CB);
          border-radius: 50%;
          margin: 0 auto 1rem;
          animation: spin 1s linear infinite;
        }
        
        .loading-text {
          font-family: 'Quicksand', sans-serif;
          color: #333;
          font-size: 1.1rem;
          font-weight: 500;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
      
      <div class="loading-container">
        <div class="loading-content">
          <div class="spinner"></div>
          <div class="loading-text">Memuat...</div>
        </div>
      </div>
    `;
  }
}

customElements.define('loading-indicator', LoadingIndicator);

/**
 * Objek untuk mengelola loading indicator
 */
const loadingState = {
  _element: null,
  
  /**
   * Menampilkan loading indicator
   * @param {string} message - Pesan yang akan ditampilkan (opsional)
   */
  show(message = 'Memuat...') {
    if (!this._element) {
      this._element = document.createElement('loading-indicator');
      document.body.appendChild(this._element);
    }
  },
  
  /**
   * Menyembunyikan loading indicator
   */
  hide() {
    if (this._element) {
      document.body.removeChild(this._element);
      this._element = null;
    }
  }
};

export default loadingState;