/* version: 1.0          last update: Dec. 26, 2022 */
//// for index.htm and LearnVoca_FCurve.htm
const menuReviewWords = "learnVoca";
const menuAddNewWords = "scanWord";
const menuSettings = "setting";
const menuIntro    = "intro"
//// for the tables in both '단어 암기' and '단어 추가'
const tblRows = 15;
const tblCols = 9;

const tblDstIxCol = 0;      // Index number column in the destination table
const tblDstSelCol = 1;     // Sel/Show column in the destination table
const tblDstWordCol = 2;    // Word column in the destination table
const tblDstPronCol = 3;    // pronunciation column in the destination table
const tblDstMeaningCol = 4; // 'Meaning of Word' column in the destination table
const tblDstToAddCol = 5;   // To Add column in the destination table
//const tblDstSpace1Col = 6;  // 'Space 1' column in the destination table
const tblDstNewWdListCol = 7; // 'New Word List' column in the destination table

//// For the tables in each vocabulary htm.
const tblSrcIxCol = 0;      // Index number column in the destination table
const tblSrcWordCol = 1;    // Word column in the destination table
const tblSrcPronCol = 2;    // pronunciation column in the destination table
const tblSrcMeaningCol = 3; // Meaning of word column in the destination table

const dftPostMsgTimeout     = 300;  // 300 msec.
const dftExtPostMsgTimeout  = 300;  // 300 msec. In my experiment, 600 msec of the total timeout is the best.

//const aVocaTable = ["toeic840_table", "voca220_table"];
const aVocaTable = ["esyL1", "itmL1", "itmL2", "advL1"];
