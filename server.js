const express = require('express');
const cors = require('cors');
const redis = require('redis');
const path = require('path');

const app = express();
const client = redis.createClient();

client.connect().then(() => {
    console.log('Conectado ao Redis com sucesso');
}).catch(err => {
    console.error('Erro ao conectar ao Redis:', err);
});

    app.use(cors({
        origin: '*', // ou especificar o domínio de onde você está acessando
        methods: 'GET,POST'
    }));
app.use(express.json());

// Middleware para log de todas as requisições recebidas
app.use((req, res, next) => {
    console.log(`Recebendo requisição: ${req.method} ${req.url}`);
    next();
});

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota para a página de validação de NIF
app.get('/nifvalidation', (req, res) => {
    console.log('Enviando arquivo de validação de NIF');
    res.sendFile(path.join(__dirname, 'public', 'nifvalidation.html'), (err) => {
        if (err) {
            console.error('Erro ao enviar arquivo de validação de NIF:', err);
            res.status(500).send('Erro ao carregar a página de validação de NIF');
        }
    });
});

// Rota para a página de histórico de NIFs
app.get('/historico', (req, res) => {
    console.log('Enviando arquivo de histórico de NIFs');
    res.sendFile(path.join(__dirname, 'public', 'historico.html'), (err) => {
        if (err) {
            console.error('Erro ao enviar arquivo de histórico de NIFs:', err);
            res.status(500).send('Erro ao carregar a página de histórico');
        }
    });
});

// Rota para validar e armazenar o NIF
// Rota para validar e armazenar o NIF
// Rota para validar e armazenar o NIF
app.post('/validar-nif', (req, res) => {
    const { nif, tipo } = req.body; // Recebe o tipo

    // Verifique se os dados estão chegando corretamente
    console.log('NIF recebido:', nif);
    console.log('Tipo recebido:', tipo); // Log do tipo

    // Armazenar no Redis
    client.lPush('nifsValidados', JSON.stringify({ nif, tipo, timestamp: new Date().toISOString() }), (err, reply) => {
        if (err) {
            console.error('Erro ao armazenar NIF no Redis:', err);
            return res.status(500).json({ message: 'Erro ao armazenar NIF no Redis', error: err });
        }
        res.status(200).json({ message: 'NIF validado e armazenado com sucesso.', reply });
    });
});



// Rota para retornar o histórico de NIFs
app.get('/historico-nifs', async (req, res) => {
    try {
        console.log('Rota /historico-nifs chamada');
        const nifs = await client.lRange('nifsValidados', 0, -1);
        console.log('NIFs retornados:', nifs);

        if (nifs.length === 0) {
            console.log('Nenhum NIF encontrado no histórico');
            return res.status(200).json([]);
        }

        res.status(200).json(nifs);
    } catch (err) {
        console.error('Erro ao carregar histórico do Redis:', err);
        res.status(500).json({ message: 'Erro ao carregar histórico do Redis', error: err });
    }
});





// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro inesperado:', err);
    res.status(500).json({ message: 'Erro inesperado no servidor', error: err.message });
});

// Iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
