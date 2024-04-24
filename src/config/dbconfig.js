
// IMPORTA O MONGOOESE PARA O PROJETO
const mongoose = require('mongoose');

// COLOCA DENTRO DA CONSTANCIA DECONFIG A URL DE CONEXÃO
const Dbconfig = 'mongodb+srv://<usuario>:<senha>@cluster1.4l1sdky.mongodb.net/Gallery';

// MONGOOSE CONECTAR NA VARIAVEL DBCONFIG
mongoose.connect(Dbconfig)
    .then(() => {
        console.log("Banco Conectado com Sucesso!");
    })
    .catch((error) => {
        console.log("Erro ao Conectar ao Banco:", error);
    });
