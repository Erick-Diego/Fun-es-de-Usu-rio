const express = require('express');
const path = require('path');
const multer = require('multer');

const authRoutes = require('./routes/authRoutes');
const dbconfig = require('./config/dbconfig');

const app = express();

const PORT = process.env.PORT || 3000;

const upload = multer({ 

    storage: multer.diskStorage({

        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, 'upload', 'foto-user'));
        },

        filename: function (req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, file.fieldname + '-' + Date.now() + ext);
        }

    })
});

app.use('/auth', upload.single('fotoPerfil'), authRoutes);

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});