import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { message } from 'antd';
import { userSignup } from '../services/Api';
import './Signup.css';

function Signup() {
  const [newSignup, setNewSignup] = useState({
    name: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewSignup({
      ...newSignup,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log('Attempting to sign up with:', newSignup);
      const data = {
        username: newSignup.name,
        email: newSignup.email,
        password: newSignup.password
      };

      const response = await userSignup(data);
      // console.log('Response:', data);
      // console.log('Response:', response);
      if (response.status === 201) {
        message.success('Successfully signed up');
        navigate('/'); // Navigate to login page after successful signup
      } else {
        message.error('Signup failed');
      }
    } catch (error) {
      console.error('There was an error signing up!', error);
      if (error.response) {
        console.error('Server responded with:', error.response.data);
        message.error(`Signup failed: ${JSON.stringify(error.response.data)}`);
      } else {
        message.error('Signup failed');
      }
    }
  };

  return (
    <div className='container pt-5'>
      <div className='row justify-content-center'>
        <div className='col-md-6'>
          <div className='card'>
            <div className='card-body'>
              <h1 className='text-center mb-4'>Signup</h1>
              <form onSubmit={handleSubmit}>
                <div className='form-group'>
                  <label htmlFor='name'>Name:</label>
                  <input
                    type='text'
                    className='form-control'
                    id='name'
                    name='name'
                    value={newSignup.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='email'>Email:</label>
                  <input
                    type='email'
                    className='form-control'
                    id='email'
                    name='email'
                    value={newSignup.email}
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
                    value={newSignup.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="text-center mb-3">
                  <Link to='/'>Already have an account? Login</Link>
                </div>
                <button type='submit' className='btn btn-primary btn-block'>
                  Signup
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
