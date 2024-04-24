const User = require('../models/userModel');
const fs = require('fs/promises');
const path = require('path');

const updateBiografia = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        if (!req.body.biografia) {
            return res.status(400).json({ message: 'Biografia não fornecida' });
        }

        user.biografia = req.body.biografia;
        await user.save();

        res.status(200).json({ message: 'Biografia atualizada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateFotoPerfil = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        if (user.fotoPerfil && user.fotoPerfil !== '<Caminho para a foto base de Usuario>') {
            const fotoAntigaPath = user.fotoPerfil;
            await fs.unlink(fotoAntigaPath);
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Foto de perfil não fornecida' });
        }

        user.fotoPerfil = req.file.path;
        await user.save();

        res.status(200).json({ message: 'Foto de perfil atualizada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const addDefaultProfilePhoto = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            console.error('Usuário não encontrado');
            return;
        }

        if (user.fotoPerfil) {
            console.log('Usuário já possui uma foto de perfil');
            return;
        }

        const defaultPhotoPath = '<Caminho para a foto base de Usuario>'; 
        user.fotoPerfil = defaultPhotoPath;
        await user.save();

        console.log('Foto de perfil padrão adicionada para o usuário:', userId);
    } catch (error) {
        console.error('Erro ao adicionar foto de perfil padrão:', error);
    }
};

const removeFotoPerfil = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        if (!user.fotoPerfil || user.fotoPerfil === '<Caminho para a foto base de Usuario>') {
            return res.status(400).json({ message: 'Usuário não possui uma foto de perfil para remover' });
        }

        const fotoAntigaPath = user.fotoPerfil;
        await fs.unlink(fotoAntigaPath); 

        user.fotoPerfil = '<Caminho para a foto base de Usuario>';
        await user.save();

        res.status(200).json({ message: 'Foto de perfil removida com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { updateBiografia, updateFotoPerfil, addDefaultProfilePhoto, removeFotoPerfil };
