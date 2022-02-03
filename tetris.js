
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

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

function drawTetromino(tetrominoNumber, offset) {
  tetrominos[tetrominoNumber].forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = '#43AA8B';
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

const currentTetromino = {
  offset: { x: 5, y: 2 },
  tetromino: 5
}

let lastTime = 0;
let dropCounter = 0;
function play(time = 0) {
  context.fillStyle = '#1C1C1C';
  context.fillRect(0, 0, canvas.width, canvas.height);

  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > 1000) {
    currentTetromino.offset.y++;
    dropCounter = 0;
  }

  drawTetromino(currentTetromino.tetromino, currentTetromino.offset);
  requestAnimationFrame(play);
}

play();
