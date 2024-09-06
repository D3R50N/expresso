const { getLang, DEFAULT_LANG } = require("../lang/lang");

const monthsLang = {
    "fr": ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
    "en": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
};
const daysLang = {
    "fr": ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
    "en": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
};


function getDateInfo(timestamp) {
    const months = monthsLang[getLang()] ?? monthsLang[DEFAULT_LANG];
    const days = daysLang[getLang()]??daysLang[DEFAULT_LANG];
    const date = new Date(timestamp);
    const day = days[date.getDay()];
    const month = months[date.getMonth()];
    const dayNum = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return {
        day: day,
        month,
        year,
        dayNum: dayNum.toString().padStart(2, "0"),
        monthNum: (date.getMonth() + 1).toString().padStart(2, "0"),
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0")
    };
}

function strDate(timestamp, withDay = false, withTime = false) {
    const date = getDateInfo(timestamp);
    // m${date.seconds}
    return `${withDay ? date.day + " " : ""}${date.dayNum} ${date.month} ${date.year}${withTime ? `, ${date.hours}h${date.minutes}` : ""}`;
}

function dateFromStamp(timestamp) {
    const date = getDateInfo(timestamp);
    return `${date.dayNum}/${date.monthNum}/${date.year}`;
}

module.exports = { getDateInfo, strDate, dateFromStamp };