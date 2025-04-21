class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._note = null;
  }
  
  set note(note) {
    this._note = note;
    this.render();
  }
  
  get note() {
    return this._note;
  }
  
  formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  }
  
  render() {
    if (!this._note) {
      console.error('Data catatan kosong.');
      return;
    }
    
    const { id, title, body, createdAt, archived } = this._note;
    console.log('Rendering note item:', { id, title, archived });
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        
        .note-card {
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
          padding-bottom: 70px;
          background-color: var(--card-color, white);
          border-radius: 8px;
          box-shadow: 0 2px 8px var(--shadow-color, rgba(0, 0, 0, 0.1));
          padding: 1.5rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .note-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px var(--shadow-color, rgba(0, 0, 0, 0.15));
        }
        
        .note-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text-color, #333);
          font-family: 'Quicksand', sans-serif;
        }
        
        .date {
          font-size: 0.8rem;
          color: #7f8c8d;
          margin-bottom: 1rem;
          font-family: 'Quicksand', sans-serif;
        }
        
        .note-body {
          flex-grow: 1;
          white-space: pre-line;
          margin-bottom: 1.5rem;
          line-height: 1.5;
          color: var(--text-color, #555);
          font-family: 'Quicksand', sans-serif;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
        }
        
        .note-actions {
          position: absolute;
          bottom: 1.25rem;
          right: 1.25rem;
          left: 1.25rem;
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }
        
        .archive-button, .delete-button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          font-family: 'Quicksand', sans-serif;
          min-width: 80px;
          text-align: center;
          font-size: 0.9rem;
        }
        
        .archive-button.primary {
          background-color: var(--primary-color, #FFC0CB);
          color: #333;
          border: 1px solid #d4a4a9;
        }
        
        .archive-button.primary:hover {
          background-color: var(--primary-dark, #FFB6C1);
        }
        
        .archive-button.secondary {
          background-color: #ecf0f1;
          color: #555;
          border: 1px solid #ddd;
        }
        
        .archive-button.secondary:hover {
          background-color: #ddd;
        }
        
        .delete-button {
          background-color: #ffecec;
          color: var(--error-color, #e74c3c);
          border: 1px solid #f8d7da;
        }
        
        .delete-button:hover {
          background-color: #f8d7da;
        }
      </style>
      
      <div class="note-card">
        <h3 class="note-title">${title}</h3>
        <div class="date">${this.formatDate(createdAt)}</div>
        <p class="note-body">${body}</p>
        <div class="note-actions">
          <button class="archive-button ${archived ? 'secondary' : 'primary'}" data-id="${id}">
            ${archived ? 'Batal Arsip' : 'Arsipkan'}
          </button>
          <button class="delete-button" data-id="${id}">Hapus</button>
        </div>
      </div>
    `;
    
    const archiveButton = this.shadowRoot.querySelector('.archive-button');
    archiveButton.addEventListener('click', this._onArchiveClick.bind(this));
    
    const deleteButton = this.shadowRoot.querySelector('.delete-button');
    deleteButton.addEventListener('click', this._onDeleteClick.bind(this));
  }
  
  _onArchiveClick(event) {
    event.stopPropagation();
    const noteId = event.target.dataset.id;
    console.log('Archive button clicked for note:', noteId);
    
    const eventName = this._note.archived ? 'unarchive-note' : 'archive-note';
    
    const customEvent = new CustomEvent(eventName, {
      detail: { id: noteId },
      bubbles: true,
      composed: true // Penting untuk event bisa keluar dari shadow DOM
    });
    
    this.dispatchEvent(customEvent);
    console.log(`Event ${eventName} dispatched`);
  }
  
  _onDeleteClick(event) {
    event.stopPropagation();
    const noteId = event.target.dataset.id;
    console.log('Delete button clicked for note:', noteId);
    
    const customEvent = new CustomEvent('delete-note', {
      detail: { id: noteId },
      bubbles: true,
      composed: true // Penting untuk event bisa keluar dari shadow DOM
    });
    
    this.dispatchEvent(customEvent);
    console.log('Event delete-note dispatched');
  }
}

customElements.define('note-item', NoteItem);