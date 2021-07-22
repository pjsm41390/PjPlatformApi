export const CONTAINER_ID = 'layout-container';
async function init() {
    console.log("TabManager Preload example loaded.");

   import("http://localhost:5555/js/tab-manager.js")
   .then(async (tabManager) => {
       await tabManager.init({
       layoutId: "layout-container",
       hideTitle: false,
       leftComponents: ["dropdown-button"],
       //rightComponents: ["dropdown-button"]
       });
   })
   .catch((err) => console.error("Error getting tab-manager", err));
}
window.addEventListener('DOMContentLoaded', async () => {
    // Before .50 AI version this may throw...
    fin.Platform.Layout.init({containerId: CONTAINER_ID});
    await init();
});
