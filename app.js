const express = require('express');
const http = require('http');
const helmet = require('helmet');
require('dotenv').config();
const compression = require('compression')

const app = express();

app.use(helmet());
app.use(compression());

const serverHttp = http.createServer(app);

serverHttp.listen(process.env.HTTP_PORT, process.env.IP, () => {
    console.log(`Escuchando puerto ${process.env.HTTP_PORT}`);
});

app.get('/getDate', (req, res) => {
    var tzoffset = (((new Date()).getTimezoneOffset()) * 60000); //offset in milliseconds
    console.log(tzoffset);
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString();
    res.send({ "datetime": localISOTime });
});