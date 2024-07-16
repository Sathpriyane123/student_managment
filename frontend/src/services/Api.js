// api.js
import axios from 'axios';
import { BASE_URL } from './Baseurl';

export const fetchStudents = async () => {
    return await axios.get(`${BASE_URL}/students/`);
};

export const addStudent = async (newStudent) => {
    return await axios.post(`${BASE_URL}/students/`, newStudent);
};

export const getStudent = async (id) => {
    return await axios.get(`${BASE_URL}/students/${id}/`);
};

export const updateStudent = async (id, updatedStudent) => {
    return await axios.put(`${BASE_URL}/students/${id}/`, updatedStudent);
};

export const deleteStudent = async (id) => {
    return await axios.delete(`${BASE_URL}/students/${id}/`);
};
