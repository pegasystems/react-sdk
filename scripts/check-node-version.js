// do a check of node version, it should be 18 or greater
const arNodeVersion  = process.versions.node.split(".");

const nodeMajorVersion = parseInt(arNodeVersion[0]);
const nodeMinorVersion = parseInt(arNodeVersion[1]);

if (nodeMajorVersion < 18) {
  console.error(`React SDK requires node v18 or greater, current version: ${process.version}`);
  process.exit(1);
}
