const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes/routes');
require('dotenv').config();

/*Configuración del servidor*/
app.set('port', process.env.PORT || 3500);
app.use(express.json());
app.use(cors({origin: '*'}));
app.use('/', routes);
app.listen(app.get('port'), () =>{
    console.log(`Server on port ${app.get('port')}`);
})