class NoteInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['max-title-length', 'max-body-length'];
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      switch (name) {
        case 'max-title-length':
          this.maxTitleLength = parseInt(newValue) || 50;
          break;
        case 'max-body-length':
          this.maxBodyLength = parseInt(newValue) || 1000;
          break;
      }
      this.updateFormValidation();
    }
  }

  connectedCallback() {
    this.maxTitleLength = parseInt(this.getAttribute('max-title-length')) || 50;
    this.maxBodyLength = parseInt(this.getAttribute('max-body-length')) || 1000;
    this.render();
    this.updateFormValidation();
  }

  updateFormValidation() {
    const titleInput = this.shadowRoot.querySelector('#title');
    const bodyInput = this.shadowRoot.querySelector('#body');
    const titleError = this.shadowRoot.querySelector('#title-error');
    const bodyError = this.shadowRoot.querySelector('#body-error');
    const titleCount = this.shadowRoot.querySelector('#title-count');
    const bodyCount = this.shadowRoot.querySelector('#body-count');
    const submitButton = this.shadowRoot.querySelector('#submit-note');

    if (!titleInput || !bodyInput) return;

    titleInput.addEventListener('input', () => {
      const titleLength = titleInput.value.length;
      titleCount.textContent = `${titleLength}/${this.maxTitleLength}`;
      
      if (titleLength === 0) {
        titleError.textContent = 'Judul tidak boleh kosong';
        titleInput.classList.add('error');
      } else if (titleLength > this.maxTitleLength) {
        titleError.textContent = `Judul tidak boleh lebih dari ${this.maxTitleLength} karakter`;
        titleInput.classList.add('error');
      } else {
        titleError.textContent = '';
        titleInput.classList.remove('error');
      }
      
      this.validateForm();
    });

    bodyInput.addEventListener('input', () => {
      const bodyLength = bodyInput.value.length;
      bodyCount.textContent = `${bodyLength}/${this.maxBodyLength}`;
      
      if (bodyLength === 0) {
        bodyError.textContent = 'Isi catatan tidak boleh kosong';
        bodyInput.classList.add('error');
      } else if (bodyLength > this.maxBodyLength) {
        bodyError.textContent = `Isi catatan tidak boleh lebih dari ${this.maxBodyLength} karakter`;
        bodyInput.classList.add('error');
      } else {
        bodyError.textContent = '';
        bodyInput.classList.remove('error');
      }
      
      this.validateForm();
    });
  }

  validateForm() {
    const titleInput = this.shadowRoot.querySelector('#title');
    const bodyInput = this.shadowRoot.querySelector('#body');
    const submitButton = this.shadowRoot.querySelector('#submit-note');
    
    if (!titleInput || !bodyInput || !submitButton) return;
    
    const isTitleValid = titleInput.value.length > 0 && titleInput.value.length <= this.maxTitleLength;
    const isBodyValid = bodyInput.value.length > 0 && bodyInput.value.length <= this.maxBodyLength;
    
    submitButton.disabled = !(isTitleValid && isBodyValid);
    
    if (isTitleValid && isBodyValid) {
      submitButton.classList.add('active');
    } else {
      submitButton.classList.remove('active');
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        
        .note-input-form {
          background-color: var(--card-color, white);
          border-radius: 8px;
          box-shadow: 0 2px 8px var(--shadow-color, rgba(0, 0, 0, 0.1));
          padding: 1.5rem;
          margin-bottom: 2rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .note-input-form:hover {
          box-shadow: 0 4px 12px var(--shadow-color, rgba(0, 0, 0, 0.15));
        }
        
        .input-group {
          margin-bottom: 1.5rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--text-color, #333);
          font-family: 'Quicksand', sans-serif;
        }
        
        input[type="text"], textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: 'Quicksand', sans-serif;
          font-size: 1rem;
          background-color: var(--background-color, #f9f9f9);
          color: var(--text-color, #333);
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        
        input[type="text"]:focus, textarea:focus {
          outline: none;
          border-color: var(--primary-color, #FFC0CB);
          box-shadow: 0 0 0 2px rgba(255, 192, 203, 0.3);
        }
        
        input.error, textarea.error {
          border-color: var(--error-color, #e74c3c);
        }
        
        .char-count {
          text-align: right;
          font-size: 0.8rem;
          color: #7f8c8d;
          margin-top: 0.25rem;
          font-family: 'Quicksand', sans-serif;
        }
        
        .error-message {
          color: var(--error-color, #e74c3c);
          font-size: 0.85rem;
          margin-top: 0.25rem;
          min-height: 1.2em;
          font-family: 'Quicksand', sans-serif;
        }
        
        .submit-button {
          background-color: #d4d4d4;
          color: #555;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: not-allowed;
          font-weight: 600;
          width: 100%;
          font-family: 'Quicksand', sans-serif;
          transition: all 0.3s ease;
          margin-top: 1rem;
          font-size: 1rem;
        }
        
        .submit-button.active {
          background-color: var(--primary-color, #FFC0CB);
          color: #333;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .submit-button.active:hover {
          background-color: var(--primary-dark, #FFB6C1);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
      </style>
      
      <form id="note-form" class="note-input-form">
        <div class="input-group">
          <label for="title">Judul</label>
          <input type="text" id="title" placeholder="Masukkan judul catatan">
          <div class="char-count" id="title-count">0/${this.maxTitleLength}</div>
          <div class="error-message" id="title-error"></div>
        </div>
        
        <div class="input-group">
          <label for="body">Isi Catatan</label>
          <textarea id="body" rows="4" placeholder="Tulis catatan Anda di sini"></textarea>
          <div class="char-count" id="body-count">0/${this.maxBodyLength}</div>
          <div class="error-message" id="body-error"></div>
        </div>
        
        <button type="submit" id="submit-note" class="submit-button" disabled>Buat Catatan</button>
      </form>
    `;

    const form = this.shadowRoot.querySelector('#note-form');
    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const titleInput = this.shadowRoot.querySelector('#title');
        const bodyInput = this.shadowRoot.querySelector('#body');
        
        if (!titleInput || !bodyInput) return;
        
        console.log('Form submitted, creating add-note event');
        const newNoteEvent = new CustomEvent('add-note', {
          detail: {
            title: titleInput.value,
            body: bodyInput.value
          },
          bubbles: true,
          composed: true // Penting untuk event bisa keluar dari shadow DOM
        });
        
        this.dispatchEvent(newNoteEvent);
        console.log('Event add-note dispatched');
        
        form.reset();
        this.shadowRoot.querySelector('#title-count').textContent = `0/${this.maxTitleLength}`;
        this.shadowRoot.querySelector('#body-count').textContent = `0/${this.maxBodyLength}`;
        this.shadowRoot.querySelector('#submit-note').disabled = true;
        this.shadowRoot.querySelector('#submit-note').classList.remove('active');
      });
    }
  }
}

customElements.define('note-input', NoteInput);