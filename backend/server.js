const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = Number(process.env.PORT) || 3000;
const projectRoot = path.resolve(__dirname, '..');

app.use(cors());
app.use(express.json());
app.use(express.static(projectRoot));

app.get('/api/health', function (request, response) {
    response.json({ status: 'ok' });
});

app.listen(port, function () {
    console.log('DailyDrop server running at http://localhost:' + port);
});