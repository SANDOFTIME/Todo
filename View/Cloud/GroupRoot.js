import {Util} from "../../Util/Util.js";

export let GRoot = {
    "name": "minimalist",
    "order": new Date().getTime()/1000,
    "btoa": function() {
        return Util.encode(JSON.stringify(this))
    }
}
export function NewRoot(name) {
    let obj = Object.create(GRoot)
    obj.name = name
    obj.order = new Date().getTime()/1000
    return obj
}