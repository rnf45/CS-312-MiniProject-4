import express from "express";
import bodyParser from "body-parser";
import pkg from 'pg';
import cors from 'cors';

const app = express();
const port = 5000;
const { Client } = pkg;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'DogBlogDB',
    password: 'RRnnFF426426!', 
    port: 5432,
});

client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Connection error', err.stack));

let loggedInUser = null;

// middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
    if (loggedInUser) {
        return next();
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

// route to handle creating a new post
app.post('/api/create', ensureAuthenticated, async (req, res) => {
    const { title, body } = req.body;
    const dateCreated = new Date().toISOString();

    try {
        const insertPostQuery = `
            INSERT INTO blogs (title, body, creator_user_id, date_created) 
            VALUES ($1, $2, $3, $4) RETURNING *`;
        
        const result = await client.query(insertPostQuery, [title, body, loggedInUser.user_id, dateCreated]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error during post creation:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// route to handle deleting a post
app.delete('/api/delete/:DogBlogId', ensureAuthenticated, async (req, res) => {
    const { DogBlogId } = req.params;

    try {
        const query = 'DELETE FROM blogs WHERE blog_id = $1 AND creator_user_id = $2 RETURNING *';
        const result = await client.query(query, [DogBlogId, loggedInUser.user_id]);

        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Post deleted successfully' });
        } else {
            res.status(404).json({ message: 'Post not found or unauthorized' });
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// route to handle updating a post
app.put('/api/edit/:DogBlogId', ensureAuthenticated, async (req, res) => {
    const { DogBlogId } = req.params;
    const { title, body } = req.body;

    try {
        const query = 'UPDATE blogs SET title = $1, body = $2, date_created = NOW() WHERE blog_id = $3 AND creator_user_id = $4 RETURNING *';
        const result = await client.query(query, [title, body, DogBlogId, loggedInUser.user_id]);

        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Post not found or unauthorized' });
        }
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// define the /posts route to get all posts
app.get("/posts", async (req, res) => {
    try {
        const getPostsQuery = 'SELECT * FROM blogs ORDER BY date_created DESC';
        const result = await client.query(getPostsQuery);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Internal server error');
    }
});

// define the root route (optional)
app.get("/", (req, res) => {
    res.send("Welcome to the Dog Blog API!");
});

// route to handle user signup
app.post('/api/signup', async (req, res) => {
    const { username, password, name } = req.body;

    try {
        // check if username already exists in the database
        const userCheckQuery = 'SELECT * FROM users WHERE username = $1';
        const result = await client.query(userCheckQuery, [username]);

        // if user already exists
        if (result.rows.length > 0) {
            return res.status(400).json({ message: 'Username already taken. Please choose a different one.' });
        } else {
            // insert new user into the database
            const insertUserQuery = 'INSERT INTO users (username, password, name) VALUES ($1, $2, $3)';
            await client.query(insertUserQuery, [username, password, name]);
            return res.status(201).json({ message: 'User created successfully! You can now sign in.' });
        }
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// route to handle sign-in form submission
app.post('/api/signin', async (req, res) => {
    const { username, password } = req.body;

    try {
        // check if username and password match an existing user
        const userCheckQuery = 'SELECT * FROM users WHERE username = $1 AND password = $2';
        const result = await client.query(userCheckQuery, [username, password]);

        // if user match is found
        if (result.rows.length > 0) {
            loggedInUser = result.rows[0]; // store logged-in user
            return res.status(200).json({ message: 'Sign-in successful', user: { id: loggedInUser.user_id, name: loggedInUser.name } });
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during signin:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


// start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});




