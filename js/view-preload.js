console.log("View Preload example loaded.");

async function init() {
    let channelId;
    let platform = fin.Platform.getCurrentSync();
    console.log("View Preload init called.");
    await fin.me.on('host-context-changed', data => {
        if(data !== undefined && data.context !== undefined && data.context.zoomlevel !== undefined) {
            if(fin.View.getCurrentSync().getZoomLevel != data.context.zoomlevel){
                fin.View.getCurrentSync().setZoomLevel(data.context.zoomlevel);                
            }
        }
    });

      window.addEventListener("wheel", function(event){
          console.log('wheel');
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

