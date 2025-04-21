/**
 * Kelas untuk berinteraksi dengan Notes API
 * API Docs: https://notes-api.dicoding.dev/v2
 */
class NotesAPI {
  static BASE_URL = 'https://notes-api.dicoding.dev/v2';

  /**
   * Mengambil semua catatan aktif
   * @returns {Promise<Object>} Objek berisi status dan data catatan aktif
   */
  static async getAllNotes() {
    try {
      console.log('Fetching all notes from API');
      const response = await fetch(`${this.BASE_URL}/notes`);
      const responseJson = await response.json();
      
      console.log('getAllNotes response:', responseJson);
      
      if (responseJson.status !== 'success') {
        return { error: true, message: responseJson.message };
      }
      
      return { error: false, data: responseJson.data.notes };
    } catch (error) {
      console.error('Error in getAllNotes:', error);
      return { error: true, message: error.message };
    }
  }
  
  /**
   * Mengambil semua catatan arsip
   * @returns {Promise<Object>} Objek berisi status dan data catatan yang diarsipkan
   */
  static async getArchivedNotes() {
    try {
      console.log('Fetching archived notes from API');
      const response = await fetch(`${this.BASE_URL}/notes/archived`);
      const responseJson = await response.json();
      
      console.log('getArchivedNotes response:', responseJson);
      
      if (responseJson.status !== 'success') {
        return { error: true, message: responseJson.message };
      }
      
      return { error: false, data: responseJson.data.notes };
    } catch (error) {
      console.error('Error in getArchivedNotes:', error);
      return { error: true, message: error.message };
    }
  }
  
  /**
   * Menambahkan catatan baru
   * @param {Object} noteData - Data catatan baru
   * @param {string} noteData.title - Judul catatan
   * @param {string} noteData.body - Isi catatan
   * @returns {Promise<Object>} Hasil operasi
   */
  static async addNote({ title, body }) {
    try {
      console.log('Adding new note:', { title, body });
      const response = await fetch(`${this.BASE_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, body }),
      });
      
      const responseJson = await response.json();
      console.log('addNote response:', responseJson);
      
      if (responseJson.status !== 'success') {
        return { error: true, message: responseJson.message };
      }
      
      return { error: false, data: responseJson.data };
    } catch (error) {
      console.error('Error in addNote:', error);
      return { error: true, message: error.message };
    }
  }
  
  /**
   * Menghapus catatan berdasarkan ID
   * @param {string} id - ID catatan yang akan dihapus
   * @returns {Promise<Object>} Hasil operasi
   */
  static async deleteNote(id) {
    try {
      console.log('Deleting note with ID:', id);
      const response = await fetch(`${this.BASE_URL}/notes/${id}`, {
        method: 'DELETE',
      });
      
      const responseJson = await response.json();
      console.log('deleteNote response:', responseJson);
      
      if (responseJson.status !== 'success') {
        return { error: true, message: responseJson.message };
      }
      
      return { error: false };
    } catch (error) {
      console.error('Error in deleteNote:', error);
      return { error: true, message: error.message };
    }
  }
  
  /**
   * Mengarsipkan catatan berdasarkan ID
   * @param {string} id - ID catatan yang akan diarsipkan
   * @returns {Promise<Object>} Hasil operasi
   */
  static async archiveNote(id) {
    try {
      console.log('Archiving note with ID:', id);
      const response = await fetch(`${this.BASE_URL}/notes/${id}/archive`, {
        method: 'POST',
      });
      
      const responseJson = await response.json();
      console.log('archiveNote response:', responseJson);
      
      if (responseJson.status !== 'success') {
        return { error: true, message: responseJson.message };
      }
      
      return { error: false };
    } catch (error) {
      console.error('Error in archiveNote:', error);
      return { error: true, message: error.message };
    }
  }
  
  /**
   * Mengembalikan catatan dari arsip berdasarkan ID
   * @param {string} id - ID catatan yang akan dibatalkan arsipnya
   * @returns {Promise<Object>} Hasil operasi
   */
  static async unarchiveNote(id) {
    try {
      console.log('Unarchiving note with ID:', id);
      const response = await fetch(`${this.BASE_URL}/notes/${id}/unarchive`, {
        method: 'POST',
      });
      
      const responseJson = await response.json();
      console.log('unarchiveNote response:', responseJson);
      
      if (responseJson.status !== 'success') {
        return { error: true, message: responseJson.message };
      }
      
      return { error: false };
    } catch (error) {
      console.error('Error in unarchiveNote:', error);
      return { error: true, message: error.message };
    }
  }
}

export default NotesAPI;