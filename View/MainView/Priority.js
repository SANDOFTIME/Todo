export class PriorityView extends HTMLElement {
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
                background: #fff;
                border-radius: 5px;
                box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                width: 210px;
                height: 60px;
                display: flex;
                justify-content: space-between;
                /*flex-basis: 10px;*/
                /*gap: 5px;*/
                padding: 10px;
                box-sizing: border-box;
            }
            .p-context {
                width: 40px;
                height: 40px;
                background: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid transparent;
                border-radius: 5px;
                flex-direction: column;
            }
            .p-context:hover {
                border: 1px solid #000;
                border-radius: 5px;
            }
            .p-text {
                font-size: 8px;
                font-weight: lighter;
                color: #000;
                user-select: none;
                pointer-events: none;
            }
            priority-path {
                pointer-events: none;
            }
        </style>
        <div id="context-root">
            <div id="context-menu">
                <div class="p-context" id="0">
                <priority-path pColor="#000"></priority-path>
                <div class="p-text">普通</div>
                </div>
                <div class="p-context" id="1">
                <priority-path pColor="#eedf30"></priority-path>
                <div class="p-text">中等</div>
                </div>
                <div class="p-context" id="2">
                <priority-path pColor="#f48D10"></priority-path>
                <div class="p-text">重要</div>
                </div>
                <div class="p-context" id="3">
                <priority-path pColor="#f00"></priority-path>
                <div class="p-text">紧急</div>
                </div>
            </div>
        </div>
        `


        let shadowRoot = this.attachShadow({mode: 'open'})
        shadowRoot.appendChild(tmpl.content.cloneNode(true))

        this.shadowRoot.getElementById('context-root').addEventListener('click', (event) => {
            if (event.target.id === 'context-root') {
                this.parentNode.removeChild(this)
            } else if (event.target.className === 'p-context') {
                let evt = new CustomEvent('p-select', {detail: event.target.id})
                this.dispatchEvent(evt)
                this.parentNode.removeChild(this)
            }
        })
    }
    Show(mouseX, mouseY) {
        let menu = this.shadowRoot.getElementById('context-menu')
        menu.style.left = `${mouseX}px`
        menu.style.top = `${mouseY}px`
        document.querySelector('body').appendChild(this)
    }
}
window.customElements.define('priority-view', PriorityView)
export class ReminderInfo extends HTMLElement {
    constructor(props) {
        super(props);
        let tmpl = document.createElement('template')
        tmpl.innerHTML = `
        <style>
        #root {
            z-index: 1000;
            width: 100%;
            height: 100%;
            position: fixed;
        }
        #context-menu {
            position: absolute;
            width: 300px;
            height: 300px;
            background: #f0f0f0;
            border-radius: 5px;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
            padding: 10px;
        }
        .item {
            display: flex;
            align-items: center;
            height: 45px;
            background: #FFF;
            padding-left: 5px;
            flex-direction: row;
            justify-content: space-between;
        }
        .item_1 {
            display: flex;
        }
        .t_lab {
            user-select: none;
            font-size: 15px;
            font-weight: lighter;
        }
        .textField {
            border-style: none;
            outline: none;
            font-size: 16px;
            font-weight: lighter;
            background: transparent;
            width: 100%;
        }
        #button-item {
           height: 45px;
           display: flex;
           margin-top: 10px;
           flex-direction: row;
           justify-content: space-between;
           width: 100%; 
        }
        #cancel {
            background-color: lightgray;
            border: none;
            color: white;
            /*padding: 15px 32px;*/
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            height: 100%;
            width: 145px;
            position: relative;
        }

        #confirm {
            background-color: #4CAF50;
            border: none;
            color: white;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            height: 100%;
            width: 145px;
            position: relative;
        }
        #date {
            border-style: none;
            outline: none;
            /*font-size: 15px;*/
            font-weight: lighter;
            background: transparent;
            /*width: 100%;*/
        }
        .i_lab {
            margin-right: 10px;
            font-size: 15px;
            font-weight: lighter;
        }
        </style>
        <div id="root">
            <div id="context-menu">
                 <div class="item">
                    <input class="textField" id="textField" type="text" placeholder="请输入...">
                </div>
                <div class="item" id="l0" style="margin-top: 10px">
                     <div class="item_1">
                        <priority-path pColor="#000"></priority-path>
                        <div class="t_lab" style="margin-left: 5px">优先级</div>
                    </div>
                    <div class="i_lab" id="p_lab">普通</div>
                </div>
                <div class="item" style="margin-top: 10px">
                    <div class="item_1">
                        <draw-image img="../../Src/reminder.png"></draw-image>
                        <div class="t_lab" style="margin-left: 5px">日期</div>
                    </div>
                    <input type="datetime-local" id="date">
                </div>
                <div class="item">
                    <div class="item_1">
                        <draw-image img="../../Src/reminder.png"></draw-image>
                        <div class="t_lab" style="margin-left: 5px">提醒</div>
                    </div>
                    
                </div>
                <div class="item" >
                    <div class="item_1">
                        <draw-image img="../../Src/clock.png"></draw-image>
                        <div class="t_lab" style="margin-left: 5px">重复</div>
                    </div>
                </div>
                <div id="button-item">
                    <button id="cancel">取消</button>
                    <button id="confirm">确认</button>
                </div>
            </div>
        </div>
        `

        let shadowRoot = this.attachShadow({mode: "open"})
        shadowRoot.appendChild(tmpl.content.cloneNode(true))

        this.text = null
        this.priority = 0
        this.date = null

        this.shadowRoot.getElementById('root').addEventListener('click', (event) => {
            if (event.target.id === 'root') {
                this.parentNode.removeChild(this)
            }
        })
        this.shadowRoot.getElementById('textField').addEventListener('input', (event) => {
            this.text = event.target.value
        })
        let p_lab = this.shadowRoot.getElementById('p_lab')
        this.shadowRoot.getElementById('l0').addEventListener('click', (event) => {
            let pView = new PriorityView()
            pView.Show(window.innerWidth/2-95, event.clientY)
            pView.addEventListener('p-select', (event) => {
                this.priority = event.detail
                let p_colors = ["#000", "#eedf30", "#f48D10", "#f00"]
                p_lab.style.color = p_colors[event.detail]
                p_lab.innerText = ["普通", "中等", "重要", "紧急"][event.detail]
            })
        })
        this.shadowRoot.getElementById('date').addEventListener('input', (event) => {
            this.date = event.target.value
        })
        this.shadowRoot.getElementById('cancel').onclick = (event) => {
            this.parentNode.removeChild(this)
        }
        this.shadowRoot.getElementById('confirm').onclick = (event) => {
            let evt = new CustomEvent('c-value', {detail: {
                    text: this.text,
                    priority: this.priority,
                    date: this.date
                }})
            this.dispatchEvent(evt)
            this.parentNode.removeChild(this)
        }
    }
    Show(mouseX, mouseY) {
        let menu = this.shadowRoot.getElementById('context-menu')
        menu.style.left = `${window.innerWidth/2-150}px`
        menu.style.top = `150px`
        document.querySelector('body').appendChild(this)
    }
}
window.customElements.define('reminder-info', ReminderInfo)