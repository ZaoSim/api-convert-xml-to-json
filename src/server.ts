import express from 'express';
import path from 'path';
import convertToJsonRoutes from './routes/converttojson';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://seu-dominio-railway.up.railway.app'],
  credentials: true
}))

app.use(express.json());
app.use(express.text());

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/convert', convertToJsonRoutes);

// main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'templates', 'index.html'));
});

app.listen(PORT, () => {
    console.log('Servidor rodando na porta 3000');
});
