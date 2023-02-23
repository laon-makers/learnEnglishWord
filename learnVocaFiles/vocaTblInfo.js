/* version: 1.0          last update: Dec. 26, 2022 */
var parentMenu;
var menuItemIdx;

let srcTblIx = -1;
let nofTbl = 0;
let totWords = 0;
let nofWordsPerTbl = 0;
let bInit = false;
//var srcTbl;

/**************************/
function tifEventHandler(e) {
    var rsp=[];

    if( e.data == "getTblInfo" ) {
        rsp[0] = ["vcTblInfo", document.getElementById("name").innerText];
        
        rsp[1] = ["nofTbl", document.getElementById("nofTbl").innerText];
        rsp[2] = ["totNofWd", document.getElementById("totNofWd").innerText];
        rsp[3] = ["nofWdPerTbl", document.getElementById("nofWdPerTbl").innerText];

        window.parent.postMessage(rsp, "*");
    }
}

window.onload = function() {
    if( bInit === false ) {
        window.addEventListener("message", tifEventHandler);
        bInit = true;
    }
}
