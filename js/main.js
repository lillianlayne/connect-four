// constants
const your = "#E8704E";
const computer = "#F5CC51";

const COLORS = {
  0: "#f3ede1",
  1: your,
  "-1": computer,
};

// state variables
let board; // array of 7 column arrays
let turn; // 1 or -1
let winner; // null = no winner, or 1 or -1 = winner; 'tie' = 'T'

// cached elements
const messageEl = document.querySelector("h1");
const playAgainBtn = document.querySelector("button");
const markerEls = [...document.querySelectorAll("#markers > div")];
const boardEls = [...document.querySelectorAll("#board > div")];

// event listeners
document.getElementById("markers").addEventListener("click", handledrop);
playAgainBtn.addEventListener("click", init);
document.getElementById('board').addEventListener('click', handleBoard);
// functions



function render() {
  renderBoard();
  renderMessage();
  // hide/show UI elements (controls)
  renderControls();
  console.log(turn)
}

function renderBoard() {
  board.forEach((colArr, colIdx) => {
    // iterate over the cells in the current column (colArr)
    colArr.forEach((cellVal, rowIdx) => {
      const cellId = `c${colIdx}r${rowIdx}`;
      const cellEl = document.getElementById(cellId);
      cellEl.style.background = COLORS[cellVal];
    });
  });
}

function renderMessage() {
  // if a tie
  if (winner === "T") {
    messageEl.innerHTML = "It's a Tie!!!";
  } else if (winner) {
    if (winner !== 1) {
      messageEl.innerHTML = `<span style="color: ${COLORS[winner]}"> You Won!`;
    } else {
      messageEl.innerHTML = `<span style="color: ${COLORS[winner]}"> Computer Won!`;
    }
  } else {
    // if the game is in play
    if (turn === 1) {
      messageEl.innerHTML = `<span style="color: ${COLORS[turn]}"> Your Turn`;
    } else {
      messageEl.innerHTML = `<span style="color: ${COLORS[turn]}"> Computers Turn`;
    }
  }
}

function renderControls() {
  // ternary expression is the fo to when you want 1 of 2 values returned
  // render button
  playAgainBtn.style.visibility = winner ? "visible" : "hidden";
  // iterate over the over the marker elements to hide/show according to the column being full (no 0's) or not

  markerEls.forEach(function (markerEl, colIdx) {
    const hideMarker = !board[colIdx].includes(0) || winner;
    markerEl.style.visibility = hideMarker ? "hidden" : "visible";
  });


}



function getWinner(colIdx, rowIdx) {
  return checkVerticalWin(colIdx, rowIdx) || 
  checkHorizontalWin(colIdx, rowIdx) ||
  checkDiagonalWinNE(colIdx, rowIdx) ||
  checkDiagonalWinSW(colIdx, rowIdx)
  ;

}
function checkDiagonalWinSW(colIdx, rowIdx) {
    const adjCountNE = countAdjacent(colIdx, rowIdx, -1, 1);
    const adjCountSW = countAdjacent(colIdx, rowIdx, 1, -1);

    return (adjCountNE + adjCountSW) >= 3 ? board[colIdx, rowIdx] : null;
}

function checkDiagonalWinNE(colIdx, rowIdx) {
    const adjCountNE = countAdjacent(colIdx, rowIdx, 1, 1);
    const adjCountSW = countAdjacent(colIdx, rowIdx, -1, -1);

    return (adjCountNE + adjCountSW) >= 3 ? board[colIdx, rowIdx] : null;
}


function checkHorizontalWin(colIdx, rowIdx) {
    const adjCountLeft = countAdjacent(colIdx, rowIdx, -1, 0);
    const adjCountRight = countAdjacent(colIdx, rowIdx, 1, 0);

    return (adjCountLeft + adjCountRight) >= 3 ? board[colIdx, rowIdx] : null;
}

function checkVerticalWin(colIdx, rowIdx) {
  return countAdjacent(colIdx, rowIdx, 0, -1) === 3
    ? board[colIdx, rowIdx] : null;
}

function countAdjacent(colIdx, rowIdx, colOffset, rowOffset) {
  // shortcut to player value's variable
  const player = board[colIdx][rowIdx];
  // track count of adjacent cells with the same player value
  let count = 0;
  // init new coordinates
  colIdx += colOffset;
  rowIdx += rowOffset;

  while (
    // ensure colIdx is within bounds of the board array
    board[colIdx] !== undefined &&
    board[colIdx][rowIdx] !== undefined &&
    board[colIdx][rowIdx] === player
  ) {
    count++;
    colIdx += colOffset;
    rowIdx += rowOffset;
  }
  return count;
}

function handledrop(event) {
  let e = event.target;
  const colIdx = markerEls.indexOf(e);
  // console.log('colIdx', colIdx);
  // gaurds
  if (colIdx === -1) return;

  const colArr = board[colIdx];
  // console.log('colArr', colArr);
  const rowIdx = colArr.indexOf(0);
  // console.log('rowIdx', rowIdx);
  colArr[rowIdx] = turn;
  // console.log('colArr[rowIdx]', colArr);

  turn *= -1;

  winner = getWinner(colIdx, rowIdx);
  render();
}



function handleBoard(event) {
  let e = event.target;
  const boardElArr = [];
  
  // check the id of the clicked div
  // drop the color in the first div that contains a 0 in the column of the clciked div
  for (let i = 0; i < boardEls.length; i+= 7) {
    boardElArr.push(boardEls.slice(i, i + 7))
  }
  boardElArr.reverse();
  let colIdx;
 
  for (let boardIdx of boardElArr) {
    if (boardIdx.includes(e)) {
      colIdx = boardIdx.indexOf(e)
    }
  }

  if (colIdx === -1) return;

 const colArr = board[colIdx];
 const rowIdx = colArr.indexOf(0);
 colArr[rowIdx] = turn;

 turn *= -1;
 winner = getWinner(colIdx, rowIdx)
if (turn !== 1) {
  setTimeout(() => {
    getComputerAction();
  }, 1000)
}
  render();
}

function getComputerAction() {

  if (winner) return;

  const colIdx = Math.floor(Math.random() * 6); 
  const colArr = board[colIdx];
  rowIdx = colArr.indexOf(0);
  colArr[rowIdx] = turn;
  turn *= -1;
  winner = getWinner(colIdx, rowIdx)
  render();


}




function init() {
  board = [
    [0, 0, 0, 0, 0, 0], // col 0
    [0, 0, 0, 0, 0, 0], // col 1
    [0, 0, 0, 0, 0, 0], // col 2
    [0, 0, 0, 0, 0, 0], // col 3
    [0, 0, 0, 0, 0, 0], // col 4
    [0, 0, 0, 0, 0, 0], // col 5
    [0, 0, 0, 0, 0, 0], // col 6
  ];

  turn = 1;
  winner = null;

  render();
}

init();
