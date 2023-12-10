const express = require('express');
const cors = require('cors');

var app = express();
app.use(cors())
app.use(express.static('dist/gdms'));
app.get('/', function (req, res,next) {
    res.redirect('/');
});

app.listen(8080)
