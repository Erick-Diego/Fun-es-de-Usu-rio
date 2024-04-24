const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { addDefaultProfilePhoto } = require('../controllers/userController'); // Importe a função addDefaultProfilePhoto

const register = async (req, res) => {
    try {
        // Verificar se o email já está cadastrado
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email já cadastrado' });
        }
        
        // Criptografar senha
        const hashedPassword = await bcrypt.hash(req.body.senha, 10);
        
        // Salvar usuário no banco de dados
        const user = await User.create({
            nome: req.body.nome,
            email: req.body.email,
            senha: hashedPassword,
            biografia: req.body.biografia
        });

        // Adicionar foto de perfil padrão
        await addDefaultProfilePhoto(user._id);

        res.status(201).json({ user });
        console.log("\n Usuario Cadastrado com Sucesso!");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        // Verificar se o email existe
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }
        
        // Verificar a senha
        const validPassword = await bcrypt.compare(req.body.senha, user.senha);
        if (!validPassword) {
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }
        
        // Gerar token de autenticação
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

// Lista de tokens revogados
let revokedTokens = [];

const logout = (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token de autenticação não fornecido' });
        }

        // Adiciona o token à lista de tokens revogados
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

    // Verifica se o token está na lista de tokens revogados
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
        // Obtém o ID do usuário autenticado a partir do token
        const userId = req.user.id;

        // Excluir todos os dados do usuário do banco de dados
        await User.findByIdAndDelete(userId);

        // Adiciona o token do usuário à lista de tokens revogados
        const token = req.headers['authorization']?.split(' ')[1];
        revokedTokens.push(token);

        res.status(200).json({ message: 'Conta excluída com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login, logout, authenticateToken, deleteAccount };
