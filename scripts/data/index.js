// Import stylesheets dan komponen
import '../../styles/style.css';
import '../components/app-bar.js';
import '../components/note-input.js';
import '../components/note-item.js';
import '../components/loading-indicator.js';
import NotesAPI from './notes-api.js';
import loadingState from '../components/loading-indicator.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM Content Loaded - Initializing app');
  
  // Setup CSS variables
  document.documentElement.style.setProperty('--primary-color', '#FFC0CB');
  document.documentElement.style.setProperty('--primary-dark', '#FFB6C1');
  document.documentElement.style.setProperty('--background-color', '#f5f5f5');
  document.documentElement.style.setProperty('--text-color', '#333');
  document.documentElement.style.setProperty('--card-color', '#fff');
  document.documentElement.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');
  document.documentElement.style.setProperty('--error-color', '#e74c3c');
  
  // Setup app-bar
  const appBar = document.querySelector('app-bar');
  if (appBar) {
    appBar.setAttribute('app-title', 'Aplikasi Catatan Pribadi');
  }
  
  // Setup note-input
  const noteInput = document.querySelector('note-input');
  if (noteInput) {
    noteInput.setAttribute('max-title-length', '50');
    noteInput.setAttribute('max-body-length', '1000');
  }

  // State untuk menyimpan catatan
  let notes = [];
  
  // Mengambil dan menampilkan data dari API
  await fetchAndRenderNotes();
  
  // PERBAIKAN: Debug listener delete-note
  document.addEventListener('delete-note', async (event) => {
    try {
      console.log('Event delete-note terdeteksi', event.detail);
      
      // Pastikan id tersedia dan valid
      if (!event.detail || !event.detail.id) {
        console.error('ID catatan tidak valid:', event.detail);
        showNotification('ID catatan tidak valid', 'error');
        return;
      }
      
      loadingState.show();
      const { id } = event.detail;
      
      console.log('Menghapus catatan dengan ID:', id);
      
      // Panggil API untuk menghapus catatan
      const result = await NotesAPI.deleteNote(id);
      console.log('Hasil delete dari API:', result);
      
      if (result.error) {
        showNotification(result.message || 'Gagal menghapus catatan', 'error');
        return;
      }
      
      // Update tampilan setelah berhasil menghapus
      await fetchAndRenderNotes();
      showNotification('Catatan berhasil dihapus', 'success');
    } catch (error) {
      console.error('Error saat menghapus catatan:', error);
      showNotification(`Error: ${error.message}`, 'error');
    } finally {
      loadingState.hide();
    }
  });
  
  // Event Listeners untuk Custom Events
  document.addEventListener('add-note', async (event) => {
    try {
      console.log('Event add-note terdeteksi', event.detail);
      loadingState.show();
      const { title, body } = event.detail;
      
      console.log('Menambahkan catatan:', { title, body });
      
      const result = await NotesAPI.addNote({ title, body });
      console.log('Hasil dari API:', result);
      
      if (result.error) {
        showNotification(result.message || 'Gagal menambahkan catatan', 'error');
        return;
      }
      
      await fetchAndRenderNotes();
      showNotification('Catatan berhasil ditambahkan', 'success');
    } catch (error) {
      console.error('Error saat menambahkan catatan:', error);
      showNotification(`Error: ${error.message}`, 'error');
    } finally {
      loadingState.hide();
    }
  });
  
  document.addEventListener('archive-note', async (event) => {
    try {
      console.log('Event archive-note terdeteksi', event.detail);
      loadingState.show();
      const { id } = event.detail;
      
      const result = await NotesAPI.archiveNote(id);
      console.log('Hasil archive dari API:', result);
      
      if (result.error) {
        showNotification(result.message || 'Gagal mengarsipkan catatan', 'error');
        return;
      }
      
      await fetchAndRenderNotes();
      showNotification('Catatan berhasil diarsipkan', 'success');
    } catch (error) {
      console.error('Error saat mengarsipkan catatan:', error);
      showNotification(`Error: ${error.message}`, 'error');
    } finally {
      loadingState.hide();
    }
  });
  
  document.addEventListener('unarchive-note', async (event) => {
    try {
      console.log('Event unarchive-note terdeteksi', event.detail);
      loadingState.show();
      const { id } = event.detail;
      
      const result = await NotesAPI.unarchiveNote(id);
      console.log('Hasil unarchive dari API:', result);
      
      if (result.error) {
        showNotification(result.message || 'Gagal membatalkan arsip catatan', 'error');
        return;
      }
      
      await fetchAndRenderNotes();
      showNotification('Catatan berhasil dipulihkan dari arsip', 'success');
    } catch (error) {
      console.error('Error saat membatalkan arsip catatan:', error);
      showNotification(`Error: ${error.message}`, 'error');
    } finally {
      loadingState.hide();
    }
  });
  
  // Fungsi untuk mengambil catatan dari API dan memperbarui tampilan
  async function fetchAndRenderNotes() {
    try {
      console.log('Memulai fetch catatan dari API');
      loadingState.show();
      
      // Mengambil catatan aktif
      const activeNotesResult = await NotesAPI.getAllNotes();
      console.log('Catatan aktif dari API:', activeNotesResult);
      
      if (activeNotesResult.error) {
        showNotification(`Gagal memuat catatan: ${activeNotesResult.message}`, 'error');
        return;
      }
      
      // Mengambil catatan arsip
      const archivedNotesResult = await NotesAPI.getArchivedNotes();
      console.log('Catatan arsip dari API:', archivedNotesResult);
      
      if (archivedNotesResult.error) {
        showNotification(`Gagal memuat catatan arsip: ${archivedNotesResult.message}`, 'error');
        return;
      }
      
      // Menggabungkan hasil
      notes = [
        ...(activeNotesResult.data || []),
        ...(archivedNotesResult.data || [])
      ];
      
      console.log('Semua catatan setelah fetch:', notes);
      
      renderNotes();
    } catch (error) {
      console.error('Error saat mengambil catatan:', error);
      showNotification(`Error: ${error.message}`, 'error');
    } finally {
      loadingState.hide();
    }
  }
  
  // Fungsi untuk menampilkan catatan
  function renderNotes() {
    const activeNotesContainer = document.getElementById('notes-list');
    const archivedNotesContainer = document.getElementById('archived-list');
    
    console.log('Container notes:', { activeNotesContainer, archivedNotesContainer });
    
    if (!activeNotesContainer || !archivedNotesContainer) {
      console.error('Container notes tidak ditemukan!');
      return;
    }
    
    activeNotesContainer.innerHTML = '';
    archivedNotesContainer.innerHTML = '';
    
    const activeNotes = notes.filter(note => !note.archived);
    const archivedNotes = notes.filter(note => note.archived);
    
    console.log('Active Notes untuk dirender:', activeNotes.length);
    console.log('Archived Notes untuk dirender:', archivedNotes.length);
    
    if (activeNotes.length === 0) {
      activeNotesContainer.innerHTML = '<p class="empty-notes">Tidak ada catatan aktif</p>';
    } else {
      activeNotes.forEach(note => {
        console.log('Rendering active note:', note);
        const noteElement = document.createElement('note-item');
        noteElement.note = note;
        activeNotesContainer.appendChild(noteElement);
      });
    }
    
    if (archivedNotes.length === 0) {
      archivedNotesContainer.innerHTML = '<p class="empty-notes">Tidak ada catatan diarsipkan</p>';
    } else {
      archivedNotes.forEach(note => {
        console.log('Rendering archived note:', note);
        const noteElement = document.createElement('note-item');
        noteElement.note = note;
        archivedNotesContainer.appendChild(noteElement);
      });
    }
  }
  
  // Fungsi untuk menampilkan notifikasi
  function showNotification(message, type) {
    console.log(`Notifikasi ${type}: ${message}`);
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('hide');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  // Tambahkan style untuk notifikasi jika belum ada
  if (!document.querySelector('#notification-style')) {
    const notificationStyle = document.createElement('style');
    notificationStyle.id = 'notification-style';
    notificationStyle.textContent = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 4px;
        color: white;
        font-family: 'Quicksand', sans-serif;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slide-in 0.3s ease;
        max-width: 300px;
      }
      
      .notification.success {
        background-color: var(--primary-color);
      }
      
      .notification.error {
        background-color: var(--primary-dark);
      }
      
      .notification.hide {
        animation: slide-out 0.3s ease forwards;
      }
      
      @keyframes slide-in {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slide-out {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
      
      .empty-notes {
        text-align: center;
        color: #7f8c8d;
        padding: 20px;
        font-family: 'Quicksand', sans-serif;
      }
    `;
    document.head.appendChild(notificationStyle);
  }

  console.log('Aplikasi berhasil diinisialisasi');
});