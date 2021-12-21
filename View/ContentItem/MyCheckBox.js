export class MyCheckBox extends HTMLElement {
    constructor() {
        super();

        let tmpl = document.createElement("template")
        tmpl.innerHTML = `
            <style>
            svg {
                display: block;
            }
            </style>
            <svg id="svg" class="icon" viewBox="0 0 1024 1024" width="15" height="15">
            <path id="path" d='${this.PathUncheck}'>
            
            </path>
            </svg>
        `

        let shadow = this.attachShadow({mode: "open"})
        shadow.appendChild(tmpl.content.cloneNode(true))


    }
    PathUncheck = 'M938.666667 1024 85.333333 1024c-46.933333 0-85.333333-38.4-85.333333-85.333333L0 85.333333c0-46.933333 38.4-85.333333 85.333333-85.333333l853.333333 0c46.933333 0 85.333333 38.4 85.333333 85.333333l0 853.333333C1024 985.6 985.6 1024 938.666667 1024zM938.666667 106.666667c0-12.8-8.533333-21.333333-21.333333-21.333333L106.666667 85.333333C93.866667 85.333333 85.333333 93.866667 85.333333 106.666667l0 810.666667c0 12.8 8.533333 21.333333 21.333333 21.333333l810.666667 0c12.8 0 21.333333-8.533333 21.333333-21.333333L938.666667 106.666667z'
    PathChecked = 'M938.666667 1024 85.333333 1024c-46.933333 0-85.333333-38.4-85.333333-85.333333L0 85.333333c0-46.933333 38.4-85.333333 85.333333-85.333333l853.333333 0c46.933333 0 85.333333 38.4 85.333333 85.333333l0 853.333333C1024 985.6 985.6 1024 938.666667 1024zM938.666667 106.666667c0-12.8-8.533333-21.333333-21.333333-21.333333L106.666667 85.333333C93.866667 85.333333 85.333333 93.866667 85.333333 106.666667l0 810.666667c0 12.8 8.533333 21.333333 21.333333 21.333333l810.666667 0c12.8 0 21.333333-8.533333 21.333333-21.333333L938.666667 106.666667zM456.533333 712.533333C450.133333 721.066667 439.466667 725.333333 426.666667 725.333333s-23.466667-4.266667-29.866667-12.8l-170.666667-170.666667C217.6 535.466667 213.333333 524.8 213.333333 512c0-23.466667 19.2-42.666667 42.666667-42.666667 12.8 0 23.466667 4.266667 29.866667 12.8l140.8 140.8 311.466667-311.466667c8.533333-8.533333 19.2-12.8 29.866667-12.8 23.466667 0 42.666667 19.2 42.666667 42.666667 0 12.8-4.266667 23.466667-12.8 29.866667L456.533333 712.533333z'


    static get observedAttributes() {
        return ['boxChecked', 'boxColor']
    }
    get boxChecked() {
        this.getAttribute("boxChecked")
    }
    set boxChecked(val) {
        if (val) {
            this.shadowRoot.getElementById('path').setAttribute('d', this.PathChecked)
        } else {
            this.shadowRoot.getElementById('path').setAttribute('d', this.PathUncheck)
        }
        this.setAttribute('boxChecked', val)
    }

    get boxColor() {
        this.getAttribute("boxColor")
    }
    set boxColor(val) {
        let svgElement = this.shadowRoot.getElementById('svg')
        svgElement.style.fill = val
        this.setAttribute('boxColor', val)
    }
}
window.customElements.define("my-check-box", MyCheckBox)
export class PriorityPath extends HTMLElement {
    constructor() {
        super();

        let tmpl = document.createElement('template')
        tmpl.innerHTML = `
             <style>
            svg {
                display: block;
            }
            </style>
            <svg id="svg" viewBox="0 0 1024 1024" width="20" height="20">
            <path id="p0" d='${this.P0}' fill="#666666"></path>
            <path id="p1" d='${this.p1}' fill="#666666"></path>
            </svg>
        `

        let shadow = this.attachShadow({mode: "open"})
        shadow.appendChild(tmpl.content.cloneNode(true))

        let pColor = this.getAttribute('pColor')
        if (pColor) {
            this.SetColor(pColor)
        }
    }
    P0 = 'M294.5 877.4c-18.4 0-33.3-14.9-33.3-33.3V191.7c0-18.4 14.9-33.3 33.3-33.3s33.3 14.9 33.3 33.3v652.4c-0.1 18.4-15 33.3-33.3 33.3z'
    p1 = "M361.8 885.7H224.2c-18.4 0-33.3-14.9-33.3-33.3s14.9-33.3 33.3-33.3h137.6c18.4 0 33.3 14.9 33.3 33.3s-14.9 33.3-33.3 33.3zM465.3 193.9c48.1 0 93.7 18.7 137.7 36.7 37.8 15.5 73.4 30.1 110.6 32.9 7 0.5 14.2 0.8 21.5 0.8 27.5 0 55.5-3.5 79.6-6.9v274.1c-13.2 12.6-44.2 33.8-75.9 33.8-2.1 0-4.1-0.1-6.2-0.3-19.5-1.9-45.6-11.5-75.8-22.7-52.7-19.5-118.4-43.8-201.7-47.3-5.5-0.2-11.2-0.3-16.9-0.3-41.7 0-81.9 5.9-110.5 11.5V246.1c11.8-17.5 70.5-52.2 137.6-52.2m0-66.6c-102.2 0-204.1 61.3-204.1 113.6v356.7c0-9.2 95.6-36.6 177.1-36.5 4.7 0 9.5 0.1 14.1 0.3 122.8 5.2 204.9 63.1 273.9 69.8 4.2 0.4 8.4 0.6 12.6 0.6 75.2 0 142.4-63.1 142.4-83.2V191.8c0-5.5-6.1-7.4-16.4-7.4-26.7 0-81.4 13.3-129.8 13.3-5.6 0-11.2-0.2-16.6-0.6-64.1-4.8-148.6-69.8-253.2-69.8z"

    static get observedAttributes() {
        return ['pColor']
    }
    get pColor() {
        this.getAttribute("pColor")
    }
    set pColor(val) {
        this.SetColor(val)
        this.setAttribute('pColor', val)
    }
    SetColor(val) {
        this.shadowRoot.getElementById('p0').setAttribute('fill', val)
        this.shadowRoot.getElementById('p1').setAttribute('fill', val)
    }
}
window.customElements.define('priority-path', PriorityPath)