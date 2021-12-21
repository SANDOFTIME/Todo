export class ListNameItem extends HTMLElement {
    constructor() {
        super();
        let tmpl = document.createElement('template')

        tmpl.innerHTML = `
            <style>
            #list_item_root {
                height: 35px;
                line-height: 25px;
                padding-left: 20px;
                background: #f4f4f4;
                display: flex;
                justify-content: flex-start;
                align-items: center;
            }
            #list_item_root:hover {
                background: #EDEDED;
            }
            #item {
                user-select: none;
                border-style: none;
                outline: none;
                font-size: 16px;
                font-weight: lighter;
                background: transparent;
            }
            </style>
            <div id="list_item_root">
                <input type="text" id="item">
            </div>
            <slot></slot>
        `


        let shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.appendChild(tmpl.content.cloneNode(true))

        let root = shadowRoot.getElementById('list_item_root')

        root.addEventListener("click", (event) => {
            console.log(this.shadowRoot.getElementById("item").innerHTML)
        }, true)

        let item = this.shadowRoot.getElementById('item')
        item.onkeydown = (event) => {
            if (event.key === 'Enter') {
                this.shadowRoot.getElementById('item').disabled = true
                let evt = new CustomEvent('name-input', {detail: event.target.value})
                this.dispatchEvent(evt)
            }
        }
        item.addEventListener('focusout', (event) => {
            item.disabled = true
        })
    }
    static get observedAttributes() {
        return ['content']
    }

    get content() {
        return this.getAttribute('item')
    }
    set content(val) {
        if (val) {
            this.setAttribute('item', val)
        } else {
            this.removeAttribute('item')
        }
        this.shadowRoot.getElementById("item").value = val
        this.shadowRoot.getElementById('item').disabled = true
    }
    Focus() {
        this.shadowRoot.getElementById('item').disabled = false
        this.shadowRoot.getElementById('item').focus()
    }
}
window.customElements.define("list-item", ListNameItem)