const API_BASE_URL = 'http://localhost:5000'; // Base URL for the backend

// Function to handle login
export const loginUser = async (email, password, role) => {
  try {
    console.log('Sending login request to backend:', { email, password, role });

    // Dynamically construct the endpoint based on the role
    const endpoint = `${API_BASE_URL}/${role.toLowerCase()}/login`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }), // Sending email and password as part of a normal object
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to login');
    }

    // Store the role and token in localStorage
    localStorage.setItem('role', data.role);
    localStorage.setItem('token', data.token); // Ensure token is stored here

    return data;
  } catch (error) {
    throw new Error(error.message || 'An error occurred during login');
  }
};

// Function to handle registration based on role
export const registerUser = async (name, email, password, role, additionalData = {}) => {
  try {
    console.log('Sending registration request to backend:', { name, email, password, role, additionalData });

    // Construct the endpoint dynamically based on the role
    const endpoint =
      role.toLowerCase() === 'students'
        ? `${API_BASE_URL}/students/register`
        : role.toLowerCase() === 'placeofficers'
        ? `${API_BASE_URL}/placeofficers/register`
        : role.toLowerCase() === 'hods'
        ? `${API_BASE_URL}/hods/register`
        : `${API_BASE_URL}/register`;

    // Dynamically adjust the payload based on the role
    const payload = {
      name,
      email,
      password,
      ...(role.toLowerCase() === 'students' && {
        usn: additionalData.usn,
        department: additionalData.department,
        skills: additionalData.skills,
      }),
      ...(role.toLowerCase() === 'placeofficers' && {
        department: additionalData.department, // Only send department for Placement Officers
      }),
      ...(role.toLowerCase() === 'hods' && {
        department: additionalData.department, // Only send department for HOD
      }),
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to register');
    }

    return data; // Return the user data on success
  } catch (error) {
    throw new Error(error.message || 'An error occurred during registration');
  }
};