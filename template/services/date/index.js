class DateService {
    static #DEFAULT_LANG = "fr";

    static #lang = DEFAULT_LANG;


    static setLang = (str = this.#lang) => this.#lang = str;
    static getLang = () => this.#lang;

    static #monthsLang = {
        "fr": ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
        "en": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    };
    static #daysLang = {
        "fr": ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
        "en": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    };


    static getDateInfo(timestamp) {
        const months = this.#monthsLang[this.getLang()] ?? monthsLang[this.#DEFAULT_LANG];
        const days = this.#daysLang[this.getLang()] ?? daysLang[this.#DEFAULT_LANG];
        const date = new Date(timestamp);
        const day = days[date.getDay() - 1];
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

    static strDate(timestamp, withDay = false, withTime = false) {
        const date = this.getDateInfo(timestamp);
        return `${withDay ? date.day + " " : ""}${date.dayNum} ${date.month} ${date.year}${withTime ? `, ${date.hours}h${date.minutes}` : ""}`;
    }

    static dateFromStamp(timestamp) {
        const date = this.getDateInfo(timestamp);
        return `${date.dayNum}/${date.monthNum}/${date.year}`;
    }


    static toTimeStamp({ h, s, m, ms, d }) {
        const d_to_ms = (d ?? 0) * 24 * 60 * 60 * 1000;
        const h_to_ms = (h ?? 0) * 60 * 60 * 1000;
        const m_to_ms = (m ?? 0) * 60 * 1000;
        const s_to_ms = (s ?? 0) * 1000;
        ms ??= 0;


        return d_to_ms + h_to_ms + m_to_ms + s_to_ms + ms;
    }

    static addToDate({ h, s, m, ms, d }, date = new Date()) {

        return new Date(date.getTime() + toTimeStamp({ h, s, m, ms, d }))
    }
}
module.exports = DateService;