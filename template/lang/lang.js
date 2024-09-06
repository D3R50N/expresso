const DEFAULT_LANG = "fr";

var lang = DEFAULT_LANG;


const setLang = (str = lang) => lang = str;
const getLang = () => lang;

module.exports = {
    setLang,
    getLang,
    DEFAULT_LANG,
}