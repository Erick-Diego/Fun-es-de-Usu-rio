const User = require('../models/userModel');
const fs = require('fs/promises'); // Módulo FileSystem para trabalhar com arquivos
const path = require('path');

const updateBiografia = async (req, res) => {
    try {
        // Obtém o ID do usuário autenticado a partir do token
        const userId = req.user.id;

        // Verifica se o usuário existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Verifica se a biografia foi enviada na requisição
        if (!req.body.biografia) {
            return res.status(400).json({ message: 'Biografia não fornecida' });
        }

        // Atualiza a biografia do usuário
        user.biografia = req.body.biografia;
        await user.save();

        res.status(200).json({ message: 'Biografia atualizada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateFotoPerfil = async (req, res) => {
    try {
        // Obtém o ID do usuário autenticado a partir do token
        const userId = req.user.id;

        // Verifica se o usuário existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Remove a foto antiga se existir
        if (user.fotoPerfil && user.fotoPerfil !== 'C:/Users/User/OneDrive/Área de Trabalho/MyGallery/backend/src/upload/foto-user/user_icon-icons.com_66546.png') {
            const fotoAntigaPath = user.fotoPerfil;
            await fs.unlink(fotoAntigaPath); // Remove a foto antiga
        }

        // Verifica se a foto foi enviada na requisição
        if (!req.file) {
            return res.status(400).json({ message: 'Foto de perfil não fornecida' });
        }

        // Atualiza a foto de perfil do usuário
        user.fotoPerfil = req.file.path; // Caminho da nova foto
        await user.save();

        res.status(200).json({ message: 'Foto de perfil atualizada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const addDefaultProfilePhoto = async (userId) => {
    try {
        // Verifica se o usuário existe
        const user = await User.findById(userId);
        if (!user) {
            console.error('Usuário não encontrado');
            return;
        }

        // Verifica se o usuário já possui uma foto de perfil
        if (user.fotoPerfil) {
            console.log('Usuário já possui uma foto de perfil');
            return;
        }

        // Adiciona uma foto de perfil padrão
        const defaultPhotoPath = 'C:/Users/User/OneDrive/Área de Trabalho/MyGallery/backend/src/upload/foto-user/user_icon-icons.com_66546.png'; // Coloque o caminho para a foto padrão aqui
        user.fotoPerfil = defaultPhotoPath;
        await user.save();

        console.log('Foto de perfil padrão adicionada para o usuário:', userId);
    } catch (error) {
        console.error('Erro ao adicionar foto de perfil padrão:', error);
    }
};

const removeFotoPerfil = async (req, res) => {
    try {
        // Obtém o ID do usuário autenticado a partir do token
        const userId = req.user.id;

        // Verifica se o usuário existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Verifica se o usuário já tem uma foto de perfil
        if (!user.fotoPerfil || user.fotoPerfil === 'C:/Users/User/OneDrive/Área de Trabalho/MyGallery/backend/src/upload/foto-user/user_icon-icons.com_66546.png') {
            return res.status(400).json({ message: 'Usuário não possui uma foto de perfil para remover' });
        }

        // Remove a foto antiga
        const fotoAntigaPath = user.fotoPerfil;
        await fs.unlink(fotoAntigaPath); // Remove a foto antiga

        // Atribui a foto base como foto de perfil
        user.fotoPerfil = 'C:/Users/User/OneDrive/Área de Trabalho/MyGallery/backend/src/upload/foto-user/user_icon-icons.com_66546.png'; // Caminho da foto base
        await user.save();

        res.status(200).json({ message: 'Foto de perfil removida com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = { updateBiografia, updateFotoPerfil, addDefaultProfilePhoto, removeFotoPerfil };
