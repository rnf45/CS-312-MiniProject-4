import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BlogPost from './BlogPost';

const BlogList = ({ loggedInUser }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('/api/posts')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  return (
    <div>
      {posts.map(post => (
        <BlogPost key={post.blog_id} post={post} loggedInUser={loggedInUser} />
      ))}
    </div>
  );
};

export default BlogList;
