/**
 * Modul untuk berinteraksi dengan Notes API
 */
const BASE_URL = 'https://notes-api.dicoding.dev/v2';

/**
 * Fungsi untuk mendapatkan semua catatan aktif
 * @returns {Promise<Object>} Objek berisi error, message, dan data
 */
const getAllNotes = async () => {
  try {
    console.log('Mengambil semua catatan dari API...');
    const response = await fetch(`${BASE_URL}/notes`, {
      method: 'GET',
    });
    
    const responseJson = await response.json();
    console.log('Response dari API:', responseJson);
    
    if (responseJson.status !== 'success') {
      return { 
        error: true, 
        message: responseJson.message || 'Gagal mengambil catatan', 
        data: null 
      };
    }
    
    return { 
      error: false, 
      message: 'Catatan berhasil diambil', 
      data: responseJson.data 
    };
  } catch (error) {
    console.error('Error fetching notes:', error);
    return { 
      error: true, 
      message: 'Terjadi kesalahan pada server', 
      data: null 
    };
  }
};

/**
 * Fungsi untuk menambahkan catatan baru
 * @param {Object} noteData - Parameter untuk menambahkan catatan
 * @param {string} noteData.title - Judul catatan
 * @param {string} noteData.body - Isi catatan
 * @returns {Promise<Object>} Objek berisi error, message, dan data
 */
const addNote = async (noteData) => {
  try {
    console.log('Menambahkan catatan baru:', noteData);
    const response = await fetch(`${BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    });
    
    const responseJson = await response.json();
    console.log('Response dari API addNote:', responseJson);
    
    if (responseJson.status !== 'success') {
      return { 
        error: true, 
        message: responseJson.message || 'Gagal menambahkan catatan', 
        data: null 
      };
    }
    
    return { 
      error: false, 
      message: 'Catatan berhasil ditambahkan', 
      data: responseJson.data 
    };
  } catch (error) {
    console.error('Error adding note:', error);
    return { 
      error: true, 
      message: 'Terjadi kesalahan pada server', 
      data: null 
    };
  }
};

/**
 * Fungsi untuk menghapus catatan
 * @param {string} id - ID catatan yang akan dihapus
 * @returns {Promise<Object>} Objek berisi error dan message
 */
const deleteNote = async (id) => {
  try {
    console.log('Menghapus catatan dengan ID:', id);
    const response = await fetch(`${BASE_URL}/notes/${id}`, {
      method: 'DELETE',
    });
    
    const responseJson = await response.json();
    console.log('Response dari API deleteNote:', responseJson);
    
    if (responseJson.status !== 'success') {
      return { 
        error: true, 
        message: responseJson.message || 'Gagal menghapus catatan' 
      };
    }
    
    return { 
      error: false, 
      message: 'Catatan berhasil dihapus' 
    };
  } catch (error) {
    console.error('Error deleting note:', error);
    return { 
      error: true, 
      message: 'Terjadi kesalahan pada server' 
    };
  }
};

/**
 * Fungsi untuk mengarsipkan catatan
 * @param {string} id - ID catatan yang akan diarsipkan
 * @returns {Promise<Object>} Objek berisi error dan message
 */
const archiveNote = async (id) => {
  try {
    console.log('Mengarsipkan catatan dengan ID:', id);
    const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
      method: 'POST',
    });
    
    const responseJson = await response.json();
    console.log('Response dari API archiveNote:', responseJson);
    
    if (responseJson.status !== 'success') {
      return { 
        error: true, 
        message: responseJson.message || 'Gagal mengarsipkan catatan' 
      };
    }
    
    return { 
      error: false, 
      message: 'Catatan berhasil diarsipkan' 
    };
  } catch (error) {
    console.error('Error archiving note:', error);
    return { 
      error: true, 
      message: 'Terjadi kesalahan pada server' 
    };
  }
};

/**
 * Fungsi untuk mendapatkan semua catatan yang diarsipkan
 * @returns {Promise<Object>} Objek berisi error, message, dan data
 */
const getArchivedNotes = async () => {
  try {
    console.log('Mengambil catatan arsip dari API...');
    const response = await fetch(`${BASE_URL}/notes/archived`, {
      method: 'GET',
    });
    
    const responseJson = await response.json();
    console.log('Response dari API getArchivedNotes:', responseJson);
    
    if (responseJson.status !== 'success') {
      return { 
        error: true, 
        message: responseJson.message || 'Gagal mengambil catatan arsip', 
        data: null 
      };
    }
    
    return { 
      error: false, 
      message: 'Catatan arsip berhasil diambil', 
      data: responseJson.data 
    };
  } catch (error) {
    console.error('Error fetching archived notes:', error);
    return { 
      error: true, 
      message: 'Terjadi kesalahan pada server', 
      data: null 
    };
  }
};

/**
 * Fungsi untuk mengembalikan catatan dari arsip
 * @param {string} id - ID catatan yang akan dikembalikan dari arsip
 * @returns {Promise<Object>} Objek berisi error dan message
 */
const unarchiveNote = async (id) => {
  try {
    console.log('Mengembalikan catatan dari arsip dengan ID:', id);
    const response = await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
      method: 'POST',
    });
    
    const responseJson = await response.json();
    console.log('Response dari API unarchiveNote:', responseJson);
    
    if (responseJson.status !== 'success') {
      return { 
        error: true, 
        message: responseJson.message || 'Gagal mengembalikan catatan dari arsip' 
      };
    }
    
    return { 
      error: false, 
      message: 'Catatan berhasil dikembalikan dari arsip' 
    };
  } catch (error) {
    console.error('Error unarchiving note:', error);
    return { 
      error: true, 
      message: 'Terjadi kesalahan pada server' 
    };
  }
};

// Export objek dengan semua fungsi API
const NotesAPI = {
  getAllNotes,
  getActiveNotes: getAllNotes, // Alias untuk kompatibilitas
  addNote,
  deleteNote,
  archiveNote,
  getArchivedNotes,
  unarchiveNote,
};

export default NotesAPI;