export class DrawImage extends HTMLElement {
    constructor() {
        super();

        let tmpl = document.createElement('template')
        tmpl.innerHTML = `
            <style>
                .image {
                    width: 20px;
                    height: 20px;
                    background-size: 20px 20px;
                }
            </style>
            <div class="image" id="item">
        `

        let shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.appendChild(tmpl.content.cloneNode(true))

        let item = this.shadowRoot.getElementById('item')

        let imgUrl
        if (this.hasAttribute('img')) {
            imgUrl = this.getAttribute('img')
        } else {
            imgUrl = '/Src/more.png'
        }
        item.style.backgroundImage = 'url('+imgUrl+')'
    }

    static get observedAttributes() {
        return ['img']
    }

    get img() {
        this.getAttribute('img')
    }
    set img(val) {
        let item = this.shadowRoot.getElementById('item')
        if (val) {
            this.setAttribute('img', val)
        } else {
            this.removeAttribute('img')
        }
        item.style.backgroundImage = 'url('+val+')'
    }
}
window.customElements.define('draw-image', DrawImage)