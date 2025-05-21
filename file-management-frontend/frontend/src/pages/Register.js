import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(''); // Added username
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:8080/api/auth/register', {
        username, // Include username in registration
        email,
        password,
      });

      setSuccess('Kayıt başarılı! Giriş ekranına yönlendiriliyorsunuz...');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Registration error:', err);
      // More specific error message based on backend response if possible
      setError('Kayıt başarısız. Kullanıcı adı veya e-posta zaten var olabilir.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-xl mt-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Kayıt Ol</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 text-center mb-4">{success}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="username">
            Kullanıcı Adı:
          </label>
          <input
            type="text"
            id="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
            Şifre:
          </label>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300 ease-in-out font-semibold"
        >
          Kayıt Ol
        </button>
      </form>
    </div>
  );
};

export default Register;