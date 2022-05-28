
const fs = require('fs');
const geos = "../geometry/"

fs.readdirSync(geos).forEach(file => {
    console.log(file);
});