/**
 * Komponen dan state untuk menampilkan indikator loading
 */

// Loading state singleton
const loadingState = {
  _element: null,
  
  _createLoadingElement() {
    if (!this._element) {
      const loadingElement = document.createElement('div');
      loadingElement.className = 'loading-indicator';
      loadingElement.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Memuat...</p>
      `;
      
      // Tambahkan style jika belum ada
      if (!document.querySelector('#loading-style')) {
        const style = document.createElement('style');
        style.id = 'loading-style';
        style.textContent = `
          .loading-indicator {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            justify-content: center;
            align-items: center;
            flex-direction: column;
          }
          
          .loading-indicator.visible {
            display: flex;
          }
          
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid var(--primary-color, #FFC0CB);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          .loading-indicator p {
            margin-top: 10px;
            color: white;
            font-family: 'Quicksand', sans-serif;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `;
        document.head.appendChild(style);
      }
      
      document.body.appendChild(loadingElement);
      this._element = loadingElement;
    }
    
    return this._element;
  },
  
  show() {
    const loadingElement = this._createLoadingElement();
    loadingElement.classList.add('visible');
  },
  
  hide() {
    if (this._element) {
      this._element.classList.remove('visible');
    }
  }
};

/**
 * Custom element untuk loading indicator
 */
class LoadingIndicator extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: none;
        }
        
        :host(.visible) {
          display: block;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 9999;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }
        
        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid var(--primary-color, #FFC0CB);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        p {
          margin-top: 10px;
          color: white;
          font-family: 'Quicksand', sans-serif;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
      
      <div class="spinner"></div>
      <p>Memuat...</p>
    `;
  }
  
  show() {
    this.classList.add('visible');
  }
  
  hide() {
    this.classList.remove('visible');
  }
}

customElements.define('loading-indicator', LoadingIndicator);

// Export loading state singleton
export default loadingState;