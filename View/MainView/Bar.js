import {MyDialog} from "../Other/MyDialog.js";

export class Bar extends HTMLElement {
    constructor() {
        super();

        let tmpl = document.createElement('template')
        tmpl.innerHTML = `
        <style>
            #bar {
                height: 45px;
                width: 100%;
                background: #0078d3;
                float: top;
                display: flex;
                justify-content: flex-start;
                align-items: center;
            }
            #other_fun {
                width: 100%;
                height: 100%;
                line-height: 45px;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
            }
            .buttonBG {
                width: 45px;
                height: 45px;
                display: flex;
                justify-content: center;
                align-items: center;
                background: transparent;
            }
            .buttonBG:hover {
                background: rgba(255,255,255,0.2);
            }
            #name_lab {
                color: #ffffff;
                user-select: none;
            }
        </style>
        <div id="bar">
            <div class="buttonBG" id="app">
                <draw-image img="Src/app.png"></draw-image>
            </div>
            <div id="other_fun">
                <div id="name_lab">极简待办</div>
                <search-bar></search-bar>
                <div class="buttonBG">
                    <draw-image img="Src/setting.png"></draw-image>
                </div>
            </div>
            <div class="buttonBG" id="user">
                <draw-image img="Src/user.png"></draw-image>
            </div>
        </div>
        `

        let shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.appendChild(tmpl.content.cloneNode(true))

        shadowRoot.getElementById('user').addEventListener('click', (event) => {
            let dialog = new MyDialog()
            dialog.id = 'dialog'
            dialog.Set(window.innerWidth-220, 45)
            document.querySelector('body').appendChild(dialog)
        })
    }
}
window.customElements.define('my-bar', Bar)