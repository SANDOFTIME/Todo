
export class AddView extends HTMLElement {
    constructor() {
        super();

        let tmpl = document.createElement('template')
        tmpl.innerHTML = `
            <style>
                .root {
                    display: flex;
                    padding-top: 5px;
                    padding-bottom: 5px;
                    font-size: 0;
                    background: transparent;
                }
                .textField {
                    border-style: none;
                    outline: none;
                    font-size: 16px;
                    font-weight: lighter;
                    background: transparent;
                    width: 100%;
                }
            </style>
            <div class="root">
                <draw-image img="../../Src/New.png"></draw-image>
                <input class="textField" type="text" placeholder="请输入...">
            </div>
        `
        let shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.appendChild(tmpl.content.cloneNode(true))


        let input = this.shadowRoot.querySelector('input')
        input.onkeydown = (event) => {
            if (event.key === "Enter") {
                let evt = new CustomEvent('text-input', {
                    detail: {
                        text: event.target.value
                    }
                })
                this.dispatchEvent(evt)
                this.Reset()
            }
        }

    }
    Reset() {
        this.shadowRoot.querySelector('input').value = ''
        document.activeElement.blur()
    }
}
window.customElements.define("add-view", AddView)