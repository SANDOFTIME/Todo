export class Util {
    static encode(str) {
        return btoa(unescape(encodeURIComponent(str)))
    }
    static decode(str) {
        return decodeURIComponent(escape(atob(str)))
    }
    static get2001() {
        return new Date('2001-1-1').getTime()-new Date().getTimezoneOffset()*60*1000
    }
    static to2001(date) {
        return (date.getTime()-this.get2001())/1000
    }
    static from2001(date) {
        return  new Date(this.get2001()+date*1000)
    }
}