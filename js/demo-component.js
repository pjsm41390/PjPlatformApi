class Dropdown extends HTMLButtonElement {
    constructor() {
      super(); // always call super() first in the constructor.
      this.addEventListener('click', e => this.callJavascriptFunction());
      
    }

    set viewName(value) {
      this.setAttribute("viewName", value);
    }
  
    get viewName() {
      return this.getAttribute("viewName");
    }
    
    set margin(margins) {
      if (margins !== undefined && margins.right !== undefined) {
        this.style.marginRight = margins.right;
        this.style.height = {height: "10px"};
      }
    }
    connectedCallback() {
      this.margin = { right: "10px" };
    }
    async callJavascriptFunction(){
      const wnd = fin.Window.getCurrentSync()
      const options = await wnd.getOptions()
      
      const template = [
          {
              label: options.customData.data,
              data: options.customData.data
          },
          { type: 'separator' },
          {
              label: 'Menu Item 2',
              type: 'checkbox',
              checked: true,
              data: 'The user clicked the checkbox'
          },
          {
              label: 'see more',
              enabled: true,
              submenu: [
                  { label: 'submenu 1', data: 'hello from submenu' }
              ]
          }
      ]
      fin.me.showPopupMenu({ template }).then(r => {
          if (r.result === 'closed') {
              console.log('nothing happened');
          } else {
              console.log(r.data)
          }
      })
    }
  
    disconnectedCallback() {}
  }


  window.customElements.define("dropdown-button", Dropdown, {extends: 'button'});
  