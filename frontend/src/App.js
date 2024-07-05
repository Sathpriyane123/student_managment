// App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    first_name: '',
    last_name: '',
    age: '',
    gender: '',
    grade: '',
    address: '',
    contact_number: '',
  });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [toView, setToView] = useState({
    first_name: '',
    last_name: '',
    age: '',
    gender: '',
    grade: '',
    address: '',
    contact_number: '',
  });
  const [openView, setOpenView] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios.get('http://127.0.0.1:8000/api/students/')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => console.error(error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const handleAddStudent = () => {
    axios.post('http://127.0.0.1:8000/api/students/', newStudent)
      .then(response => {
        setStudents([...students, response.data]);
        setNewStudent({
          first_name: '',
          last_name: '',
          age: '',
          gender: '',
          grade: '',
          address: '',
          contact_number: '',
        });
      })
      .catch(error => console.error(error));
  };

  const handleViewClick = async (id) => {
    const response = await axios.get(`http://127.0.0.1:8000/api/students/${id}/`);
    setToView(response.data);
    setOpenView(true);
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setNewStudent(student);
  };

  const handleUpdateStudent = () => {
    axios.put(`http://127.0.0.1:8000/api/students/${selectedStudent.id}/`, newStudent)
      .then(response => {
        fetchStudents();
        setNewStudent({
          first_name: '',
          last_name: '',
          age: '',
          gender: '',
          grade: '',
          address: '',
          contact_number: '',
        });
        setSelectedStudent(null);
      })
      .catch(error => console.error(error));
  };

  const handleCancelUpdateStudent = () => {
    setSelectedStudent(null);
    setNewStudent({
      first_name: '',
      last_name: '',
      age: '',
      gender: '',
      grade: '',
      address: '',
      contact_number: '',
    });
  };

  const handleDeleteStudent = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/students/${id}/`)
      .then(response => {
        fetchStudents();
      })
      .catch(error => console.error(error));
  };

  return (
    <div className="app-container">
      <h1>Student Management System</h1>

      {/* Form Container */}
      <div className="form-container">
        <div className="form-inputs">
          <input type="text" name="first_name" placeholder="First name" value={newStudent.first_name} onChange={handleInputChange} />
          <input type="text" name="last_name" placeholder="Last name" value={newStudent.last_name} onChange={handleInputChange} />
          <input type="text" name="age" placeholder="Age" value={newStudent.age} onChange={handleInputChange} />
          <select name="gender" value={newStudent.gender} onChange={handleInputChange} className='form-control'>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <select name="grade" value={newStudent.grade} onChange={handleInputChange} className='form-control'>
            <option value="">Select Grade</option>
            <option value="A+">A+</option>
            <option value="A">A</option>
            <option value="B+">B+</option>
            <option value="B">C</option>
            <option value="C+">C+</option>
            <option value="C">C</option>
            <option value="P">P</option>
            <option value="F">F</option>

            {/* Add more options as needed */}
          </select>
          <textarea name="address" placeholder="Address" value={newStudent.address} onChange={handleInputChange} />
          <input type="text" name="contact_number" placeholder="Contact Number" value={newStudent.contact_number} onChange={handleInputChange} />

          <div className="form-buttons">
            {selectedStudent ? (
              <>
                <button onClick={handleUpdateStudent}>Update</button>
                <button onClick={handleCancelUpdateStudent}>Cancel</button>
              </>
            ) : (
              <button onClick={handleAddStudent}>Add New Student</button>
            )}
          </div>
        </div>
      </div>

      {/* Student List */}
      <ul className="student-list">
        {students.map(student => (
          <li key={student.id}>
            <div>
              <strong>{student.first_name} {student.last_name}</strong>
            </div>
            <div className="actions">
              <button className="view" onClick={() => handleViewClick(student.id)}>View</button>
              <button className="edit" onClick={() => handleEditClick(student)}>Edit</button>
              <button className="delete" onClick={() => handleDeleteStudent(student.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Single View */}
      {openView && (
        <div className="outer-box">
          <strong>{toView.first_name} {toView.last_name}</strong>
          <br />
          <span>Age: {toView.age}</span>
          <br />
          <span>Gender: {toView.gender}</span>
          <br />
          <span>Grade: {toView.grade}</span>
          <br />
          <span>Address: {toView.address}</span>
          <br />
          <span>Contact Number: {toView.contact_number}</span>
          <br />
          <button onClick={() => setOpenView(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default App;