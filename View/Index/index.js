import {DrawImage} from "../Other/DrawImage.js";
import {Bar} from "../MainView/Bar.js";
import {MainPage} from "../MainView/Main.js";
import {SearchBar} from "../Other/SearchBar.js";
import {ContentItem} from "../ContentItem/ContentItem.js";
import {AddView} from "../MainView/AddView.js";
import {Cloud} from "../Cloud/cloud.js";

Array.prototype.recordRemove = function (element) {
    for (let i = 0; i < this.length; i++) {
        if (this[i].recordName === element.recordName) {
            this.splice(i, 1)
        }
    }
}
document.getElementById("root").style.filter = 'blur(1.5rem)'
let cloud = new Cloud()
cloud.SetUpAuth().Download()
cloud.DownloadHistory()
window.addEventListener('load', () => {
    console.log('load')
})
window.addEventListener('cloudkitloaded', () => {
    console.log('cloudKit loaded')
})
window.addEventListener("resize", () => {
    console.log("112")
})
window.onload = () => {
    console.log('window onload')
}