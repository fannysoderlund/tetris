
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const playButton = document.getElementById('gameStatus');
const scoreLabel = document.getElementById('scoreLabel');
const scoreCounter = document.getElementById('scoreCounter');
const colorPicker = document.getElementById('colorPicker');
const dropDownColor = document.getElementById('dropdown-content');
const dropDownDiv = document.getElementById('dropdown');

context.scale(18, 18)

const tetrominos = [
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0]

  ],

  [
    [0, 2, 0],
    [0, 2, 0],
    [0, 2, 2]

  ],

  [
    [0, 3, 0],
    [0, 3, 0],
    [3, 3, 0]

  ],

  [
    [4, 4],
    [4, 4]

  ],

  [
    [5, 5, 0],
    [0, 5, 5],
    [0, 0, 0]

  ],

  [
    [0, 6, 6],
    [6, 6, 0],
    [0, 0, 0]

  ],

  [
    [0, 0, 0],
    [7, 7, 7],
    [0, 7, 0]

  ],


];

let currentColorScheme = 'standard';

let gameOverBool = false;

const colorsStandard = ['#1C1C1C', '#43AA8B', '#4D908E', '#90BE6D', '#F3722C', '#F8961E', '#F9844A', '#F9C74F'];
const colorsPastel = ['#1C1C1C', '#BEE1E6', '#DFE7FD', '#E2ECE9', '#E3FDDF', '#FDE2E4', '#FDF8DF', '#FFF1E6'];
const colorsForest = ['#1C1C1C', '#65442F', '#656C52', '#848382', '#9DA385', '#C3A580', '#C8875D', '#E2D5BE'];
const colorsOldSchool = ['#1C1C1C', '#00E4FF', '#06FF30', '#9C1FFF', '#EBFF00', '#FA00FF', '#FF4A02', '#FFB800'];

let score = 0;

const gameBoard = generateGameboard(13, 22);

const currentTetromino = {
  offset: { x: 5, y: -1 },
  tetromino: tetrominos[Math.floor(Math.random() * 7)]
}

function collide(gameBoard, currentTetromino) {
  const [t, o] = [currentTetromino.tetromino, currentTetromino.offset];
  for (let y = 0; y < t.length; ++y) {
    for (let x = 0; x < t[y].length; ++x) {
      if (t[y][x] !== 0 &&
        (gameBoard[y + o.y] && gameBoard[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

function generateGameboard(width, height) {
  const matrix = [];
  while (height--) {
    matrix.push(new Array(width).fill(0));
  }
  return matrix;
}

function populateGameBoard(gameBoard, currentTetromino) {
  currentTetromino.tetromino.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        try {
          gameBoard[y + currentTetromino.offset.y][x + currentTetromino.offset.x] = value;
        } catch (TypeError) {
          currentTetromino.offset.x = 5;
        }
      }
    });
  });
}

function drawTetromino(tetrominoNumber, offset) {
  tetrominoNumber.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        switch (currentColorScheme) {
          case 'forest':
            context.fillStyle = colorsForest[value];
            break;
          case 'pastel':
            context.fillStyle = colorsPastel[value];
            break;
          case 'oldSchool':
            context.fillStyle = colorsOldSchool[value];
            break;
          default:
            context.fillStyle = colorsStandard[value];
        }
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') {
    moveTetromino(-1);
  } else if (event.key === 'ArrowRight') {
    moveTetromino(1);
  } else if (event.key === 'ArrowDown') {
    dropTetromino();
  } else if (event.key === 'ArrowUp') {
    rotate(currentTetromino.tetromino);
  }
});

function moveTetromino(offset) {
  currentTetromino.offset.x += offset;
  if (collide(gameBoard, currentTetromino)) {
    currentTetromino.offset.x -= offset;
  }
}

function dropTetromino() {
  currentTetromino.offset.y++;
  if (collide(gameBoard, currentTetromino)) {
    currentTetromino.offset.y--;
    populateGameBoard(gameBoard, currentTetromino);
    currentTetromino.offset.y = 0;
    newTetromino();
  }
  dropCounter = 0;
}

function newTetromino() {
  currentTetromino.offset.x = 5;
  currentTetromino.tetromino = tetrominos[Math.floor(Math.random() * 7)]
  if (collide(gameBoard, currentTetromino)) {
    gameOver();
  }
}

function rotate(tetromino) {
  for (let y = 0; y < tetromino.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [
        tetromino[x][y],
        tetromino[y][x]
      ] = [
          tetromino[y][x],
          tetromino[x][y]
        ];
    }
  }
  tetromino.reverse();
  let offset = 1;
  while (collide(gameBoard, currentTetromino)) {
    currentTetromino.offset.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
  }
}

let lastTime = 0;
let dropCounter = 0;

function play(time = 0) {
  if (localStorage.getItem("colorScheme") != null) {
    currentColorScheme = localStorage.getItem("colorScheme");
  }
  context.fillStyle = '#1C1C1C';
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawTetromino(gameBoard, { x: 0, y: 0 });

  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > 1000) {
    dropTetromino();
  }

  drawTetromino(currentTetromino.tetromino, currentTetromino.offset);
  if (!gameOverBool) {
    requestAnimationFrame(play);
  } else {
    gameBoard.forEach(row => row.fill(0));
    context.fillStyle = '#1C1C1C';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function gameOver() {
  gameOverBool = true;
  playButton.style.color = 'white';
  playButton.style.pointerEvents = 'all';
  playButton.style.cursor = 'pointer';
  playButton.innerHTML = 'GAME<br>OVER';
  scoreLabel.innerHTML = 'HIGHSCORE';
  colorPicker.style.color = 'white';
  colorPicker.style.pointerEvents = 'all';
  dropDownDiv.style.pointerEvents = 'all';
}

function pickColorScheme(colorScheme) {
  currentColorScheme = colorScheme;
  localStorage.setItem("colorScheme", colorScheme);
}

playButton.addEventListener('click', () => {
  gameOverBool = false;
  playButton.style.color = '#1C1C1C';
  playButton.style.pointerEvents = 'none';
  playButton.style.cursor = 'none';
  scoreLabel.innerHTML = 'SCORE';
  colorPicker.style.color = '#1C1C1C';
  colorPicker.style.pointerEvents = 'none';
  dropDownDiv.style.pointerEvents = 'none';
  play();
});

