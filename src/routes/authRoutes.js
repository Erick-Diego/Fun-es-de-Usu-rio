const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController'); // Importe o userController
const authMiddleware = require('../middleware/middleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authMiddleware.authenticateToken, authController.logout);

router.patch('/update-biografia', authMiddleware.authenticateToken, userController.updateBiografia);
router.patch('/update-foto-perfil', authMiddleware.authenticateToken, userController.updateFotoPerfil);

router.delete('/remove-foto-perfil', authMiddleware.authenticateToken, userController.removeFotoPerfil);
router.delete('/delete-account', authMiddleware.authenticateToken, authController.deleteAccount);


//para limpar do lado do cliente usar:

// Limpar token do localStorage
// localStorage.removeItem('token');

// Limpar token do sessionStorage
// sessionStorage.removeItem('token');

// Limpar token de um cookie (se você estiver usando cookies)
// document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

module.exports = router;
