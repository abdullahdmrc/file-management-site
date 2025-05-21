import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(''); // Changed from email to username
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Backend expects username and password, not email
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username, // Use username
        password,
      });

      
      const loggedInUser = response.data;
      localStorage.setItem('username', loggedInUser.username); // Store username for file operations
      console.log('Login successful:', loggedInUser);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Giriş başarısız! Kullanıcı adı veya şifre hatalı olabilir.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-xl mt-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Giriş Yap</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="username">
            Kullanıcı Adı:
          </label>
          <input
            type="text" // Changed from email to text
            id="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out font-semibold"
        >
          Giriş Yap
        </button>
        <p className="text-center text-gray-600 text-sm mt-4">
          Hesabınız yok mu?{' '}
          <a href="/register" className="text-blue-600 hover:underline font-medium">
            Kayıt olun
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
