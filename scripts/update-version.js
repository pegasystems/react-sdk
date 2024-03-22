const fs = require('fs');
const readlineSync = require('readline-sync');

const version = readlineSync.question('Enter the new version: ');

const publicPath = readlineSync.question('Enter environment subpath: ');

const indexPath = 'dist/index.html';
let indexContent = fs.readFileSync(indexPath, 'utf-8');

indexContent = indexContent.replace('app.bundle.js"', `app.bundle.js?V=${version}"`);
indexContent = indexContent.replace('appStyles.css"', `appStyles.css?V=${version}"`);
indexContent = indexContent.replaceAll('WebpackEnvironmentSubPath', publicPath);


const bundlePath = 'dist/app.bundle.js';
let bundleContent = fs.readFileSync(bundlePath, 'utf-8');

bundleContent = bundleContent.replace('WebpackEnvironmentSubPath', publicPath);


fs.writeFileSync(indexPath, indexContent);
fs.writeFileSync(bundlePath, bundleContent);

console.log(`Version updated to ${version} in ${indexPath}`);
console.log(`PublicPath updated to ${publicPath} in ${indexPath} and ${bundlePath}`);
