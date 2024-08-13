const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const countryRoutes = require('./routes/country');

const app = express();
const PORT = 8080;

app.use(cors());

app.use('/images', express.static(path.join(__dirname, './images')));

app.use(bodyParser.json());

app.use('/', countryRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
