import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { userLogin } from '../services/Api';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await userLogin(credentials);
      console.log(response);
      if (response.status === 200) {
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        navigate('/student'); // Navigate to student page
        message.success('Successfully logged in');
      } else {
        message.error('Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      message.error('Login failed: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  return (
    <div className='container pt-5'>
      <div className='row justify-content-center'>
        <div className='col-md-6'>
          <div className='card'>
            <div className='card-body'>
              <h1 className='text-center mb-4'>Login</h1>
              <form onSubmit={handleSubmit}>
                <div className='form-group'>
                  <label htmlFor='username'>Username:</label>
                  <input
                    type='text'
                    className='form-control'
                    id='username'
                    name='username'
                    value={credentials.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='password'>Password:</label>
                  <input
                    type='password'
                    className='form-control'
                    id='password'
                    name='password'
                    value={credentials.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="text-center mb-3">
                  <Link to='/signup'>Don't have an account? Signup</Link>
                </div>
                <button type='submit' className='btn btn-primary btn-block'>
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
