# Install and configure Constellation Files

The **React SDK** provides Pega customers with a bridge from the Pega **Constellation JavaScript Engine** (part of the Pega Infinity&trade; product) to the React bridge and components in this repository.

However, the code is this repository does **not** include the necessary Constellation JS Engine code itself. That code is provided to authorized and licensed Pega clients via the Pega Marketplace or a Pega representative.

The Constellation files that are obtained will include the following which need to be **copied into the constellation directory**:

* **bootstrap-shell.js** (minified, compressed version) 
* **<span style="display: inline">bootstrap-shell.js.br</span>** (Brotli compressed version) 
* **bootstrap-shell.js.gz** (GZip compressed version)

<br>

* **lib_asset.json** (indicates which constellation-core file to use; the hash in the specified constellation-core file must match the hash of the *constellation-core.*.* files)

<br>

* **constellation-core.xxxx.js** (compressed, minified version where xxxx is a hash)
* **<span style="display: inline">constellation-core.xxxx.js.br</span>** (Brotli compressed version) 
* **constellation-core.xxxx.js.gz** (Gzip compressed version) 
* **constellation-core.xxxx.LICENSE-txt** (reference to license for these files)

The webpack build process will move these files into the correct destination directory.
