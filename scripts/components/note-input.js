/**
 * Komponen untuk input catatan baru
 */
class NoteInput extends HTMLElement {
  constructor() {
    super();
    this.maxTitleLength = 50;
    this.maxBodyLength = 1000;
  }

  connectedCallback() {
    // Mendapatkan konfigurasi dari atribut
    if (this.hasAttribute('max-title-length')) {
      this.maxTitleLength = parseInt(this.getAttribute('max-title-length'), 10);
    }
    
    if (this.hasAttribute('max-body-length')) {
      this.maxBodyLength = parseInt(this.getAttribute('max-body-length'), 10);
    }
    
    this.render();
    this.initEvents();
  }

  render() {
    this.innerHTML = `
      <div class="note-input">
        <h2>Buat Catatan Baru</h2>
        <form id="noteForm">
          <div class="input-group">
            <label for="title">Judul</label>
            <input 
              type="text" 
              id="title" 
              placeholder="Judul catatan (maks. ${this.maxTitleLength} karakter)" 
              maxlength="${this.maxTitleLength}" 
              required
            >
            <span class="char-counter" id="titleCounter">0/${this.maxTitleLength}</span>
          </div>
          <div class="input-group">
            <label for="body">Isi Catatan</label>
            <textarea 
              id="body" 
              rows="4" 
              placeholder="Isi catatan (maks. ${this.maxBodyLength} karakter)" 
              maxlength="${this.maxBodyLength}" 
              required
            ></textarea>
            <span class="char-counter" id="bodyCounter">0/${this.maxBodyLength}</span>
          </div>
          <button type="submit" id="submitButton">Simpan</button>
        </form>
      </div>
    `;
  }

  initEvents() {
    const form = this.querySelector('#noteForm');
    const titleInput = this.querySelector('#title');
    const bodyInput = this.querySelector('#body');
    const titleCounter = this.querySelector('#titleCounter');
    const bodyCounter = this.querySelector('#bodyCounter');
    
    // Inisialisasi counter
    titleCounter.textContent = `0/${this.maxTitleLength}`;
    bodyCounter.textContent = `0/${this.maxBodyLength}`;
    
    // Update counter saat input berubah
    titleInput.addEventListener('input', () => {
      const count = titleInput.value.length;
      titleCounter.textContent = `${count}/${this.maxTitleLength}`;
      
      // Perubahan warna jika mendekati batas
      if (count > this.maxTitleLength * 0.8) {
        titleCounter.style.color = 'orange';
      } else {
        titleCounter.style.color = '';
      }
    });
    
    bodyInput.addEventListener('input', () => {
      const count = bodyInput.value.length;
      bodyCounter.textContent = `${count}/${this.maxBodyLength}`;
      
      // Perubahan warna jika mendekati batas
      if (count > this.maxBodyLength * 0.8) {
        bodyCounter.style.color = 'orange';
      } else {
        bodyCounter.style.color = '';
      }
    });
    
    // Submit form
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      
      const title = titleInput.value.trim();
      const body = bodyInput.value.trim();
      
      if (!title || !body) {
        alert('Judul dan isi catatan harus diisi');
        return;
      }
      
      console.log('Mengirim event add-note dengan:', { title, body });
      
      // Kirim event add-note untuk ditangkap oleh index.js
      document.dispatchEvent(new CustomEvent('add-note', {
        detail: { title, body }
      }));
      
      // Reset form
      form.reset();
      titleCounter.textContent = `0/${this.maxTitleLength}`;
      bodyCounter.textContent = `0/${this.maxBodyLength}`;
    });
  }
}

customElements.define('note-input', NoteInput);