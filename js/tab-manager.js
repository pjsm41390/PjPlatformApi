let initialised = false;

export async function init(tabOptions) {
  if (initialised) {
    console.warn(
      "tab-manager: Has already been initialised. Only call it once passing in your tabOptions."
    );
  }

  if (tabOptions === undefined || tabOptions === null) {
    console.warn(
      "tab-manager: Can only be initialised if you pass it tabOptions."
    );
  }

  if (
    tabOptions !== undefined &&
    tabOptions !== null &&
    initialised === false
  ) {
    initialised = true;
    console.log("tab-manager initialising.");
    await new Promise(fin.desktop.main);
    const finWindow = await fin.Window.getCurrent();
    //finWindow.addListener("layout-ready", (event) => {
      console.log("tab-manager: Layout ready.");
      let layoutId = tabOptions.layoutId || "layout-container";
      finWindow.getCurrentViews()
        .then(views => setupTabs(views, tabOptions));
      let layoutContainer = document.getElementById(layoutId);
      if (layoutContainer !== undefined && layoutContainer !== null) {
        layoutContainer.addEventListener("tab-created", ({ detail }) => {
          debugger;
          finWindow.customData = "testing";
          const view = fin.View.wrapSync({ uuid: detail.uuid, name: detail.name});
          console.log('wrapped view', view.getInfo());
          
          view.addListener("focused", function(event) {
              document.getElementById("HeaderText").innerHTML = event.name;
          });

          console.log("tab-manager: tab created for view: " + detail.name);
          let config = { ...tabOptions };
          config.viewName = detail.name;
          config.tabId = detail.tabSelector;
          setupTab(config);
        });
      }
    //});
  }
}

function setupTabs(data, tabOptions) {
  if (data !== undefined) {
    console.log("tab-manager: setupTabs called.");
    data.forEach((view) => {
      const win = fin.Window.getCurrentSync();
      const car = {type: view.identity.name, data:"Testing"};
      
      win.updateOptions({customData:car});

      document.getElementById("HeaderText").innerHTML = view.identity.name;
      view.addListener("focused", function(event) {
          document.getElementById("HeaderText").innerHTML = event.name;
      });

      let config = { ...tabOptions };
      config.viewName = view.identity.name;
      config.tabId = "tab-" + view.identity.name;
      setupTab(config);
    });
  }
}

function setupComponent(name, viewName) {
  console.log(
    "tab-manager: setupComponent called for view: " +
      viewName +
      " to add component: " +
      name
  );
  let component = window.customElements.get(name);
  if (component !== undefined) {
    let componentToAdd = new component();
    componentToAdd.className = name;
    componentToAdd.viewName = viewName;
    return componentToAdd;
  }
  return undefined;
}

function setupTab(config) {
  console.log("tab-manager: setupTab called.");
  let viewName = config.viewName;
  let tabId = config.tabId;
  let hideTitle = config.hideTitle === true;
  let leftComponents = config.leftComponents;
  let rightComponents = config.rightComponents;
  let leftComponentsToAdd = [];
  let rightComponentsToAdd = [];

  if (leftComponents !== undefined && leftComponents.length > 0) {
    leftComponents.forEach((componentName) => {
      let leftComponentToAdd = setupComponent(componentName, viewName);
      if (leftComponentToAdd !== undefined) {
        leftComponentsToAdd.push(leftComponentToAdd);
      }
    });
  }

  if (rightComponents !== undefined && rightComponents.length > 0) {
    rightComponents.forEach((componentName) => {
      let rightComponentToAdd = setupComponent(componentName, viewName);
      if (rightComponentToAdd !== undefined) {
        rightComponentsToAdd.push(rightComponentToAdd);
      }
    });
  }

  if (leftComponentsToAdd.length > 0) {
    let insertPoint = document.querySelector(`#${tabId} .lm_left`);
    if (insertPoint !== undefined && insertPoint !== null) {
      leftComponentsToAdd.forEach((componentToAdd) => {
        insertPoint.insertAdjacentElement("afterend", componentToAdd);
      });
    }
  }

  if (rightComponentsToAdd.length > 0) {
    let insertPoint = document.querySelector(`#${tabId} .lm_close_tab`);
    let insertPosition = "beforebegin";
    if (insertPoint === null || insertPoint === undefined) {
      insertPosition = "afterend";
      insertPoint = document.querySelector(`#${tabId} .lm_right`);
    }

    if (insertPoint !== undefined && insertPoint !== null) {
      rightComponentsToAdd.forEach((componentToAdd) => {
        insertPoint.insertAdjacentElement(insertPosition, componentToAdd);
      });
    }
  }

  if (hideTitle) {
    let titleToHide = document.querySelector(`#${tabId} .lm_title`);
    if (titleToHide !== undefined && titleToHide !== null) {
      titleToHide.style.display = "none";
    }
  }
}
