const fs = require('fs');
const readlineSync = require('readline-sync');

const version = readlineSync.question('Enter the new version: ');

const indexPath = 'dist/index.html';
let content = fs.readFileSync(indexPath, 'utf-8');

content = content.replace('app.bundle.js"', `app.bundle.js?V=${version}"`);
content = content.replace('appStyles.css"', `appStyles.css?V=${version}"`);

fs.writeFileSync(indexPath, content);

console.log(`Version updated to ${version} in ${indexPath}`);
