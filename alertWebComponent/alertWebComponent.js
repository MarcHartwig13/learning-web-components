const iconCheck = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59z"/></svg>`;
const iconInfo = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11 9h2V7h-2zm0 8h2v-6h-2z"/></svg>`;
const iconExclamation = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11 4h2v11h-2zm2 14v2h-2v-2z"/></svg>`;
const iconClose = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg>`;

const iconLookup = {
    'success': iconCheck,
    'info': iconInfo,
    'warning': iconExclamation,
    'error': iconClose,
}

customElements.define("alert-web-component",
    class AlertWebComponent extends HTMLElement {
        static shadow;

        static get observedAttributes() {
            return ['text', 'title', 'icon', 'type'];
        }

        constructor() {
            super();

            this.shadow = this.attachShadow({mode:'open'});
            this.title = this.attributes.getNamedItem('title').value;
            this.text = this.attributes.getNamedItem('text').value;
            this.type = this.attributes.getNamedItem('type').value;

            this.shadow.innerHTML = `
            <style>
                :host {
                    --color-green: #008939;
                    --color-blue: #0073ea;
                    --color-red: #dc353d;
                    --color-orange: #f0b31e;
                    --color-white: #ffffff;
                    --color-black: #000000;
                    
                    font-family: Noto Sans, sans-serif;
                }
                
                #alert {
                    border-radius: 5px;
                    display: grid;
                    align-items: center;
                    max-width:1000px;
                    padding: 1rem;
                    grid-template-areas:
                    "prepend content append close" 
                    ".       content .      .    ";
                    grid-template-columns: max-content auto max-content max-content;
                    margin-bottom: 30px;
                }
                
                #icon {
                    align-items: center;
                    grid-area: prepend;
                    padding: 3px;
                    display:flex;
                    justify-content: center;
                    border-radius: 25px;
                    height: 20px;
                    width: 20px;
                    margin-right: 15px;
                }
                
                #alert-content p {
                    margin-bottom: 0;
                    margin-top: 0;
                }
                
                #title {
                    font-size: 1.25rem;
                    font-weight: 500;
                }
                
                .alert-success { background: var(--color-green); color: var(--color-white); }
                .alert-success #icon { background: var(--color-white); color:  var(--color-green); }
                
                .alert-info { background: var(--color-blue); color: var(--color-white);}
                .alert-info #icon { background: var(--color-white); color: var(--color-blue);}
                
                .alert-warning { background: var(--color-orange); color: var(--color-black);}
                .alert-warning #icon { background: var(--color-black); color: var(--color-orange);}
                
                .alert-error { background: var(--color-red); color: var(--color-white);}
                .alert-error #icon { background: var(--color-white); color: var(--color-red);}
            </style>
            <div id="alert" class="alert-${this.type}">
                <div id="icon">${iconCheck}</div>
                <div id="alert-content">
                    <p id="title">${this.title}</p>
                    <p id="text">${this.text}</p>
                </div>
            </div>`;
        }

        setType = (type) => {
            const alertClassList = this.shadow.getElementById('alert').classList;
            const classToRemove = alertClassList.values().find((classString) => classString.includes('alert-'));
            alertClassList.remove(classToRemove);
            alertClassList.add(`alert-${type}`);

            this.shadow.getElementById('icon').innerHTML = iconLookup[type];
        }

        setInnerText = (elementId, text) => {
            this.shadow.getElementById(elementId).innerText = text;
        }
        // Element functionality written in here

        connectedCallback() {
            console.log('this.type', this.type);
            this.setType(this.type);
            this.setInnerText('text', this.text);
            this.setInnerText('title', this.title);
        }

        disconnectedCallback() {
            console.log("Custom element removed from page.");
        }

        connectedMoveCallback() {
            console.log("Custom element moved with moveBefore()");
        }

        adoptedCallback() {
            console.log("Custom element moved to new page.");
        }

        attributeChangedCallback(name, oldValue, newValue) {
            console.log(`Attribute ${name} has changed.`);

            if(newValue && newValue !== oldValue) {
                if(name === 'type') {
                    this.setType(newValue);
                }

                if(name === 'text' || name === 'title') {
                    this.setInnerText(name, newValue);
                }
            }

        }
    }
)