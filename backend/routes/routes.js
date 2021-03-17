const express = require('express'); 
const router = express.Router();
const pg = require('../db/db');

const users = require('../controllers/Ctr_user');

/*16/03/2021 - Santiago Álvarez Muñoz
El middleware permíte identificar si un correo ya está ingresado*/
router.get('/users/registro-correo/:correo', users.get_correo);

/*16/03/2021 - Santiago Álvarez Muñoz
El middleware envía un correo al usuario para crear y borrar la cuenta*/
router.post('/users/registro_delete', users.email)

/*16/03/2021 - Santiago Álvarez Muñoz
El middleware permíte registrar un usuario en la plataforma*/
router.post('/users/registro-insert', users.insert);

require('dotenv').config();
module.exports = router;