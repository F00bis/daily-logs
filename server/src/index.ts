import cors from 'cors';
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:5173', // Default Vite dev server port
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 