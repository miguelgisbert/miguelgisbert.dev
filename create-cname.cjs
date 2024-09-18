const fs = require('fs');
const path = require('path');

const domain = 'miguelgisbert.dev';

const filePath = path.join(__dirname, 'dist', 'CNAME');

fs.writeFileSync(filePath, domain);
console.log(`CNAME file created with domain: ${domain}`);
