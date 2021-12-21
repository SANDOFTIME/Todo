import {Util} from "../../Util/Util.js";

export let d_reminder = {
    "mut":false,
    "remind":true,
    "mode": {
        "system":4
    },
    "date":660560131
}
export let p_reminder = {
    "region": {
        "exit":true,
        "latitude":34.212574370683996,
        "longitude":108.8962380372478,
        "identifier":"奇点电竞酒店",
        "radius":200
    },
    "loop":false
}
export let Reminder = {
    "none": 0,
    "date": d_reminder,
    "position": p_reminder,
    "btoa": function() {
        return Util.encode(JSON.stringify(this))
    }
}
export function New_d_remind(date) {
    let obj = Object.create(Reminder)
    let d_obj = Object.create(d_reminder)
    d_obj.mut= false
    d_obj.remind = true
    d_obj.mode = {
        "system": 4
    }
    d_obj.date = Util.to2001(date)
    obj.date = d_obj
    return obj
}
export function New_p_remind() {

}
export function New_none() {
    let obj = Object.create(Reminder)
    obj.none = 0
    return obj
}