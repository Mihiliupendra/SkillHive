const handleSaveProfile = async (formData) => {
  try {
    // Convert formData to match the backend User model structure
    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      professionalHeader: formData.professionalHeader,
      biography: formData.biography,
      country: formData.country,
      city: formData.city,
      skills: formData.skills?.map(skill => skill.name) || []
    };

    const response = await axios.put(`/api/users/${userId}/profile`, userData);
    
    // Update the local state with the response data
    setProfileData(response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}; 