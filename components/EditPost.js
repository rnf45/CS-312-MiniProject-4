import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditPost = () => {
  const { DogBlogId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    axios.get(`/api/edit/${DogBlogId}`)
      .then(response => {
        setTitle(response.data.title);
        setBody(response.data.body);
      })
      .catch(error => {
        setErrorMessage('Error loading post for editing');
      });
  }, [DogBlogId]);

  const handleEditPost = async () => {
    try {
      await axios.put(`/api/edit/${DogBlogId}`, { title, body });
      alert('Post updated successfully');
      navigate('/');
    } catch (error) {
      setErrorMessage(error.response.data.message || 'Error updating post');
    }
  };

  return (
    <div>
      <h2>Edit Post</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button onClick={handleEditPost}>Update</button>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default EditPost;

