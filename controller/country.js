const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const readCountriesFile = () => {
    const data = fs.readFileSync('countries.json', 'utf-8');
    return JSON.parse(data);
};

const writeCountriesFile = (data) => {
    fs.writeFileSync('countries.json', JSON.stringify(data, null, 2));
};

async function getCountries(req, res) {
    const countries = readCountriesFile();
    const countryList = countries.map(country => ({ id: country.id, name: country.name, continent: country.continent }));
    res.json(countryList);
}

async function postCountry (req, res) {
    try {
        const { name, rank, continent } = req.body;
        const file = req.file;

        if (!name || name.length < 3 || name.length > 20) {
            return res.status(400).json({ error: 'Name must be between 3 and 20 characters.' });
        }
        if (!rank || isNaN(rank)) {
            return res.status(400).json({ error: 'Rank must be a numeric value.' });
        }

        const countries = readCountriesFile();

        if (countries.find(c => c.name === name)) {
            return res.status(400).json({ error: 'Country Name must be unique.' });
        }
        if (countries.find(c => parseInt(c.rank) === parseInt(rank))) {
            return res.status(400).json({ error: 'Rank must be unique.' });
        }

        if (file) {
            const uniqueSuffix = Date.now() + '-' + uuidv4();
            const filename = uniqueSuffix + path.extname(file.originalname);
            const filepath = path.join('images', filename);
            
            fs.writeFile(filepath, file.buffer, (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Error saving file' });
                }
                const newCountry = {
                    id: uuidv4(),
                    name,
                    rank: parseInt(rank),
                    continent,
                    flag: filepath
                };

                countries.push(newCountry);
                writeCountriesFile(countries);

                res.json(newCountry);
            });
        } else {
            const newCountry = {
                id: uuidv4(),
                name,
                rank: parseInt(rank),
                continent,
                flag: null
            };

            countries.push(newCountry);
            writeCountriesFile(countries);

            res.json(newCountry);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function getCountryById (req, res) {
    const { id } = req.params;
    const countries = readCountriesFile();
    const country = countries.find(c => c.id.toString() === id.toString());
    if (country) {
        res.json(country);
    } else {
        res.status(404).send('Country not found');
    }
}

module.exports = { getCountries, postCountry, getCountryById }