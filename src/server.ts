import express from 'express';
import path from 'path';
import convertToJsonRoutes from './routes/converttojson';

// __dirname is already available in CommonJS

const app = express();
const PORT = 3000;

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
