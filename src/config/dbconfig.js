const mongoose = require('mongoose');

const Dbconfig = 'mongodb+srv://<usuario>:<senha>@cluster1.4l1sdky.mongodb.net/Gallery';

mongoose.connect(Dbconfig)
    .then(() => {
        console.log("Banco Conectado com Sucesso!");
    })
    .catch((error) => {
        console.log("Erro ao Conectar ao Banco:", error);
    });
