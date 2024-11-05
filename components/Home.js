import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPosts, createPost as createPostApi, deletePost as deletePostApi } from '../api/api'; // Import deletePost

function Home() {
    const [posts, setPosts] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const response = await fetchPosts();
                setPosts(response.data);
            } catch (error) {
                console.error("Error fetching posts:", error.response ? error.response.data : error.message);
            }
        };

        loadPosts();
    }, []);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            await createPostApi({ title, body }); 
            const response = await fetchPosts(); 
            setPosts(response.data);
            setTitle('');
            setBody('');
        } catch (error) {
            console.error("Error creating post:", error.response ? error.response.data : error.message);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            await deletePostApi(postId); 
            setPosts(posts.filter(post => post.blog_id !== postId)); 
        } catch (error) {
            console.error("Error deleting post:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <div>
            <header>
                <h1>Welcome to Dog Blog!</h1>
                {loggedInUser ? (
                    <div>
                        <p>Welcome, {loggedInUser.name}!</p>
                        <Link to="/logout">Logout</Link>
                    </div>
                ) : (
                    <div>
                        <Link to="/signin">Sign In</Link>
                        <Link to="/signup">Sign Up</Link>
                    </div>
                )}
            </header>

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
                                <button onClick={() => handleDeletePost(post.blog_id)}>Delete</button>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>No posts available.</p>
            )}

            {loggedInUser && (
                <div>
                    <h2>Create a New Post</h2>
                    <form onSubmit={handleCreatePost}>
                        <label htmlFor="title">Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                        <label htmlFor="body">Content:</label>
                        <textarea
                            name="body"
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            required
                        ></textarea>
                        <button type="submit">Create Post</button>
                    </form>
                </div>
            )}
            {!loggedInUser && (
                <p>You must be signed in to create a post. <Link to="/signin">Sign In</Link> or <Link to="/signup">Sign Up</Link> now.</p>
            )}
        </div>
    );
}

export default Home;
