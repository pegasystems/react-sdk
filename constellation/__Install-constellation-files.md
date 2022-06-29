# Install and configure Constellation Files

The **React SDK** provides Pega customers with a bridge from the Pega **Constellation JavaScript Engine** (part of the Pega Infinity&trade; product) to the React bridge and components in this repository.

However, the code is this repository does **not** include the necessary Constellation JS Engine code itself. That code is obtained via an npm dependency in this project's **package.json** file.

In your project's **package.json** dependencies, specify the package name **and**
the **tag** of the version of the ConstellationJS files that your project needs.

For example:
<br>

* **"@pega/constellationjs": "SDK-8.6.3"** <br>
will get the ConstellationJS files associated with Pega Infinity version
8.6.3

* **"@pega/constellationjs": "SDK-8.6.4"** <br>
will get the ConstellationJS files associated with Pega Infinity version
8.6.4
<br>

The webpack build process will move the necessary files from the dependency's **node_modules/@pega/constellationjs**
directory into the **dist/constellation** and **dist/constellaton/prequisite** directories.
