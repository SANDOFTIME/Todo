import {Cloud} from "../Cloud/cloud.js";

export class MyDialog extends HTMLElement {
    constructor() {
        super();

        let tmpl = document.createElement('template')
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
                    /*width: 150px;*/
                    background: #fff;
                    border-radius: 5px;
                    box-shadow: 2px 2px 2px 2px lightgray;
                    /*height: 300px;*/
                }
            </style>
            <div id="context-root">
                <div id="context-menu">
                    
                </div>
            </div>
        `


        let shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.appendChild(tmpl.content.cloneNode(true))

        this.shadowRoot.getElementById('context-root').addEventListener('click', (event) => {
            if (event.target.id === 'context-root') {
                this.parentNode.removeChild(this)
            }
        })


    }
    Set(mouseX, mouseY) {
        let menu = this.shadowRoot.getElementById('context-menu')
        menu.style.left = `${mouseX}px`
        menu.style.top = `${mouseY}px`

        let signOut = document.querySelector('#apple-sign-out-button').cloneNode(true)
        signOut.addEventListener('click', (event) => {
            let cookies = document.cookie.split(';')

            for (const cookie of cookies) {
                document.cookie = `${cookie}=;expires=${new Date(0).toUTCString()}`
            }

            console.log(document.cookie)

            window.location.reload()
        })
        menu.appendChild(signOut)
    }
}
window.customElements.define('my-dialog', MyDialog)