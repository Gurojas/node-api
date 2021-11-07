const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();
const compression = require('compression')

const app = express();

app.use(helmet());
app.use(compression());
app.use(cors());

const serverHttp = http.createServer(app);

serverHttp.listen(process.env.HTTP_PORT, process.env.IP, () => {
    console.log(`Escuchando puerto ${process.env.HTTP_PORT}`);
});

const serverHttpsOptions = {
    key: fs.readFileSync(process.env.KEY_PATH),
    cert: fs.readFileSync(process.env.CERT_PATH)
};

const serverHttps = https.createServer(serverHttpsOptions, app);
serverHttps.listen(process.env.HTTPS_PORT, process.env.IP, () => {
    console.log(`Escuchando puerto ${process.env.HTTPS_PORT}`);
});

// Este middleware se encarga de redireccionar a HTTPS al usuario en caso que ingrese como HTTP
app.use((req, res, next) => {
    if (req.secure){
        next();
    }
    else {
        res.redirect(`https://${req.headers.host}${req.url}`);
    }
});

app.get('/getDate', (req, res) => {
    var tzoffset = (((new Date()).getTimezoneOffset()) * 60000); //offset in milliseconds
    console.log(tzoffset);
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString();
    res.send({ "datetime": localISOTime });
});
