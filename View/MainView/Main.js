import {Util} from "../../Util/Util.js";
import {ContentItem} from "../ContentItem/ContentItem.js";
import {ListNameItem} from "../ListNameItem/ListNameItem.js";
import {ContentItemMenu} from "../ContentItem/ContentItemMenu.js";
import {AddView} from "./AddView.js";
import {Cloud} from "../Cloud/cloud.js";
import * as R from "../Cloud/Reminder.js";
import {ReminderInfo} from "./Priority.js";
import {ListActionMenu} from "../ListNameItem/ListActionMenu.js";
import {GRoot, NewRoot} from "../Cloud/GroupRoot.js";

export class MainPage extends HTMLElement {
    constructor() {
        super();



        let tmpl = document.createElement('template')
        tmpl.innerHTML = `
            <style>
                #left {
                    background: #f4f4f4;
                    float: left;
                    width: 300px;
                    padding-top: 20px;
                    box-sizing: border-box;
                    overflow: auto;
                    font-size: 0;
                    height: 100%;
                }
                #left_add_root {
                    padding-left: 15px;
                }
                #right {
                    background: #ffffff;
                    margin-left: 300px;
                    padding: 10px 20px 20px 20px;
                    box-sizing: border-box;
                }
                #content_view {
                    width: 100%;
                    overflow: auto;
                }
                #content_title {
                    height: 50px;
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                }
                #title_view {
                    float: left;
                    font-weight: normal;
                    font-size: 20px;
                    color: #0078d3;
                    user-select: none;
                }
            </style>
            <div id="left">
                <div id="left_content"></div>
                <div id="left_add_root">
                    <add-view id="left_add"></add-view>
                </div>
            </div>
            <div id="right">
                <div id="content_title">
                <div id="title_view">这是标题</div>
                <draw-image img="/Todo/Src/New.png" id="new-text" style="margin-left: 5px"></draw-image>
            </div>
            <div id="content_view">
            
            </div>
            </div>
        `

        let shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.appendChild(tmpl.content.cloneNode(true))

        this.val = []

        this.shadowRoot.getElementById('left_add').addEventListener('text-input', (event) => {
            const text = event.detail.text
            if (text != null && text !== '') {
                let cloud = new Cloud()
                cloud.SaveRecordZones(text, NewRoot(text).btoa()).then((obj) => {
                    this.val.push(obj)
                    this.DisplayValue(this.val)
                })
            }
        })

        this.shadowRoot.getElementById('new-text').addEventListener("click", (event) => {
            let box = new ReminderInfo()
            box.Show(event.clientX, event.clientY)
            box.addEventListener('c-value', (event) => {
                let t = event.detail.text
                let p = event.detail.priority
                let d = event.detail.date
                if (t != null && t.length !== 0) {
                    let parent = this.zoneValue.records.filter((r)=>{
                        return r.recordType === "Group_Version_2"
                    })[0]
                    let r = function () {
                        if (d == null || d === '') {
                            return R.New_none().btoa()
                        } else {
                            const date = new Date(d)
                            return R.New_d_remind(date).btoa()
                        }
                    }()
                    this.NewRecords(this.zoneValue.zone, parent, t, p, r)
                }

            })
        })
    }
    DisplayValue(val) {
        this.val = val
        let left = this.shadowRoot.getElementById('left_content')
        while (left.firstChild) {
            left.removeChild(left.firstChild)
        }


        val.forEach((value) => {
            let elem0 = new ListNameItem()
            let group = value.records.filter(record => {
                return record.recordType === "Group_Version_2"
            })[0]
            let obj = JSON.parse(Util.decode(group.fields.content.value))
            elem0.content = obj.name
            elem0.addEventListener("click", (event) => {
                this.DisplayContent(value)
            })
            elem0.addEventListener('name-input', (event) => {
                console.log(event.detail)
                if (event.detail !== '' && event.detail !== obj.name) {
                    let cloud = new Cloud()
                    let name = NewRoot(event.detail).btoa()
                    cloud.Rename(value.zone, group, name).then((result) => {
                        for (let i = 0; i < value.records.length; i++) {
                            if (value.records[i].recordName === result.recordName) {
                                value.records[i] = result
                                break
                            }
                        }
                    })
                }
            })
            elem0.addEventListener("contextmenu", (event) => {
                event.preventDefault()
                let menu = new ListActionMenu()
                menu.Set(event.clientX, event.clientY)
                menu.addEventListener('l-action', (event) => {
                    if (event.detail === 'delete') {
                        this.DeleteZone(value, val)
                    } else if (event.detail === 'edit') {
                        elem0.Focus()
                    } else if (event.detail === 'share') {
                        let cloud = new Cloud()
                        cloud.ShareWithUI(
                            group.recordName,
                            value.zone.zoneID.zoneName,
                            value.zone.zoneID.ownerRecordName,
                            obj.name,
                            'PRIVATE',
                            'READ_WRITE'
                        )
                    }
                })
            })
            left.appendChild(elem0)
        })
        this.DisplayContent(val[0])
    }
    DeleteZone(value, val) {
        const userIdentity = JSON.parse(window.localStorage.getItem('userIdentity'))


        if (userIdentity.userRecordName === value.zone.zoneID.ownerRecordName) {
            let cloud = new Cloud()

            cloud.DeleteRecordZone(value.zone.zoneID.zoneName).then((zone) => {
                console.log(zone)
                for (let i = 0; i < val.length; i++) {
                    if (val[i].zone.zoneID.zoneName === zone.zoneID.zoneName) {
                        val.splice(i, 1)
                    }
                }
                this.DisplayValue(val)
            })
        } else {
            const share = value.records.filter((record) => {
                return record.recordType === "cloudkit.share"
            })[0]
            console.log(share)
        }
    }
    DisplayContent(value) {
        let main_page = this.shadowRoot.getElementById("content_view")
        while (main_page.firstChild) {
            main_page.removeChild(main_page.firstChild)
        }

        this.zoneValue = value

        let group = value.records.filter(record => {
            return record.recordType === "Group_Version_2"
        })[0]

        let obj = JSON.parse(Util.decode(group.fields.content.value))
        this.shadowRoot.getElementById("title_view").innerText = obj.name
        let contents = value.records.filter( record => {
            return record.recordType === "Daily_Version_2"
        }).sort( (c0, c1 )=> {
            let p0 = c0.fields.priority.value
            let p1 = c1.fields.priority.value

            let f0 = c0.fields.finshed.value
            let f1 = c1.fields.finshed.value

            let m0 = c0.fields.true_order.value
            let m1 = c1.fields.true_order.value
            if (f0 !== f1) {
                return f0 > f1 ? -1 : 1
            } else if (p0 !== p1)  {
                return p0 > p1 ? 1 : -1
            } else if (m0 !== m1) {
                return m0 > m1 ? 1 : -1
            }
        })
        for (const record of contents.reverse()) {
            let elem1 = new ContentItem()
            // elem1.id = record.recordName
            main_page.appendChild(elem1)
            elem1.Set(record)
            elem1.addEventListener("contextmenu", (event) => {
                event.preventDefault()
                let dialog = new ContentItemMenu()
                dialog.Set(event.clientX, event.clientY)
                dialog.addEventListener('action', (event) => {
                    const a_id = event.detail
                    if ( a_id === "delete") {
                        this.DeleteRecord(value.zone, record)
                    } else if (a_id === "date") {
                        this.NotifyMe()
                    }
                })
            })
            elem1.addEventListener('checked', (event) => {
                record.fields.finshed.value = !record.fields.finshed.value
                this.ModifyRecord(this.zoneValue.zone, record)
                // elem1.Set(record)
            })
        }
    }
    NotifyMe() {
        console.log("notify me")
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification")
        } else if (Notification.permission === "granted") {
            // const notification = new Notification("Hi there!")
            alert("notification permission granted!")
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    console.log(permission)
                } else {
                    console.log("????")
                }
            })
        }
    }
    NewRecords(zone, parent, text, priority, reminder) {

        let cloud = new Cloud()
        const userIdentity = JSON.parse(window.localStorage.getItem('userIdentity'))
        const database = userIdentity.userRecordName === zone.zoneID.ownerRecordName ? cloud.privateDB : cloud.sharedDB

        let now = Date.now()

        let rid = `${now}`

        let fields = {
            "content": text,
            "finshed": 0,
            "modify": now,
            "priority": priority,
            "show_state": 1,
            "timestamp": rid,
            "true_order": now/1000,
            "x_remind": reminder
        }


        cloud.SaveRecords(
            database,
            rid,
            null,
            "Daily_Version_2",
            this.zoneValue.zone.zoneID.zoneName,
            null,
            null,
            null,
            this.zoneValue.zone.zoneID.ownerRecordName,
            null,
            parent.recordName,
            fields,
            null
            ).then((record) => {
                this.zoneValue.records.push(record)
            this.DisplayContent(this.zoneValue)
        })
    }
    ModifyRecord(zone, record) {

        let cloud = new Cloud()
        const userIdentity = JSON.parse(window.localStorage.getItem('userIdentity'))
        const database = userIdentity.userRecordName === zone.zoneID.ownerRecordName ? cloud.privateDB : cloud.sharedDB

        let now = Date.now()


        let fields = {
            "content": record.fields.content.value,
            "finshed": record.fields.finshed.value ? 1 : 0,
            "modify": now,
            "priority": record.fields.priority.value,
            "show_state": record.fields.show_state.value,
            "timestamp": record.fields.timestamp.value,
            "true_order": now/1000,
            "x_remind": record.fields.x_remind == null ? "eyJub25lIjowfQ==" : record.fields.x_remind.value
        }


        cloud.SaveRecords(
            database,
            record.recordName,
            record.recordChangeTag,
            record.recordType,
            this.zoneValue.zone.zoneID.zoneName,
            null,
            null,
            null,
            this.zoneValue.zone.zoneID.ownerRecordName,
            null,
            record.parent == null ? null : record.parent.recordName,
            fields,
            null
        ).then((record) => {
            for (let i = 0; i < this.zoneValue.records.length; i++) {
                let r0 = this.zoneValue.records[i]
                if (record.recordName === r0.recordName) {
                    this.zoneValue.records[i] = record
                    break
                }
            }

            this.DisplayContent(this.zoneValue)
        })
    }
    DeleteRecord(zone, record) {
        let cloud = new Cloud()

        const userIdentity = JSON.parse(window.localStorage.getItem('userIdentity'))
        const database = userIdentity.userRecordName === zone.zoneID.ownerRecordName ? cloud.privateDB : cloud.sharedDB

        cloud.DeleteRecord(database, record.recordName, zone.zoneID.zoneName, zone.zoneID.ownerRecordName)
            .then((record) => {
                this.zoneValue.records.recordRemove(record)
                this.DisplayContent(this.zoneValue)
            })
    }
}
window.customElements.define('main-page', MainPage)