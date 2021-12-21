export class SearchBar extends HTMLElement {
    constructor() {
        super();

        let tmpl = document.createElement('template')
        tmpl.innerHTML = `
            <style>
                .root {
                    height: 35px;
                    width: 400px;
                    background: rgba(255,255,255,0.3);
                    display: flex;
                    align-items: center;
                    padding: 5px;
                    font-size: 0;
                    box-sizing: border-box;
                }
                #search {
                    width: 100%;
                    margin: 5px;
                    border-style: none;
                    outline: medium;
                    background: transparent;
                    border-color: transparent;
                    line-height: 0;
                    font-weight: normal;
                    font-size: 16px;
                    color: white;
                }
                ::placeholder {
                    color: white;
                    opacity: 1;
                }
            </style>
            <div class="root">
                <draw-image img="../Src/search.png"></draw-image>
                <input type="search" id="search" placeholder="请输入搜索内容">
            </div>
        `

        let shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.appendChild(tmpl.content.cloneNode(true))
    }
}
window.customElements.define('search-bar', SearchBar)