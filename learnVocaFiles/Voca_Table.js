/* version: 1.0          last update: Dec. 26, 2022 */
var parentMenu;
var menuItemIdx;

let srcTblIx = -1;
//let nofSrcTbl = 0;
let totWords = 0;
let nofWordsPerTbl = 0;
let bInit = false;
//var srcTbl;

/**************************/
function vtEventHandler(e) {
    var rsp=[];
    var v, len;
    let wIx = 0;

    switch(e.data.msg) {
    case "getRvwWord":
        if( Array.isArray(e.data.val) === true ) {
            rsp[0] = ["vcList", "", totWords.toString(), nofWordsPerTbl.toString()];
            rsp[1] = [];

            var src = document.getElementById("t_" + srcTblIx.toString());

            //if( (isNaN(src) === false) && (src !== null) ) {
            if ( (src !== null) && (e.data.val.length > 0) ) {
                v = e.data.val[0];
                
                if( v < (srcTblIx + nofWordsPerTbl) ) {
                    let i = 0, j = 0;

                    if( v === srcTblIx ) {
                        wIx = srcTblIx;
                    } else {
                        wIx = v;
                        if( v > srcTblIx ) j = v - srcTblIx;
                        else j = srcTblIx - v;  // it shouldn't happen.
                    }


                    for( i = 0; j < nofWordsPerTbl; j++, wIx++) {
                        if( wIx >= totWords ) break;

                        v = Number(src.rows[j].cells[tblSrcIxCol].innerText);
                        if( v === e.data.val[i] ) {
                                    // word                                        , pronunciation                             ,  meaning  meaning
                            rsp[1][i] = [src.rows[j].cells[tblSrcWordCol].innerText, src.rows[j].cells[tblSrcPronCol].innerText, src.rows[j].cells[tblSrcMeaningCol].innerText];
                            i++;
                        }
                    }

                    rsp[0][1] = i.toString(); // the number of matching words.

                } else {
                    rsp[1][0] = ["n/a", "out of range"];    
                }
            } else {
                if ( src === null ) {
                    rsp[1][0] = ["n/a", "no table available"];
                } else {
                    rsp[1][0] = ["n/a", "empty word indics"];
                }
            }

            window.parent.postMessage(rsp, "*");
        }
        break;
    case "getSrcTbl":
        v = Number(e.data.val);

        rsp[0] = ["vcList", "", totWords.toString(), nofWordsPerTbl.toString()];
        rsp[1] = [];

        //totWords = Number(document.getElementById("totNofWd").innerText);
        //nofWordsPerTbl = Number(document.getElementById("nofWdPerTbl").innerText);
        var src = document.getElementById("t_" + srcTblIx.toString());

        //if( (isNaN(src) === false) && (src !== null) ) {
        if ( src !== null ) {
            
            if( v < (srcTblIx + nofWordsPerTbl) ) {
                let j = 0;

                if( v === srcTblIx ) {
                    wIx = srcTblIx;
                } else {
                    wIx = v;
                    if( v > srcTblIx ) j = v - srcTblIx;
                    else j = srcTblIx - v;  // it shouldn't happen.
                }

                rsp[0][1] = v.toString();   // the id (index) of the first word.

                v = (srcTblIx + nofWordsPerTbl) - wIx;
                if( v > tblRows) len = tblRows + j;
                else len = v + j;

                for( let i = 0; j < len; i++, j++, wIx++) {
                    if( j >= nofWordsPerTbl ) break;
                    if( wIx >= totWords ) break;
                                // word                                   ,  meaning
                    rsp[1][i] = [src.rows[j].cells[tblSrcWordCol].innerText, src.rows[j].cells[tblSrcMeaningCol].innerText];
                }

            } else {
                rsp[1][0] = ["n/a", "out of range"];    
            }
        } else {
            rsp[1][0] = ["n/a", "no table available"];
        }

        window.parent.postMessage(rsp, "*");
        break;
    
    // case "review":
    // case "scan":
    //     break;        
    }
}

window.onload = function() {
    if( bInit === false ) {
        let v = document.getElementsByTagName("table")[0].id;

        window.addEventListener("message", vtEventHandler);
        v = v.substring(2);

        if( isNaN(v) === false ) srcTblIx = Number(v);
        
        totWords = Number(document.getElementById("totNofWd").innerText);
        nofWordsPerTbl = Number(document.getElementById("nofWdPerTbl").innerText);
        
        bInit = true;
    }
}
