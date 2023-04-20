const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "en",
    localePath: path.resolve("./public/locales"),
    locales: ["en", "fr"],
    reloadOnPrerender: true,
  },
};
