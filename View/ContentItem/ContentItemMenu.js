import {MyCheckBox} from "./MyCheckBox.js";

export class ContentItemMenu extends HTMLElement {
    constructor() {
        super();

        let tmpl = document.createElement("template")
        tmpl.innerHTML = `
        <style>
        #context-root {
            z-index: 10000;
            width: 100%;
            height: 100%;
            position: fixed;
        }
        #context-menu {
            position: absolute;
            background: #fff;
            border-radius: 5px;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        }
        div.solid {
            line-height: 10%;
            width: 100%;
            height: 1px;
            background: lightgray;
        }
        div.item {
            font-size: 14px;
            padding: 0 20px 0 20px;
            font-weight: normal;
            user-select: none;
            color: #5a5a5a;
            line-height: 30px;
            background: transparent;
        }
        div.item:hover {
            background: #EDEDED;
        }
        </style>
        <div id="context-root">
            <div id="context-menu">
                <div class="item" id="date">日期</div>
                <div class="solid"></div>
                <div class="item" id="priority">优先级</div>
                <div class="solid"></div>
                <div class="item" id="move">移动到</div>
                <div class="solid"></div>
                <div class="item" id="delete">删除</div>
            </div>
        </div>
        `

        let shadow = this.attachShadow({mode: "open"})
        shadow.appendChild(tmpl.content.cloneNode(true))

        this.shadowRoot.getElementById('context-root').addEventListener('click', (event) => {
            if (event.target.id === 'context-root') {
                this.parentNode.removeChild(this)
            }
        })

        this.shadowRoot.querySelectorAll(".item").forEach((element, index) => {
            element.addEventListener("click", (event) => {
                this.parentNode.removeChild(this)
                let evt = new CustomEvent('action', {detail: event.target.id})
                this.dispatchEvent(evt)
            })
        })
    }
    Set(mouseX, mouseY) {
        let menu = this.shadowRoot.getElementById('context-menu')
        menu.style.left = `${mouseX}px`
        menu.style.top = `${mouseY}px`
        document.querySelector('body').appendChild(this)

    }
}
window.customElements.define("content-item-menu", ContentItemMenu)