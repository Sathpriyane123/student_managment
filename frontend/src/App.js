import React, { useState, useEffect } from 'react';
import {
  fetchStudents,
  addStudent,
  getStudent,
  updateStudent,
  deleteStudent
} from './services/Api';
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
    fetchAllStudents();
  }, []);

  const fetchAllStudents = async () => {
    try {
      const response = await fetchStudents();
      setStudents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (selectedStudent) {
      handleUpdateStudent();
    } else {
      handleAddStudent();
    }
  };

  const handleAddStudent = async () => {
    try {
      const response = await addStudent(newStudent);
      setStudents([...students, response.data]);
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewClick = async (id) => {
    try {
      const response = await getStudent(id);
      setToView(response.data);
      setOpenView(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setNewStudent(student);
  };

  const handleUpdateStudent = async () => {
    try {
      await updateStudent(selectedStudent.id, newStudent);
      fetchAllStudents();
      resetForm();
      setSelectedStudent(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelUpdateStudent = () => {
    setSelectedStudent(null);
    resetForm();
  };

  const handleDeleteStudent = async (id) => {
    try {
      await deleteStudent(id);
      fetchAllStudents();
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
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

  return (
    <div className="app-container">
      <h1>Student Management System</h1>

      <div className="form-container">
        <form onSubmit={handleFormSubmit}>
          <div className="form-inputs">
            <input
              type="text"
              name="first_name"
              placeholder="First name"
              value={newStudent.first_name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last name"
              value={newStudent.last_name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="age"
              placeholder="Age"
              value={newStudent.age}
              onChange={handleInputChange}
            />
            <select
              name="gender"
              value={newStudent.gender}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <select
              name="grade"
              value={newStudent.grade}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="">Select Grade</option>
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="B+">B+</option>
              <option value="B">B</option>
              <option value="C+">C+</option>
              <option value="C">C</option>
              <option value="P">P</option>
              <option value="F">F</option>
            </select>
            <textarea
              name="address"
              placeholder="Address"
              value={newStudent.address}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="contact_number"
              placeholder="Contact Number"
              value={newStudent.contact_number}
              onChange={handleInputChange}
            />
            <div className="form-buttons">
              {selectedStudent ? (
                <>
                  <button type="button" onClick={handleUpdateStudent}>
                    Update
                  </button>
                  <button type="button" onClick={handleCancelUpdateStudent}>
                    Cancel
                  </button>
                </>
              ) : (
                <button type="submit">Add New Student</button>
              )}
            </div>
          </div>
        </form>
      </div>

      <ul className="student-list">
        {students.map((student) => (
          <li key={student.id}>
            <div>
              <strong>
                {student.first_name} {student.last_name}
              </strong>
            </div>
            <div className="actions">
              <button className="view" onClick={() => handleViewClick(student.id)}>
                View
              </button>
              <button className="edit" onClick={() => handleEditClick(student)}>
                Edit
              </button>
              <button className="delete" onClick={() => handleDeleteStudent(student.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {openView && (
        <div className="outer-box">
          <strong>
            {toView.first_name} {toView.last_name}
          </strong>
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
