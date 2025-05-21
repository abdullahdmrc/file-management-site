import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [uploadError, setUploadError] = useState('');
  const [listError, setListError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const navigate = useNavigate();
  const username = localStorage.getItem('username'); // Get username from localStorage

  useEffect(() => {
    // Redirect to login if no username is found (not authenticated)
    if (!username) {
      navigate('/');
    } else {
      fetchFiles();
    }
  }, [username, navigate]);

  const fetchFiles = async () => {
    try {
      setListError('');
      const res = await axios.get('http://localhost:8080/api/files/list', { // Corrected endpoint
        params: { username: username }, // Pass username as request parameter
      });
      setFileList(res.data);
    } catch (err) {
      console.error('Dosyalar alınamadı:', err);
      setListError('Dosyalar yüklenirken bir hata oluştu.');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Lütfen bir dosya seçin.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('username', username); // Pass username as form data

    try {
      setUploadError('');
      setUploadSuccess('');
      await axios.post('http://localhost:8080/api/files/upload', formData, { // Corrected endpoint
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadSuccess('Dosya başarıyla yüklendi!');
      setSelectedFile(null); // Clear selected file
      e.target.reset(); // Reset the form input
      fetchFiles(); // Refresh the file list
    } catch (err) {
      console.error('Yükleme hatası:', err);
      setUploadError('Dosya yüklenirken bir hata oluştu.');
    }
  };

  const handleDelete = async (fileId) => { // Changed from filename to fileId
    try {
      setDeleteError('');
      await axios.delete(`http://localhost:8080/api/files/${fileId}`, { // Corrected endpoint
        params: { username: username }, // Pass username as request parameter
      });
      fetchFiles(); // Refresh the file list
    } catch (err) {
      console.error('Silme hatası:', err);
      setDeleteError('Dosya silinirken bir hata oluştu.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username'); // Remove username from localStorage
    navigate('/'); // Redirect to login page
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-xl mt-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Dosya Yönetimi</h2>

      <form onSubmit={handleUpload} className="mb-6 p-4 border border-gray-200 rounded-md flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <input
          type="file"
          accept=".pdf, .png, .jpg, .jpeg" // Added .jpeg
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out font-semibold"
        >
          Yükle
        </button>
      </form>
      {uploadError && <p className="text-red-500 text-center mb-4">{uploadError}</p>}
      {uploadSuccess && <p className="text-green-500 text-center mb-4">{uploadSuccess}</p>}

      <h3 className="text-2xl font-bold text-gray-800 mb-4">Yüklenen Dosyalar</h3>
      {listError && <p className="text-red-500 text-center mb-4">{listError}</p>}
      {deleteError && <p className="text-red-500 text-center mb-4">{deleteError}</p>}

      {fileList.length === 0 ? (
        <p className="text-gray-600 text-center">Henüz yüklenmiş dosya yok.</p>
      ) : (
        <ul className="space-y-3">
          {fileList.map((file) => (
            <li
              key={file.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-md shadow-sm border border-gray-200"
            >
              <div className="flex-1">
                <span className="font-medium text-gray-800">{file.fileName}</span>
                <span className="text-sm text-gray-500 ml-2">({(file.fileSize / 1024).toFixed(2)} KB)</span>
                <span className="text-sm text-gray-500 ml-2">({new Date(file.uploadDate).toLocaleDateString()})</span>
              </div>
              <button
                onClick={() => handleDelete(file.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 ease-in-out font-semibold text-sm"
              >
                Sil
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={handleLogout}
        className="w-full mt-8 px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition duration-300 ease-in-out font-semibold"
      >
        Çıkış Yap
      </button>
    </div>
  );
};

export default Dashboard;
