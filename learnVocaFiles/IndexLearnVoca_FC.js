/* version: 1.0          last update: Jan. 17, 2022 */

// 3 variables for slide show.
var slideShowInterval = 2000;
var slideShowTimer;
var slideShowContainer;
var slideShowStopCntDwn = -1;

var lastItem;
var lastIx;
var chapterGoal;
let bNavExpand = true;
let bAdmin = false;

const bigUnitHeightSize = 50;
const bigUnitWidthSize = 50;
const unitHeightSizeSmall = 10;
const unitWidthSizeSmall = 10;
const minHeight = 200;
const minWidth = 250; //500;

var InitShowNavElement= function() {
    lastItem = 0;
    lastIx = 0;
    chapterGoal = true;
}

InitShowNavElement();

// This function doesn't use jQuery. It shows the selected item on the navigation panel on the left.
// It also gets the selected Navigation menu toggled.
function showNavElement(item, arrayIds) {        
    let b = false;

    if( item < 0 ) {
        var lId;
        let id;

        let ix = Number(item) * (-1);
        
        if(chapterGoal === false) {
            document.getElementById('dtGoal').hidden = true;
            chapterGoal = true;
        }
        
        //if(item !== lastItem) {
            if( lastItem !== 0) lId = arrayIds[(lastItem * (-1)) - 1];
        //}
        
        // added outer 'if-else' statement to get the selected menu on the 'nav' toggled.
        if(item !== lastItem) {
            id = arrayIds[ix - 1];
            lastItem = item;
            b = true;
        } else {
            lastItem = 0;   // it allows navigation menu toggle
            document.getElementById('dtGoal').hidden = false;
            chapterGoal = false;
        }
        
        if(lId !== undefined) {
            document.getElementById(lId).hidden = true;
            if(lastIx !== 0) document.getElementById('m' + lastIx.toString()).classList.remove('sel');
        }
        
        if(id !== undefined) {
            document.getElementById(id).hidden = false;
            if(ix !== 0) document.getElementById('m' + ix.toString()).classList.add('sel');
            lastIx = ix;
        }
        
    } //else if(item === 1) el1 = true;

    return b;
}


function goToUrl(url) {
    /* ????????? HTA?????? ????????????, "This content cannot be displayed in a frame" ????????? ????????????. 
    ?????? ?????? ???????????? "Open this content in a new window"??? ???????????? ?????? URL??? Browser ?????? ????????????.
    ?????? ?????? htm file??? ?????? ????????? ?????? ????????? <span id="myId"></span>??? ?????? ???????????? ??????.
    document.getElementById('myId').innerHTML = "<iframe width='100%' height='100%' src=" + url + " ></iframe>";
    */
    
    // HTA??? ?????? Browser?????? URL??? ????????? ?????? ?????? ?????? ?????? ?????? ??????.
    var ie = new ActiveXObject("InternetExplorer.Application");
    ie.navigate(url);
    ie.visible = true;
}

/* Slide Show
var slideShowInterval = 2000;
var slideShowTimer;
var slideShowContainer = $('.slideshow');*/
function slideShowSwitchImg(){
    var imgs = slideShowContainer.find('img'); // img element??? ?????? ??????
    // ???????????? ????????? element??? ??????.
    var first = imgs.eq(0); //??? ?????? img element??? first??? ??????.
    var second = imgs.eq(1);//??? ?????? img element??? second??? ??????.
    
    if(slideShowStopCntDwn > 0 ) {
        slideShowStopCntDwn--;
        if(slideShowStopCntDwn == 0 ) {
            slideShowStopTimer();
        }
    }

    if(slideShowStopCntDwn != 0 ) {
        /* ?????? ????????? first.fadeOut()??? first.appendTo(slideShowContainer)??? ??????????????? ?????? ?????????.
           ????????? method??? first.appendTo(slideShowContainer)??? ?????? ????????? ???????????? ?????? ?????? ????????????
           single step tracing??? slideShowContainer object??? '0: div.slideshow'->innerHTML?????? 
           context->outerHTML??? ?????? ????????????. append()??? appendTo()??? ?????? ?????? ??????.
           ?????? class="alt"??? ?????? ????????? img??? ?????? ?????? ???????????? ?????? ???????????? ????????? ?????????.
           ?????? ?????? ????????? ?????? ??????.
        */
        first.fadeOut().appendTo(slideShowContainer); //????????? img element??? ????????? ?????? ????????? ?????? ?????? ????????????.
        second.fadeIn(); //??????????????? ????????? ?????????????????? ????????? ??????????????? mili-second??? ????????? ???????????? ????????? ??????????????? ????????? ?????? ?????? ??????. ??? ????????? ????????????.
    }
}
function slideShowStartTimer(){    
    slideShowTimer = setInterval(slideShowSwitchImg,slideShowInterval);
}

function slideShowStopTimer(){
    clearInterval(slideShowTimer);    
}


function expandHeight(ix, sz) {
    var fr = null;
    var s, u = 2;

    if(ix === 1) {
        fr = document.getElementById("ifReviewWd");
    } else if(ix === 2) {
        fr = document.getElementById("ifScanWd");
    } else if(ix === 10) {
        fr = document.getElementById("ifSettings");
    }

    if( fr !== null ) {
        fr.style.border = "solid";
        if( sz === 1 ) u = unitHeightSizeSmall;
        else if( sz === 2 ) u = bigUnitHeightSize;
        
        s = fr.style.height.replace("px", "");
        //if( s === "" ) s = "400px";
        //s = s.replace("px","");

        s = Number(s) + u;
        //if( s < minHeight ) s = minHeight;

        fr.style.height = s.toString() + "px";

        if(ix === 10) {
            // htm = document.getElementById("ifSettings");
            // htm.src =   ".\\learnVocaFiles\\LearnVoca_FCurve.htm?menu=setting&Ix=11&Val=" + s.toString(); // to to set window height in local storage

            // Set window width
            localStorage.setItem("winH", s.toString());
            
        }
    }
}

function shrinkHeight(ix, sz) {
    var fr = null;
    var s, u = 2;

    if(ix === 1) {
        fr = document.getElementById("ifReviewWd");
    } else if(ix === 2) {
        fr = document.getElementById("ifScanWd");
    } else if(ix === 10) {
        fr = document.getElementById("ifSettings");
    }

    if( fr !== null ) {
        fr.style.border = "solid";
        if( sz === 1 ) u = unitHeightSizeSmall;
        else if( sz === 2 ) u = bigUnitHeightSize;
        
        s = fr.style.height.replace("px", "");
        s = Number(s) - u;
        if( s < minHeight ) s = minHeight;

        if( s > 0 ) {
            fr.style.height = s.toString() + "px";

            if(ix === 10) {
                //htm = document.getElementById("ifSettings");
                //htm.src =   ".\\learnVocaFiles\\LearnVoca_FCurve.htm?menu=setting&Ix=11&Val=" + s.toString(); // to to set window height in local storage

                // Set window height
                localStorage.setItem("winH", s.toString());
            }
        }
    }
}

function expandWidth(ix, sz) {
    var fr = null;
    var s, u = 2;

    if(ix === 1) {
        fr = document.getElementById("ifReviewWd");
    } else if(ix === 2) {
        fr = document.getElementById("ifScanWd");
    } else if(ix === 10) {
        fr = document.getElementById("ifSettings");
    }

    if( fr !== null ) {
        fr.style.border = "solid";
        if( sz === 1 ) u = unitWidthSizeSmall;
        else if( sz === 2 ) u = bigUnitWidthSize;

        s = fr.style.width.replace("px", "");
        s = Number(s) + u;

        fr.style.width = s.toString() + "px";

        if(ix === 10) {
            // htm = document.getElementById("ifSettings");
            // htm.src =   ".\\learnVocaFiles\\LearnVoca_FCurve.htm?menu=setting&Ix=12&Val=" + s.toString(); // to to set window width in local storage

            // Set window width
            localStorage.setItem("winW", s.toString());
        }
    }
}

function shrinkWidth(ix, sz) {
    var fr = null;
    var s, u = 2;

    if(ix === 1) {
        fr = document.getElementById("ifReviewWd");
    } else if(ix === 2) {
        fr = document.getElementById("ifScanWd");
    } else if(ix === 10) {
        fr = document.getElementById("ifSettings");
    }

    if( fr !== null ) {
        fr.style.border = "solid";
        if( sz === 1 ) u = unitWidthSizeSmall;
        else if( sz === 2 ) u = bigUnitWidthSize;
        
        s = fr.style.width.replace("px", "");
        s = Number(s) - u;
        if( s < minWidth ) s = minWidth;

        if( s > 0 ) {
            fr.style.width = s.toString() + "px";
            if(ix === 10) {
                // htm = document.getElementById("ifSettings");
                // htm.src =   ".\\learnVocaFiles\\LearnVoca_FCurve.htm?menu=setting&Ix=12&Val=" + s.toString(); // to to set window width in local storage
                // Set window width
                localStorage.setItem("winW", s.toString());
            }    
        }
    }
}

function navExpandOrCollapse( bExd ) {
    document.getElementById("navExpand").hidden = bExd;
    document.getElementById("navColpse").hidden = !bExd;
    
    if( bExd == true ) {
        document.getElementsByTagName("nav")[0].style.width = "100px";
    } else {
        document.getElementsByTagName("nav")[0].style.width = "10px";
    }

    for( let i = 0; i < 7; i++ ) {
        document.getElementById("n" + i.toString()).hidden = !bExd;
    }
    bNavExpand = bExd;
}

function clearReviewWordList(menu) {
    let dv = document.getElementById("settingMsg");

    let txt = "\n?????? ????????? ?????? ????????? ????????? ?\n  (??????: ?????? ???????????? ????????? ??? ????????????)";

    if( confirm(txt) === true ) {
        htm = document.getElementById("ifSettings");
        // //htm.src =   ".\\learnVocaFiles\\LearnVoca_FCurve.htm?menu=Settings&Ix=10"; // to clear local storage
        // htm.src =   ".\\learnVocaFiles\\LearnVoca_FCurve.htm?menu=" + menu + "&Ix=10"; // to clear local storage
        htm.contentWindow.postMessage( {msg: "clearStorage"}, "*");
        
        //document.getElementById("ifReviewWd").contentWindow.postMessage("resetBuf", "*");
        //document.getElementById("ifScanWd").contentWindow.postMessage("resetBuf", "*");
        resetToDefaultSettings();

        dv.innerHTML = "?????? ????????? ?????? ??????????????? !";
    } else {
        dv.innerHTML = "?????? ?????? ????????? ?????? ??????????????? !";
    }
}

function resetToDefaultSettings() {
    localStorage.clear();
}

function vocaTblChanged() {
    let sel = document.getElementById("vocaTblSel").selectedIndex;
    document.getElementById("ifSettings").contentWindow.postMessage( {msg: "setVocaTable", val: sel.toString()}, "*");
}

function cmdGetVocaTableIndex() {
    document.getElementById("ifSettings").contentWindow.postMessage( { msg:"getVocaTable"}, "*");
}

function cmdSetExtraDelay4PostMsg() {
    let v = Number(document.getElementById("tDlySel").value);
    document.getElementById("ifSettings").contentWindow.postMessage( { msg:"setExtraTDely", val: v}, "*");
    document.getElementById("ifReviewWd").contentWindow.postMessage( { msg:"setExtraTDely", val: v}, "*");
    document.getElementById("ifScanWd").contentWindow.postMessage( { msg:"setExtraTDely", val: v}, "*");

    try {
        var v2 = localStorage.getItem("pmExtTD");

        if( (isNaN(v2) === true) || (v2 === null) ) {
            v2 = v;
        } else {
            v2 = Number(v2);
            if( v2 !== v ) v2 = v;
        }
        
        v2 += dftPostMsgTimeout;

        if( (isNaN(v2) === true) || (v2 === null) ) {
            v2 = dftPostMsgTimeout + dftExtPostMsgTimeout;
        }

        if( v2 !== postMsgTDly ) {
            localStorage.setItem("pmExtTD", v.toString());
        }
        
        postMsgTDly = v2;
    } catch (err) {
        alert("Error in accessing the postMessage extra time delay !\r\n\tError: " + err.message);
    }
}