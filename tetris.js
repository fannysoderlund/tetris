
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const playButton = document.getElementById('gameStatus');

context.scale(18, 18)

const tetrominos = [
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0]

  ],

  [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1]

  ],

  [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0]

  ],

  [
    [1, 1],
    [1, 1]

  ],

  [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]

  ],

  [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]

  ],

  [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0]

  ],


];

const gameBoard = generateGameboard(12, 22);

const currentTetromino = {
  offset: { x: 5, y: -1 },
  tetromino: tetrominos[5]
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
        gameBoard[y + currentTetromino.offset.y][x + currentTetromino.offset.x] = value;
      }
    });
  });
}

function drawTetromino(tetrominoNumber, offset) {
  tetrominoNumber.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = '#43AA8B';
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') {
    currentTetromino.offset.x--;
  } else if (event.key === 'ArrowRight') {
    currentTetromino.offset.x++;
  } else if (event.key === 'ArrowDown') {
    dropTetromino();
  }
});

function dropTetromino() {
  currentTetromino.offset.y++;
  if (collide(gameBoard, currentTetromino)) {
    console.log('collide')
    currentTetromino.offset.y--;
    populateGameBoard(gameBoard, currentTetromino);
    currentTetromino.offset.y = -1;
  }

  dropCounter = 0;
}

let lastTime = 0;
let dropCounter = 0;

function play(time = 0) {
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
  requestAnimationFrame(play);
}


playButton.addEventListener('click', () => {
  play();
});

