import React, { useState, useEffect } from 'react';
import { useTheme } from '../../Context/Context';

function EditProfile() {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { userInfo } = useTheme();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('authorization');
      if (!token) {
        return;
      }

      setLoading(true);
      try {
        const response = await fetch('https://p56x7f-5200.csb.app/api/users/userinfo', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await response.json();

        if (response.ok) {
          setUsername(result.username);
          setBio(result.bio);
          setCurrentImage(result.image || 'default-avatar.png');
        } else {
          setError('Failed to fetch user info');
        }
      } catch (error) {
        setError('An error occurred while fetching user info');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };
  const token = localStorage.getItem('authorization');
  if (!token) {
    setError('Authentication required');
    return;
  }


  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append('username', username);
    formData.append('bio', bio);
    formData.append('id', userInfo.id);
    if (image) {
      formData.append('image', image);
    }
  
    setLoading(true);
    try {
      const response = await fetch('https://p56x7f-5200.csb.app/api/users/edit-profile', {
        method: 'PUT',
        // حذف 'Content-Type' از headers
        body: formData,
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log('Profile updated:', result);
      } else {
        setError(result.message || 'Failed to update profile');
      }
    } catch (error) {
      setError('An error occurred while updating the profile');
    } finally {
      setLoading(false);
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.profileCard}>
        <div style={styles.avatarContainer}>
          <img 
            src={currentImage || 'default-avatar.png'} 
            alt="Profile" 
            style={styles.avatar} 
          />
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            style={styles.changePhotoButton} 
          />
        </div>

        <form onSubmit={handleSubmit} style={styles.infoContainer}>
          <div>
            <label style={styles.label}>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.nameInput}
            />
          </div>
          <div>
            <label style={styles.label}>Bio:</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
              style={styles.bioInput}
            />
          </div>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <button type="submit" style={styles.saveButton}>Save Changes</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
  },
  profileCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    maxWidth: '400px',
    width: '100%',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: '20px',
  },
  avatar: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '10px',
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '5px 10px',
    borderRadius: '20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
  },
  infoContainer: {
    width: '100%',
    textAlign: 'center',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'block',
  },
  nameInput: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  bioInput: {
    width: '100%',
    padding: '10px',
    height: '80px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '14px',
    resize: 'none',
  },
  saveButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px',
  },
};

export default EditProfile;
