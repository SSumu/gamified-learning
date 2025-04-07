const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(error.message || "Something went wrong");
  }
  return response.json();
};

// Student-related API calls
export const fetchStudents = async () => {
  const response = await fetch(`${API_BASE_URL}/api/students`);
  return handleResponse(response);
};

export const fetchStudentById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/students/${id}`);
  return handleResponse(response);
};

export const createStudent = async (studentData) => {
  const response = await fetch(`${API_BASE_URL}/api/students`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(studentData),
  });
  return handleResponse(response);
};

export const updateStudent = async (id, studentData) => {
  const response = await fetch(`${API_BASE_URL}/api/students/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(studentData),
  });
  return handleResponse(response);
};

export const deleteStudent = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/students/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};

// Add other resource API functions below (courses, teachers, etc.)
// Example for courses:
/*
export const fetchCourses = async () => {
  const response = await fetch(`${API_BASE_URL}/api/courses`);
  return handleResponse(response);
};
*/

// Utility function for adding auth headers if needed
// const getAuthHeaders = () => {
//   const token = localStorage.getItem('authToken');
//   return token ? { 'Authorization': `Bearer ${token}` } : {};
// };
