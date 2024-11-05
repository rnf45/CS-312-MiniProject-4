import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function BlogPost({ loggedInUser, onDeletePost }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await axios.get(`${process.env.API_URL}/posts`);
        setPosts(result.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    

    fetchPosts();
  }, []);

  return (
    <div>
      <h2>Blog Posts</h2>
      {posts.length > 0 ? (
        posts.map(post => (
          <div key={post.blog_id} className="post">
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <p>Posted by: {post.creator_name} at {new Date(post.date_created).toLocaleString()}</p>
            {loggedInUser && post.creator_user_id === loggedInUser.user_id && (
              <div>
                <Link to={`/edit/${post.blog_id}`}>Edit</Link>
                <button onClick={() => onDeletePost(post.blog_id)}>Delete</button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
}

export default BlogPost;
