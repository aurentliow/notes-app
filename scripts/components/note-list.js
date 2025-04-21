import { getActiveNotes } from '../data/notes-api.js';
import './note-item.js';
// Uncomment jika loading-indicator.js sudah ada
// import { showLoading, hideLoading } from './loading-indicator.js';

/**
 * Komponen untuk menampilkan daftar catatan
 */
class NoteList extends HTMLElement {
  constructor() {
    super();
    this.notes = [];
    this.loading = false;
    
    // Binding methods
    this.handleNoteAdded = this.handleNoteAdded.bind(this);
    this.handleNoteDeleted = this.handleNoteDeleted.bind(this);
    this.handleNoteArchived = this.handleNoteArchived.bind(this);
  }
  
  connectedCallback() {
    this.loadNotes();
    
    // Mendengarkan events dari komponen lain
    document.addEventListener('note-added', this.handleNoteAdded);
    document.addEventListener('note-deleted', this.handleNoteDeleted);
    document.addEventListener('note-archived', this.handleNoteArchived);
  }
  
  disconnectedCallback() {
    // Membersihkan event listeners saat komponen dihapus dari DOM
    document.removeEventListener('note-added', this.handleNoteAdded);
    document.removeEventListener('note-deleted', this.handleNoteDeleted);
    document.removeEventListener('note-archived', this.handleNoteArchived);
  }
  
  async loadNotes() {
    try {
      this.loading = true;
      this.render(); // Render loading state
      
      // Uncomment jika loading-indicator.js sudah ada
      // showLoading();
      
      const { error, data } = await getActiveNotes();
      
      // Uncomment jika loading-indicator.js sudah ada
      // hideLoading();
      
      if (error) {
        console.error('Gagal mengambil data catatan');
        this.notes = [];
      } else {
        this.notes = data || [];
      }
      
      this.loading = false;
      this.render();
    } catch (error) {
      console.error('Error loading notes:', error);
      this.loading = false;
      // hideLoading();
      this.render();
    }
  }
  
  handleNoteAdded(event) {
    // Refresh catatan dari server setelah penambahan
    this.loadNotes();
  }
  
  handleNoteDeleted(event) {
    const { id } = event.detail;
    // Hapus catatan dari array
    this.notes = this.notes.filter(note => note.id !== id);
    this.render();
  }
  
  handleNoteArchived(event) {
    const { id } = event.detail;
    // Hapus catatan dari daftar aktif
    this.notes = this.notes.filter(note => note.id !== id);
    this.render();
  }
  
  render() {
    if (this.loading) {
      this.innerHTML = '<div class="notes-list-loading">Memuat catatan...</div>';
      return;
    }
    
    if (this.notes.length === 0) {
      this.innerHTML = '<div class="empty-notes">Tidak ada catatan aktif</div>';
      return;
    }
    
    this.innerHTML = `
      <div class="notes-list">
        <h2>Catatan Aktif</h2>
        <div class="notes-container" id="activeNotes"></div>
      </div>
    `;
    
    const notesContainer = this.querySelector('#activeNotes');
    
    this.notes.forEach(note => {
      const noteItem = document.createElement('note-item');
      noteItem.setAttribute('id', note.id);
      noteItem.setAttribute('title', note.title);
      noteItem.setAttribute('body', note.body);
      noteItem.setAttribute('created-at', note.createdAt);
      
      notesContainer.appendChild(noteItem);
    });
  }
}

customElements.define('note-list', NoteList);