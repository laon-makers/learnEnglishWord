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
    /* 아래를 HTA에서 실행하면, "This content cannot be displayed in a frame" 에러가 발생한다. 
    이때 좀더 아래쪽에 "Open this content in a new window"를 클릭하면 해당 URL이 Browser 통해 로드된다.
    또한 해당 htm file의 표시 하고자 하는 부분에 <span id="myId"></span>와 같이 작성해야 한다.
    document.getElementById('myId').innerHTML = "<iframe width='100%' height='100%' src=" + url + " ></iframe>";
    */
    
    // HTA가 아닌 Browser에서 URL을 로드할 경우 위의 것을 실행 해야 한다.
    var ie = new ActiveXObject("InternetExplorer.Application");
    ie.navigate(url);
    ie.visible = true;
}

/* Slide Show
var slideShowInterval = 2000;
var slideShowTimer;
var slideShowContainer = $('.slideshow');*/
function slideShowSwitchImg(){
    var imgs = slideShowContainer.find('img'); // img element를 모두 취득
    // 첫번째와 두번째 element를 취득.
    var first = imgs.eq(0); //첫 번째 img element를 first에 할당.
    var second = imgs.eq(1);//두 번째 img element를 second에 할당.
    
    if(slideShowStopCntDwn > 0 ) {
        slideShowStopCntDwn--;
        if(slideShowStopCntDwn == 0 ) {
            slideShowStopTimer();
        }
    }

    if(slideShowStopCntDwn != 0 ) {
        /* 아래 함수는 first.fadeOut()과 first.appendTo(slideShowContainer)를 순차적으로 실행 시킨다.
           두번째 method인 first.appendTo(slideShowContainer)에 의해 첫번째 이미지가 가장 뒤로 이동됨을
           single step tracing중 slideShowContainer object의 '0: div.slideshow'->innerHTML이나 
           context->outerHTML를 통해 확인했다. append()와 appendTo()은 다른 기능 같다.
           이때 class="alt"가 없던 첫번째 img가 가장 뒤로 보내져도 없던 클래스가 생기진 않는다.
           그냥 위치 이동만 일어 났다.
        */
        first.fadeOut().appendTo(slideShowContainer); //첫번째 img element를 페이드 아웃 시킨뒤 가장 뒤로 이동시킴.
        second.fadeIn(); //브라우져에 내장된 내장함수로써 두번째 아규먼트인 mili-second의 시간이 경과하면 첫번째 아규먼트인 함수를 호출 하게 된다. 이 동작이 반복된다.
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

    let txt = "\n학습 정보를 삭제 하시겠 습니까 ?\n  (주의: 한번 삭제하면 복구할 수 없습니다)";

    if( confirm(txt) === true ) {
        htm = document.getElementById("ifSettings");
        // //htm.src =   ".\\learnVocaFiles\\LearnVoca_FCurve.htm?menu=Settings&Ix=10"; // to clear local storage
        // htm.src =   ".\\learnVocaFiles\\LearnVoca_FCurve.htm?menu=" + menu + "&Ix=10"; // to clear local storage
        htm.contentWindow.postMessage( {msg: "clearStorage"}, "*");
        
        //document.getElementById("ifReviewWd").contentWindow.postMessage("resetBuf", "*");
        //document.getElementById("ifScanWd").contentWindow.postMessage("resetBuf", "*");
        resetToDefaultSettings();

        dv.innerHTML = "학습 정보가 삭제 되었습니다 !";
    } else {
        dv.innerHTML = "정보 삭제 요청이 취소 되었습니다 !";
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