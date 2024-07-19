import React, { useState, useEffect, useCallback } from 'react';
import './Student.css';
import {
  fetchStudents,
  addStudent,
  getStudent,
  updateStudent,
  deleteStudent,
} from '../services/Api';
import { useNavigate } from 'react-router-dom';
import { message, Table, Modal, Form, Input, Select, Button, Pagination } from 'antd';

const { Option } = Select;

const Student = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [toView, setToView] = useState({});
  const [openView, setOpenView] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const [gradeFilter, setGradeFilter] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const fetchAllStudents = async () => {
    try {
      const response = await fetchStudents();
      setStudents(response.data);
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch students');
    }
  };

  const handleFormSubmit = async (values) => {
    if (selectedStudent) {
      await handleUpdateStudent(values);
    } else {
      await handleAddStudent(values);
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleAddStudent = async (values) => {
    try {
      const response = await addStudent(values);
      setStudents([...students, response.data]);
      message.success('Student added successfully');
    } catch (error) {
      console.error(error);
      message.error('Failed to add student');
    }
  };

  const handleSearch = useCallback((searchTerm = '') => {
    searchTerm = searchTerm.toLowerCase();
  
    const filtered = students.filter((student) => {
      const nameMatch = student.first_name.toLowerCase().includes(searchTerm);
      const gradeMatch = !gradeFilter || student.grade === gradeFilter;
      return nameMatch && gradeMatch;
    });
    
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [students, gradeFilter]);
  
  useEffect(() => {
    handleSearch();
  }, [students, handleSearch, gradeFilter]);

  const handleGradeFilterChange = (value) => {
    setGradeFilter(value);
  };

  const handleViewClick = async (id) => {
    try {
      const response = await getStudent(id);
      setToView(response.data);
      setOpenView(true);
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch student details');
    }
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    form.setFieldsValue(student);
    setIsModalVisible(true);
  };

  const handleUpdateStudent = async (values) => {
    try {
      await updateStudent(selectedStudent.id, values);
      fetchAllStudents();
      setSelectedStudent(null);
      message.success('Student updated successfully');
    } catch (error) {
      console.error(error);
      message.error('Failed to update student');
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await deleteStudent(id);
      fetchAllStudents();
      message.success('Student deleted successfully');
    } catch (error) {
      console.error(error);
      message.error('Failed to delete student');
    }
  };

  const handleLogOut = () => {
    localStorage.clear()
    navigate('/')
    message.success('Logout successful');
  }

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name',
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      key: 'last_name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button onClick={() => handleViewClick(record.id)}>View</Button>
          <Button onClick={() => handleEditClick(record)}>Edit</Button>
          <Button onClick={() => handleDeleteStudent(record.id)}>Delete</Button>
        </span>
      ),
    },
  ];

  return (
    <div className="app-container">
      <h1>Student Management System</h1>
      <Button onClick={handleLogOut}>Logout</Button>
      <Button onClick={() => setIsModalVisible(true)}>Add New Student</Button>

      <Input 
        placeholder="Search by name" 
        onChange={(e) => handleSearch(e.target.value)} 
        style={{ width: 200, marginRight: 16 }}
      />

      <Select
        style={{ width: 120 }}
        placeholder="Filter by grade"
        onChange={handleGradeFilterChange}
        allowClear
      >
        <Option value="A+">A+</Option>
        <Option value="A">A</Option>
        <Option value="B+">B+</Option>
        <Option value="B">B</Option>
        <Option value="C+">C+</Option>
        <Option value="C">C</Option>
        <Option value="P">P</Option>
        <Option value="F">F</Option>
      </Select>

      <Table
        dataSource={filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        columns={columns}
        rowKey="id"
        pagination={true}
      />

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={filteredData.length}
        onChange={(page, size) => {
          setCurrentPage(page);
          setPageSize(size);
        }}
        showSizeChanger
        showQuickJumper
        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
        pageSizeOptions={['3', '5', '15', '20']}
      />

      <Modal
        title={selectedStudent ? "Edit Student" : "Add New Student"}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedStudent(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleFormSubmit} layout="vertical">
          <Form.Item name="first_name" label="First Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="age" label="Age" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item name="grade" label="Grade" rules={[{ required: true }]}>
            <Select>
              <Option value="A+">A+</Option>
              <Option value="A">A</Option>
              <Option value="B+">B+</Option>
              <Option value="B">B</Option>
              <Option value="C+">C+</Option>
              <Option value="C">C</Option>
              <Option value="P">P</Option>
              <Option value="F">F</Option>
            </Select>
          </Form.Item>
          <Form.Item name="address" label="Address" rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="contact_number" label="Contact Number" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {selectedStudent ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Student Details"
        visible={openView}
        onCancel={() => setOpenView(false)}
        footer={[
          <Button key="close" onClick={() => setOpenView(false)}>
            Close
          </Button>
        ]}
      >
        <p><strong>Name:</strong> {toView.first_name} {toView.last_name}</p>
        <p><strong>Age:</strong> {toView.age}</p>
        <p><strong>Gender:</strong> {toView.gender}</p>
        <p><strong>Grade:</strong> {toView.grade}</p>
        <p><strong>Address:</strong> {toView.address}</p>
        <p><strong>Contact Number:</strong> {toView.contact_number}</p>
      </Modal>
    </div>
  );
};

export default Student;