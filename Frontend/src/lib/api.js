const API_BASE_URL = 'http://localhost:5000'; 

// Function to handle login
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to login');
    }

    return data; // Return the user data on success
  } catch (error) {
    throw new Error(error.message || 'An error occurred during login');
  }
};



export const registerUser = async (name, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to register');
    }
    return data;
  } catch (error) {
    throw new Error(error.message || 'An error occurred during registration');
  }
};