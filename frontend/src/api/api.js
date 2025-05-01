const API_URL = 'http://localhost:8080/api/progress';

export const fetchAllProgress = async () => {
  try {
    const response = await fetch(`${API_URL}/getAll`);
    if (!response.ok) throw new Error('Failed to fetch progress data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching progress:', error);
    throw error;
  }
};

export const createProgress = async (progressData) => {
  try {
    const response = await fetch(`${API_URL}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(progressData),
    });
    if (!response.ok) throw new Error('Failed to create progress');
    return await response.json();
  } catch (error) {
    console.error('Error creating progress:', error);
    throw error;
  }
};

export const updateProgress = async (id, progressData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(progressData),
    });
    if (!response.ok) throw new Error(`Failed to update progress ${id}`);
    return await response.json();
  } catch (error) {
    console.error(`Error updating progress ${id}:`, error);
    throw error;
  }
};

export const deleteProgress = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error(`Failed to delete progress ${id}`);
    
    // Handle 201 status without expecting JSON
    if (response.status === 204) return { success: true };
    
    return await response.json();
  } catch (error) {
    console.error(`Error deleting progress ${id}:`, error);
    throw error;
  }
};