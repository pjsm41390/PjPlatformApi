console.log("Window Preload example loaded.");

async function init() {
    let channelId;
    let platform = fin.Platform.getCurrentSync();
    console.log("View Preload init called.");
    await fin.me.on('host-context-changed', data => {
        console.log("Host context changed")
        if(data !== undefined && data.context !== undefined && data.context.channelId !== undefined) {
            channelId = data.context.channelId;
        }
    });
    let context = await platform.getWindowContext();
    
    if(context !== undefined && context === null && context.channelId !== undefined ){
        console.log("Context available on host. Setting Current channel to ID: " + context.channelId);
    }
    
    window.onresize = function onresize() {
        fin.Window.getCurrentSync().getZoomLevel().then(async x => {
        let platform = fin.Platform.getCurrentSync();
        await platform.setWindowContext({zoomlevel:x});
      });
    }    
    console.log("View Preload init ended.");
}

window.addEventListener('DOMContentLoaded', async () => {
    await init();
 });

