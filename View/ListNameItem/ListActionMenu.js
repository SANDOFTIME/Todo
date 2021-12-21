export class ListActionMenu extends HTMLElement {
    constructor() {
        super();

        let tmpl = document.createElement('template')
        tmpl.innerHTML = `
            <style>
                #context-root {
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    position: fixed;
                }
                #context-menu {
                    width: 80px;
                    height: 105px;
                    position: absolute;
                    background-color: #fff;
                    border-radius: 5px;
                    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                }
                .item {
                    height: 35px;
                    width: 100%;
                    padding: 0 10px 0 10px;
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .item:hover {
                    background-color: #f4f4f4;
                }
                .item_lab {
                    font-size: 15px;
                    font-weight: lighter;
                    text-align: center;
                    background: transparent;
                    user-select: none;
                }
            </style>
            <div id="context-root">
                <div id="context-menu">
                    <div class="item">
                        <div class="item_lab" id="edit">重命名</div>
                    </div>
                    <div class="item">
                        <div class="item_lab" id="share">共享</div>
                    </div>
                    <div class="item">
                        <div class="item_lab" id="delete">删除</div>
                    </div>
                </div>
            </div>
        `

        let shadowRoot = this.attachShadow({mode: "open"})
        shadowRoot.appendChild(tmpl.content.cloneNode(true))

        this.shadowRoot.getElementById('context-root').addEventListener('click', (event) => {
            if (event.target.id === 'context-root') {
                this.parentNode.removeChild(this)
            }
        })
        this.shadowRoot.querySelectorAll('.item_lab').forEach((element, index) => {
            element.addEventListener('click', (event) => {
                this.parentNode.removeChild(this)
                let evt = new CustomEvent('l-action', {detail: event.target.id})
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
window.customElements.define('list-action-menu', ListActionMenu)