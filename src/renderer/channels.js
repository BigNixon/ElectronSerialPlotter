let channelsContainer = document.getElementById("channels-container");
let numCh = 4;

for(let i=0;i<numCh;i++){
    var canv = document.createElement('canvas');
    canv.id = `canvas-channel${i}`;
    canv.className = "canvas-channel"
    let tam = 100/(numCh+1);
    canv.style = `width: ${tam}%`;
    channelsContainer.appendChild(canv);
}
