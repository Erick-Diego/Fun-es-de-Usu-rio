const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { addDefaultProfilePhoto } = require('../controllers/userController');

const register = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email já cadastrado' });
        }
        
        const hashedPassword = await bcrypt.hash(req.body.senha, 10);
        
        const user = await User.create({
            nome: req.body.nome,
            email: req.body.email,
            senha: hashedPassword,
            biografia: req.body.biografia
        });

        await addDefaultProfilePhoto(user._id);

        res.status(201).json({ user });
        console.log("\n Usuario Cadastrado com Sucesso!");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }
        
        const validPassword = await bcrypt.compare(req.body.senha, user.senha);
        if (!validPassword) {
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }
        
        const token = jwt.sign({ id: user._id }, 'my_secret_key');
        console.log("\n Usuario Logado com Sucesso!");
        
        res.status(200).json({ 
            token,
            nome: user.nome,
            id: user.id

        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

let revokedTokens = [];

const logout = (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token de autenticação não fornecido' });
        }

        revokedTokens.push(token);

        res.status(200).json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token == null) {
        return res.status(401).json({ message: 'Token de autenticação não fornecido' });
    }

    if (revokedTokens.includes(token)) {
        return res.status(403).json({ message: 'Token de autenticação inválido' });
    }

    jwt.verify(token, 'my_secret_key', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Falha na autenticação do token' });
        }
        req.user = user;
        next();
    });
};

const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        await User.findByIdAndDelete(userId);

        const token = req.headers['authorization']?.split(' ')[1];
        revokedTokens.push(token);

        res.status(200).json({ message: 'Conta excluída com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login, logout, authenticateToken, deleteAccount };
