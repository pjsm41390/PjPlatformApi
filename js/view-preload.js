console.log("View Preload example loaded.");

async function init() {
    let channelId;
    let platform = fin.Platform.getCurrentSync();
    console.log("View Preload init called.");
    await fin.me.on('host-context-changed', data => {
        console.log("Host context changed")
        console.log("this is a test")
        if(data !== undefined && data.context !== undefined && data.context.zoomlevel !== undefined) {
            if(fin.View.getCurrentSync().getZoomLevel != data.context.zoomlevel){
                fin.View.getCurrentSync().setZoomLevel(data.context.zoomlevel);                
            }
        }
    });
    
    console.log("View Preload init ended.");
    
    window.onresize = function onresize() {
        fin.View.getCurrentSync().getZoomLevel().then(async x => {
            let platform = fin.Platform.getCurrentSync();
            await platform.setWindowContext({zoomlevel:x});
        });
    }
      window.addEventListener("wheel", function(event){
        if(event.ctrlKey){
             if (event.deltaY < 0)
             {
                fin.View.getCurrentSync().getZoomLevel().then(async x => {
                    let platform = fin.Platform.getCurrentSync();
                    await platform.setWindowContext({zoomlevel:x + .5});
                });
             }
             else if (event.deltaY > 0)
             {
                fin.View.getCurrentSync().getZoomLevel().then(async x => {
                    let platform = fin.Platform.getCurrentSync();
                    await platform.setWindowContext({zoomlevel:x - .5});
                });
             }
        }
      });
}

window.addEventListener('DOMContentLoaded', async () => {
    await init();
 });

