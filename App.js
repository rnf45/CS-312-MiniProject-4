import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home'; 
import BlogPost from './components/BlogPost'; 
import SignIn from './components/SignIn'; 
import SignUp from './components/SignUp'; 
import CreatePost from './components/CreatePost'; 

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blog" element={<BlogPost />} />
                <Route path="/signIn" element={<SignIn />} />
                <Route path="/signUp" element={<SignUp />} />
                <Route path="/create" element={<CreatePost />} />
            </Routes>
        </Router>
    );
}

export default App;
