const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Conectando ao MongoDB usando mongoose
mongoose.connect('mongodb://localhost:27017/lojadb', { useNewUrlParser: true, useUnifiedTopology: true });

// Definindo o Schema do cliente e da compra
const clienteSchema = new mongoose.Schema({
  nome: String,
  vip: Boolean,
  email: String,
  telefone: [String],
  endereco: {
    rua: String,
    numero: String,
    complemento: String,
    cidade: String,
    estado: String
  },
  compras: [{
    nomeProduto: String,
    preco: Number,
    quantidade: Number
  }]
});

// Criando modelos para Cliente e Compra
const Cliente = mongoose.model('Cliente', clienteSchema);

// Middleware para o body parser
app.use(express.json());

// Rota para adicionar clientes
app.post('/clientes', async (req, res) => {
  try {
    const cliente = new Cliente(req.body);
    await cliente.save();
    res.status(201).send(cliente);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Rota para buscar todos os clientes
app.get('/clientes', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.send(clientes);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Rota para buscar um cliente por nome
app.get('/clientes/:nome', async (req, res) => {
  try {
    const cliente = await Cliente.findOne({ nome: req.params.nome });
    if (!cliente) {
      return res.status(404).send();
    }
    res.send(cliente);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Rota para atualizar um cliente por nome
app.put('/clientes/:nome', async (req, res) => {
  try {
    const cliente = await Cliente.findOneAndUpdate({ nome: req.params.nome }, req.body, { new: true });
    if (!cliente) {
      return res.status(404).send();
    }
    res.send(cliente);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Rota para deletar um cliente por nome
app.delete('/clientes/:nome', async (req, res) => {
  try {
    const cliente = await Cliente.findOneAndDelete({ nome: req.params.nome });
    if (!cliente) {
      return res.status(404).send();
    }
    res.send(cliente);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
