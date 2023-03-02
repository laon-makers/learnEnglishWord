/* version: 1.0          last update: Feb. 23, 2023 */
const reviewDayType = 't';

const aReviewType = [ 1, 1, 1, 3, 7, 14, 28, 365, 1000]; // review gets started on the first, continued on the 2nd, and 3rd day, and then in 3 days, 7 days, 14 days, and so on.
const maxNumVocaTbl = 3;    // the number of voca. tables to be loaded.
const colPerVocaTbl = 4;    // the number of columns per loaded voca. table.
const rowPerVocaTbl = 30;   // the number of rows per loaded voca. table.
const dftTblInfoUpdtCntDwn = 5;
const toDisWordIdexElements = 2000; // 2000 msec.

// Following 2 values must be initialized, otherwise old values are kept in the page refresh.
var parentMenu = "";
var menuItemIdx = "";
var menuItemVal = "";

let nextRevWdIx = 0;
var revWrdNums = [];
var revWords = [];
let revWrdCntToday = 0;
//let vocaTable = "voca330_table";
let vocaTblIdx = 0;
let wdCnt = 0;
let srcTblIx = 0;  // must be different from firstWordIdx
let nofSrcTbl = 0;
let totNofWords = 0;
let nofWordsPerSrcTbl = 0;
let firstWordIdx = 1;
//let emptyRowIx = 1;
let reviewDay = 0;
let tmpSelReviewDay = 0;
let bReviewCompleted = false;
let curTblRows = tblRows;
let bInit = false;
let bAdmin = false;
let tblInfoUdtCntDwn = dftTblInfoUpdtCntDwn;
let postMsgTDly = dftPostMsgTimeout + dftExtPostMsgTimeout;
let expectedReviewDate = "";
var timeOutId = null;

/**************************/
// function resetBuf(bFull) {
//     if( bFull === true ) {
//         vocaTblIdx = 0;
//         totNofWords = 0;
//         curTblRows = tblRows;
//         bAdmin = false;
//     }

//     wdCnt = 0;    
//     firstWordIdx = 1;
//     reviewDay = 0;
//     tmpSelReviewDay = 0;
//     bReviewCompleted = false;
// }

function cmdGetSourceTableInfo() {
    if( tblInfoUdtCntDwn > 0 ) {
        tblInfoUdtCntDwn--;
        document.getElementById("ifTblInfo").contentWindow.postMessage("getTblInfo", "*");
        setTimeout(cmdGetSourceTableInfo, postMsgTDly);
    }
}

function cmdGetSourceTable() {
    let ifr = document.getElementById("ifTmpVcTbl");

    ifr.contentWindow.postMessage({msg:"getSrcTbl", val: firstWordIdx.toString()}, "*");
}

function cmdRevWordsFromSrcTble() {
    var a;
    let len = revWrdNums.length;

    if( len > 0 ) {
        a = revWrdNums.slice(nextRevWdIx, len);
        document.getElementById("ifTmpVcTbl").contentWindow.postMessage({msg: "getRvwWord", val: a}, "*");
    }
}

function getSourceTableIndex(num) {
    let v = num % nofWordsPerSrcTbl;
    if( v === 0 ) v = num;
    else v = num - v;
    return v;
}

function setSourceTableIndex(num) {
    if( nofWordsPerSrcTbl > 0 ) {
        let x = 0;
        let v = num % nofWordsPerSrcTbl;

        if( v === 1 ) {
            v = num;        
        } else {
            x = Number.parseInt(num / nofWordsPerSrcTbl);
            if( v === 0 ) if( x > 0 ) x -= 1;

            v = x * nofWordsPerSrcTbl + 1;
        }

        srcTblIx = v;
    }
}


function getArguments() {
    /* 설명:
    1. 'location.search' is the property that holds the list of parameters.
    2. substring(1) skips the ? symbol and returns the string minus this sign.
    3. split("&") splits the string and returns an array whose elements are the parameters.
    4. this array is assigned to the "parameters" variable. We can now access individual elements by subscripting the array. Parameters[0] is the first element.
    5. we have to split again the parameter into another small array that holds the name of the variable and the value.
    6. in this example, we need only for the value, so we subscript the small array to second item, temp[1].
    7. the unescape function convert special characters.
    8. we have assigned the l variable with the login value and the p variable with the password.
    9. the login is written in the log field thanks to the getElementById method.
    10. and password to the pass field.
    */
	var temp;
    var n = 0;
	var parameters = location.search.substring(1).split("&");
    temp = parameters[0].split("=");
    
    if( temp.length > 1 ) {        
        if( temp[0] == 'menu' ) {
            n++;
            //parentMenu = unescape(temp[1]);
            parentMenu = temp[1].trim();
            
            if(parameters.length > 1) {                
                n++;
                temp = parameters[1].split("=");
                //menuItemIdx = unescape(temp[1]);
                menuItemIdx = temp[1].trim();

                if(parameters.length > 2) {                
                    n++;
                    temp = parameters[2].split("=");
                    //menuItemIdx = unescape(temp[1]);
                    menuItemVal = temp[1].trim();

                    if(temp[0].trim() === "Admin") {
                        //if( menuItemVal == '2' ) bAdmin = true; // '2' for the New Word page
                        bAdmin = true; // '2' for the New Word page
                    }
                }   
            } else menuItemIdx = "1";
            //alert("Length: " + n + ", Tab Menu: " + parentMenu + ", Item: " + menuItemIdx);
        }
        //  else {
        //     parentMenu = "default";
        //     menuItemIdx = "1";    
        // }
    } else {        
        parentMenu = "default";
        menuItemIdx = "1";
    }
    
    return n;
}

function hideClassForRvTable(ix) {
    //document.getElementsByClassName("trToAdd").style.display = "none";
    var cs1 = document.getElementsByClassName("trNewWList");
    //var cs2 = document.getElementsByClassName("trToAdd");
    for( let i = ix; i < cs1.length; i++ ) {
        cs1[i].style.display = "none";
        //cs1[i].style.visibility = "hidden";
        //cs2[i].style.display = "none";
        //cs2[i].style.visibility = "hidden";
    }
}

function hideClassForScanTable(ix) {
    //document.getElementsByClassName("trToAdd").style.display = "none";
    var cs1 = document.getElementsByClassName("trDel");
    //var cs2 = document.getElementsByClassName("trToAdd");
    var cs3 = document.getElementsByClassName("trPron");
    for( let i = ix; i < cs1.length; i++ ) {
        cs1[i].style.display = "none";
        //cs1[i].style.visibility = "hidden";
        //cs2[i].style.display = "none";
        cs3[i].style.display = "none";
    }
}


function clearTable(){
    //if ( parentMenu === menuReviewWords) {
        var dst = document.getElementById('wdTbl');
        let len = dst.rows.length;
        
        for( let i = 1 ; i < len; i++) {            
            dst.rows[i].cells[tblDstIxCol].innerHTML = "";        // Word index number
            dst.rows[i].cells[tblDstWordCol].innerHTML = "";      // word
            dst.rows[i].cells[tblDstPronCol].innerHTML = "";      // pronunciation
            dst.rows[i].cells[tblDstMeaningCol].innerHTML = "";   // meaning of word.
            dst.rows[i].cells[tblDstToAddCol].innerHTML = "";     // meaning of word.
        }      
    //}

}


function DeleteWord(ix) {
    var tbl = document.getElementById("wdTbl");

    if( document.getElementById("ckbDel" + ix).checked == true ) {
        //ix = Number(ix);
        tbl.rows[ix + 1].cells[tblDstWordCol].style.textDecoration = "line-through"; // Word;        
        tbl.rows[ix + 1].cells[tblDstWordCol].style.color = "grey";
    } else {
        tbl.rows[ix + 1].cells[tblDstWordCol].style.textDecoration = "none"; // Word;
        tbl.rows[ix + 1].cells[tblDstWordCol].style.color = "black";
    }
}

function DeleteSelectedWords() {
    var tbl = document.getElementById("wdTbl");    
    if(tbl !== null) {

        for( let ix = 0; ix < curTblRows; ix++ ) {
            if( document.getElementById("ckbDel" + ix).checked == true ) {
                
                let v = Number(tbl.rows[ix + 1].cells[tblDstIxCol].innerText); // Word Index Number;
                if( v > 0 ) {
                    try {
                        localStorage.removeItem(v.toString());
                    } catch (err) {
                        alert("Failure in removing an word indexed by " + v.toString() + " !\r\n\tMsg:" + err.message );
                    }
                }
                
                tbl.rows[ix + 1].cells[tblDstWordCol].style.textDecoration = "none"; // Word;
                tbl.rows[ix + 1].cells[tblDstWordCol].style.color = "black";
            }
        }
    }
}



function addMainTableRow(st, len) {
    const tbl = document.getElementById("wdTbl");
    let ix = 0;
                    
    curTblRows = len;

    // add rows for listing words into 'wdTbl' table; starting from the 2nd row to the 15th rows.
    for( let i = st; i < len; i++ ) {  // not '<=' because one data row is there already.
        ix = i + 1;
        let row = tbl.insertRow();

        for( let j = 0; j < tblCols; j++) {
            let c = row.insertCell(-1);
            c.innerHTML = '&nbsp;'

            switch( j ) {
            case 0: c.innerHTML = ix.toString(); break;
            case 1:
                c.classList.add("trSel");
                //if(menuItemIdx == "1") {    // '단어 암기'
                //    c.innerHTML = '<input type="checkbox" id="ckbSel' + i.toString() + '" onclick="ShowMeaning(' + i.toString() + ')" unchecked>';
                //} else {    // '단어 추가'
                    c.innerHTML = '<input type="checkbox" id="ckbSel' + i.toString() + '" onclick="viewOrSelectWord(' + i.toString() + ')" unchecked>';
                //}
            //case 1: c.innerHTML = '<input type="checkbox" id="ckbSel' + ix.toString() + '" onclick="savePickedWds()" unchecked>';
                break;
            case 3: c.classList.add("trPron"); break;
            case 4: c.classList.add("trWMean"); break;
            case 5: c.classList.add("trToAdd"); break;
            case 6: c.classList.add("trSpace_1"); break;
            case 7: c.classList.add("trNewWList"); break;
            case 8: 
                c.classList.add("trDel");
                c.innerHTML = '<input type="checkbox" id="ckbDel' + i.toString() + '" onclick="DeleteWord(' + i.toString() + ')" unchecked>';                
                break;
            }
        }
    }
}

function populateWordTable(wIx, bRload) {
    let hide = document.getElementById('chkDetails');
    var dst = document.getElementById('wdTbl');
    let cnt = 0;
    var i = 0;
    var k, v;
    let tmp = 0;
    let bChg = false;
    let bLd  = false;
    
    //let src = document.getElementById(aVocaTable[vocaTblIdx]);
    let ifr = document.getElementById("ifTmpVcTbl");
    
    wIx = Number(wIx);

    if ( parentMenu === menuReviewWords) {
        var a;
        let v2 = 0;
        //var revWrdNums = [];
        len = localStorage.length + 1;
        i = 0;

        clearTable();
        resetBuffForNewPage();
        
        for( let j = 0; j < localStorage.length; j++ ) {
            //v = Number(localStorage.getItem(j.toString()));
            k = localStorage.key(j.toString());
            if( isNaN(k) === false ) {
                v = localStorage.getItem(k);
                a = v.split(":");
                if( a.length > 1 ) {
                    if( isNaN(a[0]) === false ) {
                        v = Number(a[0]);
                        if( v > 0 ) {                        
                            cnt++;
                            if( v === tmpSelReviewDay ) {
                                
                                v2 = Number(k);
                                
                                //if(v2 > totNofWords ) break;
                                revWrdNums[i++] = v2;
                            }
                        }
                    }
                }
            }
        }

        if( cnt < wdCnt ) { // needs to correct the count: seems to happen by picking and saving the same word index number more than once.
            wdCnt = cnt;
            localStorage.setItem("wdCnt", wdCnt.toString());
        }

        cnt = 0;

        let ln = revWrdNums.length;
        // Sorting the indics if necessary
        if( ln > 1 ) {
            // Get the sorting repeated the same number of time as the number of contents in the 'lst'.
            // So, that all the number in the 'lst' can be sorted in full.
            for( i = 0; i < ln; i++ ) {
                bChg = false;

                for( let j = 1; j < ln; j++ ) {
                    tmp = revWrdNums[j-1];
                    if( tmp > revWrdNums[j] ) {
                        revWrdNums[j-1] = revWrdNums[j];
                        revWrdNums[j] = tmp;
                        bChg = true;
                        cnt++;
                    }
                }

                if( bChg === false ) {  // exit the for loop since all number in the array 'revWrdNums' are sorted in ascending order already.
                    break; 
                }
            }
        
            
            //if( cnt > 0 ) { // Sorting took place.
                ln = revWrdNums.length;                
                //if( ln > tblRows ) ln = tblRows;
                if( ln > curTblRows ) { // need to add rows to the review table.
                    let ix = 0;
                    
                    curTblRows = ln;

                    addMainTableRow(tblRows, ln);

                    // Hide 2 classes in each added rows.
                    hideClassForRvTable(tblRows);
                }
            //}
        }

        i = 0;

        if( (bInit === false) || (bRload === true) ) {
            
            revWrdCntToday = revWrdNums.length;
            document.getElementById("ifTblInfo").src = aVocaTable[vocaTblIdx] + "\\info.htm";
            if( bInit === false ) setTimeout(cmdGetSourceTableInfo, postMsgTDly);
            else setTimeout(cmdGetSourceTableInfo, (postMsgTDly + 100));
            bLd = true;

        } else if( ln > 0 ) {            
            //firstWordIdx = v;
            
            for( i = 0; i < ln; i++ ) {
                v = Number(dst.rows[i+1].cells[tblDstIxCol].innerHTML);
                if( v !== revWrdNums[i] ) break;
            }

            //if( srcTblIx !== getSourceTableIndex(revWrdNums[0]) ) {
            if ( i !== ln ) {
                v = srcTblIx;
                setSourceTableIndex(revWrdNums[0]);

                if( v === srcTblIx ) {
                    ifr.contentWindow.postMessage({msg: "getRvwWord", val: revWrdNums}, "*");
                } else {
                    ifr.src = aVocaTable[vocaTblIdx] + "\\" + srcTblIx.toString() + ".htm";
                    setTimeout(cmdRevWordsFromSrcTble, postMsgTDly);
                }

                bLd = true;
            } else {
            //     ifr.contentWindow.postMessage({msg: "getRvwWord", val: revWrdNums}, "*");
                i = curTblRows;  // to keep the data in the table
            }
        }

    } else if( (parentMenu === menuAddNewWords) || (parentMenu === menuSettings) ) {    // if ( parentMenu === menuReviewWords)

        if( wIx > 0 ) wIx -= 1;
        else wIx = 0;

        v = wIx + 1;

        //if( parentMenu === menuAddNewWords ) {
            if( (bInit === false) || (bRload === true) ) {
                firstWordIdx = v;
                
                if( bRload === true ) {
                    clearTable();
                    resetBuffForNewPage();    
                }

                document.getElementById("ifTblInfo").src = aVocaTable[vocaTblIdx] + "\\info.htm";
                if( bInit === false ) setTimeout(cmdGetSourceTableInfo, postMsgTDly);
                else setTimeout(cmdGetSourceTableInfo, (postMsgTDly + 100));

                bLd = true;

            } else if( v !== firstWordIdx ) {
                
                firstWordIdx = v;
                
                clearTable();
                resetBuffForNewPage();

                if( srcTblIx !== getSourceTableIndex(firstWordIdx) ) {
                    setSourceTableIndex(firstWordIdx);
                    ifr.src = aVocaTable[vocaTblIdx] + "\\" + srcTblIx.toString() + ".htm";
                    setTimeout(cmdGetSourceTable, postMsgTDly);
                } else {
                    ifr.contentWindow.postMessage({msg: "getSrcTbl", val: firstWordIdx.toString()}, "*");
                }

                bLd = true;

                i = 0;
            } else {
                i = curTblRows;  // to keep the data in the table
            }
        // }
    }

    if( i < curTblRows ) {
        for( let j = i+1 ; i < curTblRows; i++, j++) {
    
            dst.rows[j].cells[tblDstIxCol].innerHTML = "";        // Word index number
            dst.rows[j].cells[tblDstWordCol].innerHTML = "";      // word
            dst.rows[j].cells[tblDstPronCol].innerHTML = "";      // pronunciation
            dst.rows[j].cells[tblDstMeaningCol].innerHTML = "";   // meaning of word.
            dst.rows[j].cells[tblDstToAddCol].innerHTML = "";     // meaning of word.
        }
    }

    if( bLd === false ) {
        if( timeOutId !== null ) {
            clearTimeout(timeOutId);            
        }

        enWordIndexElements();
    }
}


function resetBuffForNewPage(){
    if( parentMenu === menuReviewWords) {
        revWrdNums = [];        
        nextRevWdIx = 0;
    }

    revWords = [];
}

function wordIndexChanged(bRload) {
    try{
        var idx = document.getElementById('first_word_idx');
        //var val = Number(idx.innerText);
        var val = Number(idx.value);

        if( parentMenu === menuReviewWords) {
            tmpSelReviewDay = val;
            if( tmpSelReviewDay === reviewDay ) {
                if( bReviewCompleted === false ) {
                    //document.getElementById("btnReviewDone").hidden = false;
                    document.getElementById("btnReviewDone").disabled = false;
                }
            } else {
                //document.getElementById("btnReviewDone").hidden = true;
                document.getElementById("btnReviewDone").disabled = true;
            }
        }

        populateWordTable(val, bRload);

    } catch (err) {
        alert("Error in wordIndexChanged() !\r\n\tError: " + err.message);
    }
}

function newWordIndexTyped() {

    if( timeOutId !== null ) clearTimeout(timeOutId);
    disWordIndexElements(true);

    wordIndexChanged(false);

    timeOutId = setTimeout(enWordIndexElements, toDisWordIdexElements);
}

function disWordIndexElements(b) {
    document.getElementById('first_word_idx').disabled = b;
    document.getElementById('prePage').disabled = b;
    document.getElementById('nextPage').disabled = b;
}



function enWordIndexElements() {
    timeOutId = null;
    disWordIndexElements(false);
}



function getValidFirstWdIx(bNxt, val) {
    var m;

    if( bNxt === true ) {   // in showing next page.
        let v = val + tblRows;

        m = v % tblRows;

        if( m === 1 ) {
            val = v;
        } else {
            let d = (v - m) + 1;
            if( d > 0 ) val = d;
            else val = 1;
        }

    } else {    // in showing previous page.
        if( val > tblRows ) {
            m = val % tblRows;

            if( m === 1 ) {
                val -= tblRows;

            } else {
                val = (val - m) + 1;

                if( val < 1 ) val = 1;
            }

        } else val = 1;
    }

    return val;
}


function showPreviousPage() {
    let el = document.getElementById('first_word_idx');
    let val = Number(el.value);
    let val2 = val;

    if( parentMenu === menuReviewWords) {
        if( val > 0 ) {
            //document.write("1");
            val -= 1;
        } else {
            val = 0;
        }


    } else if( parentMenu === menuAddNewWords) { // '단어 추가' page
        // if( val > tblRows ) {
        //     //document.write(val - 30);
        //     val -= tblRows;

        // } else {
        //     //document.write("1");
        //     val = 1;
        // }

        val = getValidFirstWdIx(false, val);

    }
    
    if( val !== val2 ) {

        if( timeOutId !== null ) clearTimeout(timeOutId);
        disWordIndexElements(true);

        if( parentMenu === menuAddNewWords) clearWordSelection();

        //document.getElementById('first_word_idx').innerHTML = val;
        el.value = val.toString();
        
        //populateWordTable(val, false);        
        wordIndexChanged(false);
        
        timeOutId = setTimeout(enWordIndexElements, toDisWordIdexElements);
    }
}



function showNextPage() {
    var idx = document.getElementById('first_word_idx');
    //var val = Number(idx.innerText);
    var val = Number(idx.value);

    if( parentMenu === menuReviewWords) {
        val += 1;
        idx.value = val.toString();
        
        if( timeOutId !== null ) clearTimeout(timeOutId);
        disWordIndexElements(true);

        wordIndexChanged(false);
        
        timeOutId = setTimeout(enWordIndexElements, toDisWordIdexElements);
    } else if( parentMenu === menuAddNewWords) { // '단어 추가' page

        // //document.getElementById('prev_p_idx').innerHTML = val;    
        // val += tblRows;

        val = getValidFirstWdIx(true, val);

        if( val <= totNofWords ) {
            //idx.innerHTML = val;
            idx.value = val.toString();
            
            if( timeOutId !== null ) clearTimeout(timeOutId);
            disWordIndexElements(true);

            clearWordSelection();

            //populateWordTable(val, false);
            wordIndexChanged(false);            
            
            timeOutId = setTimeout(enWordIndexElements, toDisWordIdexElements);
            //document.getElementById('next_p_idx').innerHTML = val + tblRows;
        }

    }
}



function clearPickMarks() {
    let mt = document.getElementById('wdTbl');
    let hide = document.getElementById('chkDetails');

    for( var i = 0; i < curTblRows; i++) {
        document.getElementById("ckbSel" + i).checked = false;
        if( hide.checked == true ) mt.rows[i + 1].cells[tblDstMeaningCol].innerHTML = "" ;
        mt.rows[i + 1].cells[tblDstToAddCol].innerHTML = "" ;   //tblDstSelCol
    }
}



function hideShowWordDetails() {
    let hide = document.getElementById('chkDetails');
    let dst = document.getElementById('wdTbl');
    let src = document.getElementById(aVocaTable[vocaTblIdx]);
    let lbl = document.getElementById("lblDetails");
    //dst.rows[i+4].cells[1].
    //var subjectSel = document.getElementById("ddm" + i);
    let idx = document.getElementById('first_word_idx');
    //let val = Number(idx.innerText);
    let val = Number(idx.value);

    //if( hide. checked === true ) lbl.innerHTML = "Hide Details";
    //else lbl.innerHTML = "Show Details";

    for( let i = 0, j = 1; i < curTblRows; i++, j++) {
        
        if( (hide.checked === false) || (document.getElementById("ckbSel" + i).checked == true) ) {
            // var dIx = Number(dst.rows[j].cells[tblDstIxCol].innerText); // Word index number;            
            // dst.rows[j].cells[tblDstPronCol].innerHTML = src.rows[dIx - 1].cells[tblSrcPronCol].innerHTML;      // pronunciation.
            // dst.rows[j].cells[tblDstMeaningCol].innerHTML = src.rows[dIx - 1].cells[tblSrcMeaningCol].innerHTML; // meaning of word.
            if( i < revWords.length ) {
                dst.rows[j].cells[tblDstPronCol].innerHTML = revWords[i][0];      // pronunciation.
                dst.rows[j].cells[tblDstMeaningCol].innerHTML = revWords[i][1]; // meaning of word.
            } else {
                dst.rows[j].cells[tblDstPronCol].innerHTML = "";    // pronunciation.
                dst.rows[j].cells[tblDstMeaningCol].innerHTML = ""; // meaning of word.    
            }
        } else {
            dst.rows[j].cells[tblDstPronCol].innerHTML = "";    // pronunciation.
            dst.rows[j].cells[tblDstMeaningCol].innerHTML = ""; // meaning of word.
        }
    }
}



// rIx: row index number of the destination table. The 1st word's row index ix 0.
function viewOrSelectWord( rIx ) {

    if( rIx < curTblRows ) {
        let hide = document.getElementById('chkDetails');
        let dst = document.getElementById('wdTbl');
        let src = document.getElementById(aVocaTable[vocaTblIdx]);
        let i = rIx + 1;

        if( document.getElementById("ckbSel" + rIx).checked == true ) {

            if( rIx < revWords.length ) {            
                if(menuItemIdx == "1") {            // '단어 암기' page
                    dst.rows[i].cells[tblDstPronCol].innerHTML = revWords[rIx][0]; // pronunciation
                }

                dst.rows[i].cells[tblDstMeaningCol].innerHTML = revWords[rIx][1]; // meaning of word.
            } else {
                if(menuItemIdx == "1") {            // '단어 암기' page
                    dst.rows[i].cells[tblDstPronCol].innerHTML = "n/a"; // pronunciation
                }
                dst.rows[i].cells[tblDstMeaningCol].innerHTML = "n/a";  // meaning of word.
            }

            if(menuItemIdx == "2") {    // '단어 추가' page
                dst.rows[i].cells[tblDstToAddCol].innerHTML = dst.rows[i].cells[tblDstIxCol].innerHTML;     // 'to add'
            }
        } else {
            if( hide.checked === true ) {
                dst.rows[i].cells[tblDstPronCol].innerHTML = "";      // pronunciation
                dst.rows[i].cells[tblDstMeaningCol].innerHTML = "";   // meaning of word.
            }

            if(menuItemIdx == "2") {    // '단어 추가' page
                dst.rows[i].cells[tblDstToAddCol].innerHTML = "";     // 'to add'
            }
        }
    }
}



function vocaChanged() {
    vocaTblIdx = document.getElementById('vocaSel').selectedIndex;
    totNofWords = document.getElementById(aVocaTable[vocaTblIdx]).rows.length; 

    populateWordTable(document.getElementById("first_word_idx").value, false);
}



function updateSelectedWordList() {
    var wIxRev = document.querySelectorAll('.wordIxRev');
    var dst = document.getElementById('wdTbl');
    var src = document.getElementById(aVocaTable[vocaTblIdx]);
    

    for( var i = 0; i < curTblRows; i++, wIx++) {
        wIx = Number(wIxRev[i].value);
    
        if( wIx > 0 ) {
            wIx -= 1;
            dst.rows[i+4].cells[15].innerHTML = src.rows[wIx].cells[1].innerHTML; // word
            dst.rows[i+4].cells[17].innerHTML = src.rows[wIx].cells[3].innerHTML; // meaning of word.
        }
    }
}



function updateSelRevList(id) {
    var wIxRev = document.querySelectorAll('.wordIxRev');
    var dst = document.getElementById('wdTbl');
    var src = document.getElementById(aVocaTable[vocaTblIdx]);

    wIx = Number(wIxRev[id].value);

    if( wIx > 0 ) {
        wIx = wIx - 1;
        dst.rows[id+4].cells[15].innerHTML = src.rows[wIx].cells[1].innerHTML; // word
        dst.rows[id+4].cells[17].innerHTML = src.rows[wIx].cells[3].innerHTML; // meaning of word.
    }
}



function clearWordSelection() {
    let tbl = document.getElementById('wdTbl');
    let ln = tblRows + 1;
    for ( let i = 1; i < ln; i++ ) {
        tbl.rows[i].cells[tblDstSelCol].firstChild.checked = false;
    }
}


function pickSelectedWords() {
    const lst = [];
    let tbl = document.getElementById('wdTbl');
    //let dstIx = 3;
    let dstIx = -1;
    var wIxRev = document.querySelectorAll('.trNewWList');
    
    // Populate 'lst' with indics in the New Word List
    for ( let i = 0; i < curTblRows; i++ ) {
        //if( Number(tbl.rows[i].cells[11].innerText) > 0 ) {   // 'Word Indics for Review' has a valid number.
        if( Number(wIxRev[i+1].innerText) > 0 ) {   // 'Word Indics for Review' has a valid number.
            dstIx++;
            lst[dstIx] = wIxRev[i+1].innerText;
        }
    }

    dstIx++;    // it points to the first empty cell in the 'Word Indics for Review' column.

    
    for ( let i = 0; i < curTblRows; i++ ) {
        //if( Number(tbl.rows[i].cells[5].innerText) > 0 ) {   // 'Word Index To Add' has a valid number.
        if( tbl.rows[i+1].cells[tblDstSelCol].firstChild.checked == true ) {   // 'Word Index To Add' has a valid number.
            let j = 0;
            let ln = lst.length;
            //if( ln > curTblRows ) ln = curTblRows;

            for( ; j < ln; j++ ) {
                if( lst[j] === tbl.rows[i+1].cells[tblDstToAddCol].innerText ) break;
            }
            if ( j == ln ) {  // new number for the 'New Word List'.
                lst[dstIx] = tbl.rows[i+1].cells[tblDstToAddCol].innerText;

                // Make sure that new words to be added into the New Word List won't go beyond the last row in the table.
                if( dstIx < curTblRows) {
                    wIxRev[1+dstIx++].innerText = tbl.rows[i+1].cells[tblDstToAddCol].innerText;
                }
            }
        }
    }

    // Sorting the indics if necessary
    if( lst.length > 1 ) {
        let tmp = 0;
        let cnt = 0;
        let bChg = false;
        const n = [];

        for( let i = 0; i < lst.length; i++ ) {
            n[i] = Number(lst[i]);
        }

        // Get the sorting repeated the same number of time as the number of contents in the 'lst'.
        // So, that all the number in the 'lst' can be sorted in full.
        for( let i = 0; i < lst.length; i++ ) {
            bChg = false;

            for( let j = 1; j < lst.length; j++ ) {
                tmp = n[j-1];
                if( tmp > n[j] ) {
                    n[j-1] = n[j];
                    n[j] = tmp;
                    bChg = true;
                    cnt++;
                }
            }

            if( bChg === false ) {  // exit the for loop since all number in the array 'n' are sorted in ascending order already.
                break; 
            }
        }

        if( cnt > 0 ) { // Sorting took place.
            let ln = lst.length;
            if( ln > curTblRows ) ln = curTblRows;

            for( let i = 0; i < ln; i++ ) {
                wIxRev[1+i].innerText = n[i].toString();
            }
        }
    }

    if( lst.length > 0 ) document.getElementById("btnSavePicks").hidden = false;

    if( lst.length > curTblRows ) {
        window.alert("새 단어 목록이 꽉 찼습니다 !\r\n\r\n선택된 새 단어를 단어 암기장에 옮긴 후 다시 시도해 주세요!");
    }
}

function newWordOutOfRange() {
    var val = document.getElementById('txtIp30').value;
    if( Number(val) > 0 ) {
        document.getElementById('overflowWarn').hidden = false;
    } else {
        document.getElementById('overflowWarn').hidden = true;
    }
}

function savePickedWds() {

    var wIxRev = document.querySelectorAll('.trNewWList');
    let len = curTblRows + 1;
    let ct = 0;
    var v, d;

    v = getReviewDay();
    
    if( v >= 0 ) {
        reviewDay = v;

        // Populate 'lst' with indics in the New Word List
        for ( let i = 1; i < len; i++ ) {
            v = Number(wIxRev[i].innerText);
            //if( Number(tbl.rows[i].cells[11].innerText) > 0 ) {   // 'Word Indics for Review' has a valid number.
            if( isNaN(v) === false ) {   // 'Word Indics for Review' has a valid number.
                if( v > 0 ) {
                    d = reviewDay + 1;
                    localStorage.setItem(v.toString(), d.toString() + ":1:1");   // add the next review day.

                    //localStorage.setItem(reviewDayType + v.toString(), '0');      // add index to the next review day type
                    wIxRev[i].innerText = "";
                    ct++;
                }
            }
        }
        
        
        if( ct > 0 ) {
            if( (wdCnt === 0) || (revWrdCntToday === 0) ) { // words to be reviewed have been added either for the first time or when no word to review for today.
                reviewDone(false);
            }
            wdCnt += ct;
            localStorage.setItem("wdCnt", wdCnt.toString());
            clearPickMarks();
            document.getElementById('btnSavePicks').hidden = true;
            window.parent.postMessage(["wdCnt", wdCnt], "*");
        }
    }
}



function setNextReviewDay() {
    var a, v, t, ic;    
    let len = localStorage.length + 1;
    let i = 0;
    let n = 0;
    
    for( let j = 0; j < localStorage.length; j++ ) {
        //v = Number(localStorage.getItem(j.toString()));
        k = localStorage.key(j.toString());
        if( isNaN(k) === false ) {
            v = localStorage.getItem(k);
            a = v.split(":");
            if( a.length > 1 ) {
                if( isNaN(a[0]) === false ) {
                    v = Number(a[0]); // next review day index number.

                    if( (v > 0) && (v === reviewDay) ) { //tmpSelReviewDay
                        t = Number(a[1]); // next review day type
                        if( isNaN(t) === false ) {
                            if( t !== null ) {
                                if( t === aReviewType[0] ) { // 1
                                    if( a.length > 2 ) {
                                        ic = Number(a[2]);  // inc
                                        if( isNaN(ic) === false ) {
                                            if( ic !== null ) {                                                
                                                if( ic < aReviewType[3] ) { // < 3
                                                    n = ic + 1;
                                                    v++;
                                                } else if( ic === aReviewType[3] ) { // 3
                                                    t = aReviewType[3]; //3;
                                                    v += t;     // v += 3;
                                                }
                                                localStorage.setItem(k, v.toString() + ":" + t.toString() + ":" + n.toString());
                                            }
                                        }
                                    }
                                } else {    // t > 1
                                    for( i = 3; i < aReviewType.length; i++ ) {
                                        if( t === aReviewType[i] ) {
                                            //t = aReviewType[i+1];
                                            break;                                            
                                        }
                                    }

                                    if( i < aReviewType.length ) t = aReviewType[i+1];
                                    else t = aReviewType[aReviewType.length - 1];   // 1000

                                    // switch(t) {
                                    // case 3:     t = 7; break;
                                    // case 7:     t = 14; break;
                                    // case 14:    t = 28; break;
                                    // case 28:    t = 365; break;
                                    // }

                                    v += t;

                                    localStorage.setItem(k, v.toString() + ":" + t.toString());
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function setReviewDayUpdateRequest( bReq ) {
    try{
        
        localStorage.setItem("upReq", bReq.toString());

        if( bReq === true ) {
            var tDay = new Date();
            var y, m, d;
            //var nDay = tDay.setDate(tDay.getDate() + 1); // next day
            tDay.setDate(tDay.getDate() + 1); // next day
            y = tDay.getFullYear();
            m = tDay.getMonth();
            d = tDay.getDate();

            localStorage.setItem("rvYr", y);
            localStorage.setItem("rvMn", m);
            localStorage.setItem("rvDy", d); // not getDay() which is for a day of week (0~6).

            setNextReviewDay();
            m++; // month is 0 based number.
            expectedReviewDate = y.toString() + " " + m.toString() + " " + d.toString();
        }
    } catch (err) {
        alert("Error in saving the updated review day update request/date !\r\n\tError: " + err.message);
        return -1;
    }

    return 0;
}

function getReviewDay() {
    var v = 0;

    try {
        v = localStorage.getItem("rvDyIx");

        if( (isNaN(v) === true) || (v === null) ) {
            v = 0;
        } else {
            v = Number(v);
        }
        //tmpSelReviewDay = reviewDay;
    } catch (err) {
        alert("Error in reading the review day index !\r\n\tError: " + err.message);
        v = -4;
    }
    return v;
}


function updateReviewDay() {
    var tDay = new Date();
    var rYr, rMn, rDy, v, y, m, d;
    let bUd = false;    // Update reviewDay or not.
    var nDay = new Date();
    let bReq = false;
    let er = -1;
    nDay = nDay.setDate(tDay.getDate() + 1); // next day

    try {
        let b = localStorage.getItem("upReq");

        y = localStorage.getItem("rvYr");
        er = -2;
        m = localStorage.getItem("rvMn");
        er = -3;
        d = localStorage.getItem("rvDy");
        er = -4;

        if( b === "true" ) {
            bReq = true;

            //y = localStorage.getItem("rvYr");
            if( (isNaN(y) === true) || (y === null) ) {
                rYr = nDay.getFullYear();
                y = rYr.toString();
                er = -5;    
                localStorage.setItem("rvYr", y);
            } else {
                rYr = Number(y);
            }
    
            
            //m = localStorage.getItem("rvMn");
            if( (isNaN(m) === true) || (m === null) ) {
                rMn = nDay.getMonth();
                m = rMn.toString();
                er = -6;
                localStorage.setItem("rvMn", m);                    
            } else {
                rMn = Number(m);
            }

            //d = localStorage.getItem("rvDy");

            if( (isNaN(d) === true) || (d === null) ) {
                rDy = nDay.getDate(); // not getDay() which is for a day of week (0~6).
                d = rDy.toString();
                er = -7;
                localStorage.setItem("rvDy", d);    
            } else {
                rDy = Number(d);
            }
            
        } else if( b !== "false" ) { // the local store were never created.
            er = -8;
            localStorage.setItem("upReq", "false");
        }
    } catch (err) {
        alert("Error in accessing review date in local storage (" + er.toString() + ") !\r\n\tError: " + err.message);
        return er;
    }

    expectedReviewDate = "";

    v = getReviewDay();
    if( v < 0 ) return -4;
    else if ( v === 0 ) {
        try {
            localStorage.setItem("rvDyIx", v.toString());
        } catch (err) {
            alert("Error in reading the review day index !\r\n\tError: " + err.message);
            return -50;
        }
    }
    reviewDay = v;    

    if( bReq === true ) {   // update was requested

        v = tDay.getFullYear();     // year of today
        if( v > rYr) {
            bUd = true;
        } else if( v === rYr) {
            v = tDay.getMonth();    // month of today (0 ~ 11)

            if( v > rMn) {
                bUd = true;
            } else if( v == rMn) {
                v = tDay.getDate();  // day of today (1 ~ 31)

                if( v >= rDy) {
                    //if( tmpSelReviewDay > 0 ) 
                    bUd = true;
                }    
            }
        }

        if( bUd === true ) {    // needs to update the review day and date. 

            if( parentMenu === menuReviewWords ) {
                v = reviewDay + 1;

                try{
                    localStorage.setItem("rvDyIx", v.toString());

                    if( setReviewDayUpdateRequest(false) >= 0 ) { // done
                        reviewDay = v;
                        //tmpSelReviewDay = reviewDay;
                        bReq = false;
                    } else { // failed
                        localStorage.setItem("rvDyIx", reviewDay.toString()); // to restore
                    }

                } catch (err) {
                    alert("Error in saving the updated review day/date !\r\n\tError: " + err.message);
                    return -100;
                }
            }
        }
    }

    if( expectedReviewDate === "" ) {
        m++; // month is 0 based number.
        expectedReviewDate = y.toString() + " " + m.toString() + " " + d.toString();
    }
    //bReviewCompleted = bReq;
    //bReviewCompleted = false;
    return reviewDay;
}

function reviewDone(bFull) {
    if( setReviewDayUpdateRequest(true) >= 0 ) {
        document.getElementById("btnReviewDone").disabled = true;
        bReviewCompleted = true;
    } else {
        bReviewCompleted = false;
    }
    if( bFull === true ) {
        clearTable();
        resetBuffForNewPage();
    }
}

function deleteAllWords() {
    localStorage.clear();
}


function saveStorageVars() {
    if( parentMenu === menuSettings) {
        try {
            if( vocaTblIdx !== Number(localStorage.getItem("vTblIx")) ) {
                localStorage.setItem("vTblIx", vocaTblIdx.toString());
            }
        } catch (err) {
            alert("Error in saving the vocabulary table index !\r\n\tError: " + err.message);
        }
    } else if( parentMenu == menuAddNewWords) { // '단어 추가' page )
        try {
            if( firstWordIdx !== Number(localStorage.getItem("fsWdIx")) ) { // there was a change.
                try {
                    let v = localStorage.getItem("fsWdIx");
        
                    if( (isNaN(v) === false) && (v !== null) ) { // no local store exists.
                        localStorage.setItem("fsWdIx", firstWordIdx.toString());        
                    }
                } catch (err) {
                    alert("Error in reading the first index number !\r\n\tError: " + err.message);
                }
            }
        } catch (err) {
            alert("Failure in saving the first word index !\r\n\tMsg:" + err.message );
        }
    } else if( parentMenu == menuReviewWords) {
        DeleteSelectedWords();
    }
}




function getNextReviewDateHumanReadable() {
    var dt, v;
    try {
        v = localStorage.getItem("rvMn");

        if( (isNaN(v) === false) && (v !== null) ) {
            v = Number(v) + 1; // to convert human readable month.
            dt = localStorage.getItem("rvYr");
            dt += "-" + v.toString();
            dt += "-" + localStorage.getItem("rvDy");
        } else {
            dt = "n/a";
        }
    } catch (err) {
        dt = "N/A";
    }
    
    return dt;
}



// it is for 'Settings' menu only, especially when the Admin mode is enabled.
function dbgCmd(cmd, val) {
    switch(cmd) {            
    case 1:
        var v, dt;
        var tDay = new Date();

        localStorage.setItem("rvYr", tDay.getFullYear());
        localStorage.setItem("rvMn", tDay.getMonth());  // getMonth for 0 ~ 11
        localStorage.setItem("rvDy", tDay.getDate());   // getDate for 1 ~ 31 not getDay() which is for a day of week (0~6).

        v = tDay.getMonth() + 1; // To convert human readable format.
        
        let ix = localStorage.getItem('rvDyIx');
        if( isNaN(ix) === false ) {
            reviewDay = Number(ix);
        }
        window.parent.postMessage(["dbgRsp", cmd.toString(), val.toString(), tDay.getFullYear() + "-" + v.toString() + "-" + tDay.getDate()], "*");
        break;

    case 2:
        reviewDone(false);
        reviewDay++;
        localStorage.setItem("rvDyIx", reviewDay.toString());
        tmpSelReviewDay = reviewDay;        
        window.parent.postMessage(["dbgRsp", cmd.toString(), val.toString(), reviewDay.toString()], "*");
        break;
    
    case 3:    localStorage.setItem("fsWdIx", val.toString()); break;
    case 4:
        localStorage.clear(); // clear local storage (including the list of review words)
        vocaTblIdx = 0;            
        firstWordIdx = 1;
        reviewDay = 0;
        tmpSelReviewDay = 0;
        break;
    }

}



function getHeight() {
    return(document.getElementById("wdTbl").style.height);
}



window.onload = function() {
    //let tbl = document.getElementById("wdTbl");
    let nArg = getArguments();
    var v;

    if( bInit === false ) {
        if( nArg > 0 ) {
            lvInitialize(true, nArg);   // 'true' is to get the unconditional initialization carried out.

            // if( parentMenu === menuSettings) { // 'Settings' page
            //     let sel = document.getElementById("vocaSel").selectedIndex.toString();
            //     window.parent.postMessage(["vocaTable", sel], "*");
            // }
        }
        bInit = true;
    }
}



window.onbeforeunload = function() {
    saveStorageVars();
}



function lvInitialize(bOnload, nArg) {

    let bReInit = false;
    let bUTbl = false;  // Update Table
    let vT = -1;
    let vT2 = -1;

    if( bOnload === true ) {
        window.addEventListener("message", lvEventHandler); // must come before invoking wordIndexChanged().

        addMainTableRow(1, tblRows);
    }

    if( parentMenu === menuReviewWords ) {
        //if( (bOnload === true) || (bReInit === true) ) {
            vT = reviewDay;
            vT2 = updateReviewDay();

            if( reviewDay < 0 ) {
                return -1;
            }

            if( vT !== reviewDay ) {
                tmpSelReviewDay = vT;
                document.getElementById("first_word_idx").value = reviewDay.toString();
                bReInit = true;
            }

        //}
    } else {
        v = getReviewDay();
        if( v > 0 ) reviewDay = v;

        try {
            v = localStorage.getItem("fsWdIx");

            if( (isNaN(v) === true) || (v === null) ) { // no local store exists.
                firstWordIdx = 1;
                localStorage.setItem("fsWdIx", firstWordIdx.toString());
                document.getElementById('first_word_idx').value = firstWordIdx.toString();
                bReInit = true;
            } else { 
                vT = Number(v);
                if( vT !== firstWordIdx ) {
                    document.getElementById('first_word_idx').value = vT.toString();
                    bUTbl = true; //wordIndexChanged();
                    firstWordIdx = vT;
                } else {
                    vT = Number(document.getElementById('first_word_idx').value);
                    if( vT !== firstWordIdx ) {
                        document.getElementById('first_word_idx').value = firstWordIdx.toString();
                        bUTbl = true;
                    }
                }
            }
        } catch (err) {
            alert("Error in reading the first index number !\r\n\tError: " + err.message);
        }
    }

   

    try {            
        v = localStorage.getItem("vTblIx");

        if( (isNaN(v) === true) || (v === null) ) {
            vocaTblIdx = 0;
            localStorage.setItem("vTblIx", vocaTblIdx.toString());
            //document.getElementById('vocaSelSet').selectedIndex = vocaTblIdx;
            bReInit = true;
        
        } else { 
            vT = Number(v);
            if( vT !== vocaTblIdx ) { // there was a reset in the settings earlier.
                bUTbl = true;
            }

            vocaTblIdx = vT;
        }

        if( (bOnload === true) || (bReInit === true) || (bUTbl === true) ) document.getElementById("vocaSel").selectedIndex = vocaTblIdx;

    } catch (err) {
        alert("Error in reading the vocabulary table index !\r\n\tError: " + err.message);
    }

    try {
        v = localStorage.getItem("wdCnt");

        if( (isNaN(v) === true) || (v === null) ) {
            wdCnt = 0;
            localStorage.setItem("wdCnt", wdCnt.toString());
            bReInit = true;
        } else { 
            wdCnt = Number(v);
        }

    } catch (err) {
        alert("Error in reading the number of words in the review list !\r\n\tError: " + err.message);
    }


    //totNofWords = document.getElementById(aVocaTable[vocaTblIdx]).rows.length;

    if( (nArg > 0) && (bOnload === true) ) {
        if( parentMenu == menuReviewWords) {
            document.getElementById("wdPageIdx").innerText = "Review Day Index";
            document.getElementById("first_word_idx").min = "0";
            document.getElementById("first_word_idx").value = reviewDay.toString();
            document.getElementById("thSel").innerText = "View";
            
            hideClassForRvTable(0);

            if( wdCnt > 0 ) {
                window.parent.postMessage( ["expectedRvDay", expectedReviewDate], "*");
            }

            if( timeOutId !== null ) clearTimeout(timeOutId);
            disWordIndexElements(true);
            timeOutId = setTimeout(enWordIndexElements, toDisWordIdexElements);

        } else if( parentMenu == menuAddNewWords ) { // '단어 추가' page
            //document.getElementById("btnClrPick").hidden = false;
            document.getElementById("btnPickSelWordIx").hidden = false;
            //document.getElementById("btnSavePicks").hidden = false;
            document.getElementById("first_word_idx").min = "1";
            document.getElementById("first_word_idx").value = firstWordIdx.toString();
            //document.getElementById("vocaSelLbl").hidden = false;
            //document.getElementById("vocaSel").hidden = false;
            //document.getElementById("vocaSel").disabled = false;
            document.getElementById("btnReviewDone").hidden = true;
            //document.getElementById("btnDelAllWd").hidden = true;
            //document.getElementById("vocaSelLbl").hidden = false;
            
            hideClassForScanTable(0);

            if( timeOutId !== null ) clearTimeout(timeOutId);
            disWordIndexElements(true);
            timeOutId = setTimeout(enWordIndexElements, toDisWordIdexElements);

        } else if( parentMenu == menuSettings ) { // 'Settings' page
            //document.getElementById("btnClrPick").hidden = false;
            document.getElementById("btnPickSelWordIx").hidden = true;
            document.getElementById("btnSavePicks").hidden = true;
            document.getElementById("first_word_idx").min = "1";
            document.getElementById("first_word_idx").value = firstWordIdx.toString();
            //document.getElementById("vocaSelLbl").hidden = false;
            //document.getElementById("vocaSel").hidden = false;
            document.getElementById("vocaSel").disabled = true;
            document.getElementById("btnReviewDone").hidden = true;
            //document.getElementById("btnDelAllWd").hidden = true;
            document.getElementById("vocaSelLbl").hidden = true;
            
            hideClassForScanTable(0);
        }

    }

    if( bOnload === true ) {
        try {
                let v = Number(localStorage.getItem("pmExtTD"));

                if( (isNaN(v) === true) || (v === null) ) {
                    localStorage.setItem("pmExtTD", dftExtPostMsgTimeout.toString());
                    //postMsgTDly = dftPostMsgTimeout + dftExtPostMsgTimeout;
                } else {
                    postMsgTDly = v + dftPostMsgTimeout;
                }
        } catch (err) {
            alert("Error in accessing the postMessage extra time delay !\r\n\tError: " + err.message);
        }

        if( nArg > 0 ) {
            wordIndexChanged(false);
        }
    } else if( (bReInit === true) || (bUTbl === true) ) {
        //vocaChanged(false);
        wordIndexChanged(false);
    }

    //if( (bOnload === true) || (bReInit === true) ) 
}



function lvEventHandler(e) {
    var v;
    if( Array.isArray(e.data) === true ) {
         
        if( parentMenu === menuReviewWords ) {
            //wordIndexChanged(false);
            
            switch(e.data[0][0]) {
            case "vcTblInfo":
                for( let i = 1; i < e.data.length; i++ ) {
                    v = e.data[i][1];

                    switch(e.data[i][0]) {
                    case "nofTbl":
                        nofSrcTbl = Number.parseInt(v);
                        break;
                    case "totNofWd":
                        totNofWords = Number.parseInt(v);
                        break;
                    case "nofWdPerTbl":
                        nofWordsPerSrcTbl = Number.parseInt(v);
                        break;
                    }

                }

                v = 0;

                if( nofWordsPerSrcTbl > 0 ) {
                    tblInfoUdtCntDwn = 0;   // to stop unnecessary further table info request.

                    if( revWrdNums.length > 0 ) {
                        if( isNaN(revWrdNums[0]) === false ) {
                            let ifr = document.getElementById("ifTmpVcTbl");
                            setSourceTableIndex(revWrdNums[0]); // must be called after 'nofWordsPerSrcTbl' is initialized.

                            ifr.src = aVocaTable[vocaTblIdx] + "\\" + srcTblIx.toString() + ".htm";
                            setTimeout(cmdRevWordsFromSrcTble, postMsgTDly);
                            //ifr.contentWindow.postMessage(["getSrcTbl", firstWordIdx.toString()], "*");

                            v = 1;
                        }
                    }
                }

                if( v === 0 ) {
                    if( timeOutId !== null ) {
                        clearTimeout(timeOutId);
                        enWordIndexElements();
                    }
                }

                break;

            case "vcList":            
                let hide = document.getElementById('chkDetails');
                var dst = document.getElementById('wdTbl');
                //let cnt = 0;
                var i = 0, j = 0;
                var k;
                
                let src = e.data[1];
                let wIx = Number(e.data[0][1]);

                if( Array.isArray(src) === true ) {

                    totNofWords = Number(e.data[0][2]);
                    nofWordsPerSrcTbl = Number(e.data[0][3]);
                    
                    if( revWrdNums.length > 0 ) {
                        wIx = nextRevWdIx;
                        j = wIx + 1;

                        //for( i = 0; i < curTblRows; i++, wIx++) {
                        for( i = 0; i < src.length; i++, j++, wIx++) {
                            v = revWrdNums[wIx];
                            if( v >= totNofWords ) break;
                            if( j > curTblRows ) break;

                            dst.rows[j].cells[tblDstIxCol].innerHTML = v.toString(); // Word index number
                            dst.rows[j].cells[tblDstWordCol].innerHTML = src[i][0]; // word                            

                            revWords[wIx] = [src[i][1], src[i][2]];  // both pronunciation and the meaning of word.
                            
                            if( document.getElementById("ckbSel" + wIx).checked === true ) {
                                dst.rows[j].cells[tblDstPronCol].innerHTML = src[i][1]; // pronunciation
                                dst.rows[j].cells[tblDstMeaningCol].innerHTML = src[i][2]; // meaning of word.
                            } else if (hide.checked == false ) {
                                dst.rows[j].cells[tblDstPronCol].innerHTML = src[i][1]; // pronunciation
                                dst.rows[j].cells[tblDstMeaningCol].innerHTML = src[i][2]; // meaning of word.
                            }
                            
                        }

                        nextRevWdIx = wIx;
                    }

                    if( nextRevWdIx < revWrdNums.length) {
                        let ifr = document.getElementById("ifTmpVcTbl");

                        setSourceTableIndex(revWrdNums[nextRevWdIx]); // must come after 'nofWordsPerSrcTbl' is initialized.
                        ifr.src = aVocaTable[vocaTblIdx] + "\\" + srcTblIx.toString() + ".htm";
                        setTimeout(cmdRevWordsFromSrcTble, postMsgTDly);
                        //ifr.contentWindow.postMessage(["getSrcTbl", firstWordIdx.toString()], "*");

                    } else {
                        if( wIx > 0 ) v = wIx - 1;                        
                        setSourceTableIndex(revWrdNums[v]); // must come after 'nofWordsPerSrcTbl' is initialized.

                        if( timeOutId !== null ) {
                            clearTimeout(timeOutId);
                            enWordIndexElements();
                        }
                    }

                }
                break;
            }

        } else {
            
            switch(e.data[0][0]) {
            case "vcTblInfo":
                for( let i = 1; i < e.data.length; i++ ) {
                    v = e.data[i][1];

                    switch(e.data[i][0]) {
                    case "nofTbl":
                        nofSrcTbl = Number.parseInt(v);
                        break;
                    case "totNofWd":
                        totNofWords = Number.parseInt(v);
                        break;
                    case "nofWdPerTbl":
                        nofWordsPerSrcTbl = Number.parseInt(v);
                        break;
                    }

                }

                if( nofWordsPerSrcTbl > 0 ) {
                    let ifr = document.getElementById("ifTmpVcTbl");
                    setSourceTableIndex(firstWordIdx); // must be called after 'nofWordsPerSrcTbl' is initialized.

                    ifr.src = aVocaTable[vocaTblIdx] + "\\" + srcTblIx.toString() + ".htm";
                    setTimeout(cmdGetSourceTable, postMsgTDly);
                    //ifr.contentWindow.postMessage(["getSrcTbl", firstWordIdx.toString()], "*");
                } else if( timeOutId !== null ) {
                    clearTimeout(timeOutId);
                    enWordIndexElements();
                }
                break;

            case "vcList":            
                let hide = document.getElementById('chkDetails');
                var dst = document.getElementById('wdTbl');
                //let cnt = 0;
                var i = 0, j = 0;
                var k;
                
                let src = e.data[1];
                let wIx = Number(e.data[0][1]);

                if( firstWordIdx !== wIx ) {
                    console.log("the first word's index doesn't match !")
                    break;
                } else if( Array.isArray(src) === true ) {

                    totNofWords = Number(e.data[0][2]);
                    nofWordsPerSrcTbl = Number(e.data[0][3]);
                    
                    setSourceTableIndex(firstWordIdx); // must come after 'nofWordsPerSrcTbl' is initialized.

                    //for( i = 0; i < curTblRows; i++, wIx++) {
                    for( i = 0, j = 1; i < tblRows; i++, j++, wIx++) {
                        if(wIx >= totNofWords ) break;

                        dst.rows[j].cells[tblDstIxCol].innerHTML = wIx.toString(); // Word index number
                        dst.rows[j].cells[tblDstWordCol].innerHTML = src[i][0]; // word
                        // //dst.rows[j].cells[tblDstPronCol].innerHTML = src[i][1]; // pronunciation
                        // dst.rows[j].cells[tblDstMeaningCol].innerHTML = src[i][1]; // meaning of word.

                        revWords[i] = ["", src[i][1]];  // both pronunciation and the meaning of word.
                            
                        if( document.getElementById("ckbSel" + i).checked === true ) {
                            //dst.rows[j].cells[tblDstPronCol].innerHTML = src[i][1]; // pronunciation
                            dst.rows[j].cells[tblDstMeaningCol].innerHTML = src[i][1]; // meaning of word.
                        } else if (hide.checked == false ) {
                            //dst.rows[j].cells[tblDstPronCol].innerHTML = src[i][1]; // pronunciation
                            dst.rows[j].cells[tblDstMeaningCol].innerHTML = src[i][1]; // meaning of word.
                        }
                    }

                    if( timeOutId !== null ) {
                        clearTimeout(timeOutId);
                        enWordIndexElements();
                    }
                }

                break;
            }
        }
    } else {
        switch(e.data.msg) {
        case "review":
        case "scan":

            lvInitialize(false, 0); // 'false' is to prevent unconditional initialization from happening.
            break;

        case "save":
            saveStorageVars();
            break;
        case "resetBuf":
            if ( (parentMenu === menuReviewWords) || (parentMenu === menuAddNewWords) ) {
                resetBuf(false);
            }
            break;
        case "enAdmin":
            bAdmin = true; 
            v = getNextReviewDateHumanReadable();

            if( menuItemIdx === "1" ) {    // '단어 암기'
                document.getElementById('nxtRvDay2').innerText = v;
                document.getElementById('nxtRvDay').hidden = false;

                let tbl = document.getElementById('revWdIxTbl');
                if( tbl.rows.length > 1 ) {
                    tbl.hidden = false;
                }

            } else if( parentMenu === menuSettings ) {
                let ix = localStorage.getItem('rvDyIx');
                if( isNaN(ix) === false ) {
                    reviewDay = Number(ix);
                }
                
                window.parent.postMessage(["dbgRsp", "enAdmin", v, ix], "*");
            }
            break;

        case "disAdmin":
            bAdmin = false;
            // 'menuItemIdx' instead of 'menuItemVal' since it is admin related request. '2' for the New Word page.
            // if( menuItemIdx === "2" ) { // '단어 추가'
            //     document.getElementById('crvDt').innerText = "";
            //     document.getElementById('crvDtIx').innerText = "";                
            // } else             
            if( menuItemIdx === "1" ) {    // '단어 암기'
                document.getElementById('nxtRvDay2').innerText = "";
                document.getElementById('nxtRvDay').hidden = true;
                document.getElementById('revWdIxTbl').hidden = true;
            }
            break;

        case "lstRevWd":
            var a, j, k;
            let v2 = 0;
            let rwTl = document.getElementById("revWdIxTbl");
            //var revWrdNums = [];
            let len = localStorage.length + 1;
            let i = rwTl.rows.length;

            rwTl.hidden = false;

            if( i < len ) {
                for( ; i < len; i++ ) {  // not '<=' because one data row is there already.
                    let row = rwTl.insertRow();
                    for( j = 0; j < 4; j++) {
                        let c = row.insertCell(-1);
                        c.innerHTML = '&nbsp;'
                    }
                }
            }
            len = rwTl.rows.length;

            for( i = 0, j = 1; i < localStorage.length; i++) {
                if( j >= len ) break;
                
                k = localStorage.key(i.toString());
                if( isNaN(k) === false ) {
                    v = localStorage.getItem(k);
                    a = v.split(":");
                    rwTl.rows[j].cells[0].innerHTML = k;
                    rwTl.rows[j].cells[1].innerHTML = a[0];
                    rwTl.rows[j].cells[2].innerHTML = a[1];

                    if( a.length > 2 ) rwTl.rows[j].cells[3].innerHTML = a[2];
                    j++;
                }
            }
            break;
        case "dbgCmd":
                dbgCmd(e.data.val[0], e.data.val[1]);
                break;

        case "reload":
            if( (parentMenu === menuAddNewWords) || (parentMenu === menuReviewWords) ) { // not the 'Settings' page
                tblInfoUdtCntDwn = dftTblInfoUpdtCntDwn;
            //if( parentMenu === menuReviewWords ) {                
                wordIndexChanged(true);
            }
            break;

        case "getVocaTable":
            let sel = document.getElementById("vocaSel").selectedIndex.toString();
            window.parent.postMessage(["vocaTable", sel], "*");
            break;
        case "setVocaTable":
            try {

                //if( Array.isArray(e.data) === true ) {
                    vocaTblIdx = Number(e.data.val);
                    localStorage.setItem("vTblIx", vocaTblIdx.toString());

                    //document.getElementById("vocaSelSet").selectedIndex = vocaTblIdx; // the 2nd voca table selection option in the settings.
                    document.getElementById("vocaSel").selectedIndex = vocaTblIdx;
                //}
            } catch (err) {
                alert("Error in reading the vocabulary table index !\r\n\tError: " + err.message);
            }
            break;
        case "clearStorage":
            localStorage.clear();
            
            localStorage.setItem("vTblIx", vocaTblIdx.toString()); // to keep the voca table.
            break;

        case "setExtraTDely":
            try {
                    v = localStorage.getItem("pmExtTD");

                    if( (isNaN(v) === true) || (v === null) ) {
                        v = e.data.val;
                    } else {
                        v = Number(v);
                        if( v !== e.data.val ) v = e.data.val;
                    }
                    
                    v += dftPostMsgTimeout;

                    if( ( v < 0 ) || (v === null) ) {
                        v = dftPostMsgTimeout + dftExtPostMsgTimeout;
                    }

                    if( parentMenu == menuSettings ) {
                        if( v !== postMsgTDly ) {
                            localStorage.setItem("pmExtTD", e.data.val.toString());
                        }
                    }
                    
                    postMsgTDly = v;
            } catch (err) {
                alert("Error in accessing the postMessage extra time delay !\r\n\tError: " + err.message);
            }
        }
    }
    //console.log(e.data);
}