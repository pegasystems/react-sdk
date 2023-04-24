module.exports = {
  ...require("@pega/prettier-config"),
  "overrides": [
    {
      excludeFiles: [ "package.json", "sdk-config.json" ]
    }
  ]
}
