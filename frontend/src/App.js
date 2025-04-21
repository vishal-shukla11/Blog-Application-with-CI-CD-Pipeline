import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

  // Get the backend URL based on the environment
  const getBackendUrl = () => {
    // When running in Docker, use the service name
    if (window.location.hostname !== 'localhost') {
      return 'http://backend:5001';
    }
    // When running locally, use localhost
    return 'http://localhost:5001';
  };

  const API_URL = getBackendUrl();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/posts`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      console.log('Received data:', data); // Debug log
      // Check if data is an array, if not, try to get the posts array from the response
      const postsArray = Array.isArray(data) ? data : data.posts || [];
      console.log('Processed posts array:', postsArray); // Debug log
      setPosts(postsArray);
    } catch (err) {
      console.error('Error fetching posts:', err); // Debug log
      setError(err.message);
      setPosts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      });
      
      if (!response.ok) throw new Error('Failed to create post');
      
      const newPost = await response.json();
      setPosts([...posts, newPost.post]);
      setTitle("");
      setContent("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete post');
      
      setPosts(posts.filter(post => post.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (id) => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      });
      
      if (!response.ok) throw new Error('Failed to update post');
      
      const updatedPost = await response.json();
      setPosts(posts.map(post => 
        post.id === id ? updatedPost.post : post
      ));
      setEditingPost(null);
      setTitle("");
      setContent("");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <h1>Blog Posts</h1>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={editingPost ? (e) => { e.preventDefault(); handleUpdate(editingPost.id); } : handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          required
        />
        <button type="submit">
          {editingPost ? 'Update Post' : 'Add Post'}
        </button>
      </form>

      <div className="posts">
        {posts.map(post => (
          <div key={post.id} className="post">
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <div className="post-meta">
              <span>Created: {new Date(post.created_at).toLocaleString()}</span>
              {post.updated_at && (
                <span>Updated: {new Date(post.updated_at).toLocaleString()}</span>
              )}
            </div>
            <div className="post-actions">
              <button onClick={() => {
                setEditingPost(post);
                setTitle(post.title);
                setContent(post.content);
              }}>Edit</button>
              <button onClick={() => handleDelete(post.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
