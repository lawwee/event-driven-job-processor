import express from 'express';
import cors from 'cors';

import { connectToDatabase } from './config/database';

import routes from './routes';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDatabase();

app.get('/', (req, res) => {
    res.send('Hello, World!');
});
app.use('/api', routes);
app.use((err: any, request: express.Request, response: express.Response, next: express.NextFunction) => {
    console.error(err);
    response.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        details: err || null
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});