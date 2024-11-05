// src/api/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const fetchPosts = async () => {
    return await axios.get(`${API_URL}/posts`);
};

export const createPost = async (post) => {
    return await axios.post(`${API_URL}/create`, post);
};

export const editPost = async (postId, updatedPost) => {
    return await axios.post(`${API_URL}/edit/${postId}`, updatedPost);
};

export const deletePost = async (postId) => {
    return await axios.post(`${API_URL}/delete-post/${postId}`);
};

export const signIn = async (credentials) => {
    return await axios.post(`${API_URL}/signin`, credentials);
};

export const signUp = async (user) => {
    return await axios.post(`${API_URL}/signup`, user);
};
