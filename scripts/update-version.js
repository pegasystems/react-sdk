const fs = require('fs');
const readlineSync = require('readline-sync');

const version = readlineSync.question('Enter the new version: ');

const indexPath = 'dist/index.html';
let indexContent = fs.readFileSync(indexPath, 'utf-8');

indexContent = indexContent.replace('app.bundle.js"', `app.bundle.js?V=${version}"`);
indexContent = indexContent.replace('appStyles.css"', `appStyles.css?V=${version}"`);

fs.writeFileSync(indexPath, indexContent);

console.log(`Version updated to ${version} in ${indexPath}`);
