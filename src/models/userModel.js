const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    senha: {
        type: String,
        required: true
    },
    fotoPerfil: {
        type: String 
    },
    biografia: {
        type: String
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
