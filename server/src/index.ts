import cors from 'cors';
import express from 'express';

const app = express();
const port = Number(process.env.PORT) || 3000;

// CORS configuration
const corsOptions = {
    origin: [
        'http://localhost:5173',    // Local Vite dev server
        'http://127.0.0.1:5173',   // Alternative local address
        'http://0.0.0.0:5173',     // Docker internal
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,             // Allow credentials
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
}); 