import {Util} from "../../Util/Util.js";
import {DrawImage} from "../Other/DrawImage.js";
import {ContentItemMenu} from "./ContentItemMenu.js";
import {MyCheckBox} from "./MyCheckBox.js";

let p_colors = ["#000", "#eedf30", "#f48D10", "#f00"]
export class ContentItem extends HTMLElement {
    constructor() {
        super();

        // this.style.height = '40px'
        this.style.paddingTop = '8px'
        this.style.paddingBottom = '8px'
        this.style.width = '100%'
        this.style.display = 'flex'
        this.style.justifyContent = 'flex-start'
        this.style.alignItems = 'center'

        let tmpl = document.createElement('template')
        tmpl.innerHTML = `
            <style>
                #item {
                    font-weight: normal;
                    font-size: 15px;
                    user-select: none;
                    pointer-events: none;
                    background: transparent;
                    margin-left: 5px;
                }
                #item_date {
                    font-weight: normal;
                    font-size: 10px;
                    user-select: none;
                    pointer-events: none;
                    background: transparent;
                    margin-left: 5px;
                    color: gray;
                }
                #item_root {
                    font-size: 0;
                }
            </style>
            <my-check-box id="checked" type="module"></my-check-box>
            <div id="item_root">
                <div id="item">这是列表</div>
                <div id="item_date">2020年11月30日</div>
            </div>
            <slot></slot>
            `

        let shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.appendChild(tmpl.content.cloneNode(true))
    }
    Set(record) {
        let item = this.shadowRoot.getElementById("item")
        item.innerHTML = record.fields.content.value

        let item_date = this.shadowRoot.getElementById("item_date")

        if (record.fields.x_remind) {
            let remind = JSON.parse(Util.decode(record.fields.x_remind.value))

            let now = new Date()
            if (remind.date) {
                item_date.style.display = 'inline'
                let d1 = Util.from2001(remind.date.date)
                if (now > d1) {
                    item_date.style.color = 'red'
                }
                item_date.innerHTML = d1.toLocaleDateString()+' '+d1.toLocaleTimeString()
            } else if (remind.position) {
                let region = remind.position.region
                item_date.innerHTML = (region.exit ? '离开' : '进入')+' '+region.identifier
                item_date.style.display = 'inline'
            } else {
                item_date.style.display = 'none'
            }
        } else {
            item_date.style.display = 'none'
        }

        let checked = this.shadowRoot.getElementById('checked')
        checked.addEventListener('click', (event) => {
            let evt = new CustomEvent('checked', null)
            this.dispatchEvent(evt)
        })

        let finished = record.fields.finshed.value === 1 || record.fields.finshed.value === '1'
        checked.boxChecked = finished
        if (finished) {
            checked.boxColor = "gray"
            item.style.color = 'gray'
            item_date.style.color = 'gray'
            item.style.textDecoration = 'line-through'
            item_date.style.textDecoration = 'line-through'
        } else {
            checked.boxColor = p_colors[record.fields.priority.value]
            item.style.color = 'black'
            item.style.textDecoration = 'none'
            item_date.style.textDecoration = 'none'
        }
        this.shadowRoot.addEventListener('click', (event)=> {
            console.log(record)
        })
    }
}
window.customElements.define('content-item', ContentItem)