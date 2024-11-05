import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreatePost = async () => {
    try {
      const response = await axios.post('/api/create', { title, body });
      alert('Post created successfully');
      window.location.href = '/';
    } catch (error) {
      setErrorMessage(error.response.data.message || 'Error creating post');
    }
  };

  return (
    <div>
      <h2>Create Post</h2>
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
      <button onClick={handleCreatePost}>Create</button>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default CreatePost;


