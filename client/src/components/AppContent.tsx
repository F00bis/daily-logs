import { useEffect, useState } from 'react';
import { Button } from './ui/button';

export const AppContent = () => {
    const [serverMessage, setServerMessage] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        fetch('http://localhost:3000')
        .then(response => response.json())
        .then(data => setServerMessage(data.message))
        .catch(err => setError(err.message));
    }, []);

    return (
        <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Hello World</h1>
        {serverMessage && (
            <p className="text-green-600 mb-4">Server says: {serverMessage}</p>
        )}
        {error && (
            <p className="text-red-600 mb-4">Error: {error}</p>
        )}
        <Button>Click me</Button>
        </div>
    );
};