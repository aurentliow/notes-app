class NoteItem extends HTMLElement {
  constructor() {
    super();
    this._note = null;
  }
  
  set note(note) {
    this._note = note;
    this.render();
  }
  
  connectedCallback() {
    if (this._note) {
      this.render();
    } else if (this.hasAttribute('id')) {
      const id = this.getAttribute('id');
      const title = this.getAttribute('title');
      const body = this.getAttribute('body');
      const createdAt = this.getAttribute('created-at');
      const archived = this.getAttribute('archived') === 'true';
      
      this._note = { id, title, body, createdAt, archived };
      this.render();
    }
  }
  
  render() {
    if (!this._note) return;
    
    try {
      // Format tanggal
      const date = new Date(this._note.createdAt);
      const formattedDate = date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      // Render HTML
      this.innerHTML = `
        <div class="note-item">
          <div class="note-item__content">
            <h3 class="note-item__title">${this._note.title}</h3>
            <p class="note-item__date">${formattedDate}</p>
            <p class="note-item__body">${this._note.body}</p>
          </div>
          <div class="note-item__action">
            <button onclick="handleDelete('${this._note.id}')" class="hapus-button">Hapus</button>
            <button onclick="handleArchive('${this._note.id}', ${this._note.archived})" class="arsipkan-button">
              ${this._note.archived ? 'Pulihkan' : 'Arsipkan'}
            </button>
          </div>
        </div>
      `;
    } catch (error) {
      console.error('Error rendering note-item:', error);
    }
  }
}

// Definisikan custom element
customElements.define('note-item', NoteItem);

// Fungsi global untuk handle delete
window.handleDelete = function(id) {
  try {
    console.log('Delete button clicked for ID:', id);
    if (confirm('Apakah Anda yakin ingin menghapus catatan ini?')) {
      document.dispatchEvent(new CustomEvent('delete-note', {
        detail: { id }
      }));
    }
  } catch (error) {
    console.error('Error in handleDelete:', error);
  }
};

// Fungsi global untuk handle archive/unarchive
window.handleArchive = function(id, isArchived) {
  try {
    console.log('Archive button clicked for ID:', id, 'isArchived:', isArchived);
    const eventName = isArchived ? 'unarchive-note' : 'archive-note';
    document.dispatchEvent(new CustomEvent(eventName, {
      detail: { id }
    }));
  } catch (error) {
    console.error('Error in handleArchive:', error);
  }
};