let BOARD_WIDTH = 20;
let BOARD_HEIGHT = 20;
let INTERVAL = 550;
// const DIRECTIONS = { 0: "stop", 1: "up", 2: "left", 3: "down", 4: "right" };
const DIRECTIONS_INFO = { stop: 0, up: 1, left: 2, down: 3, right: 4 };

let gameRunning = false;
let gameLost = false;
let direction = 0;
let moves = 0;

let r = document.querySelector(":root");
r.style.setProperty("--width", BOARD_WIDTH);
r.style.setProperty("--height", BOARD_HEIGHT);

let snake = [
  { y: 10, x: 10, direction: DIRECTIONS_INFO.stop },
  { y: 10, x: 11, direction: DIRECTIONS_INFO.stop },
  { y: 10, x: 12, direction: DIRECTIONS_INFO.stop },
];

let food = { x: -1, y: -1 };
let score = 0;
document.getElementById("score").innerText = score;

generateFood();
redrawBoard();

function gameStart() {
  moves = 0;
  let interval = setInterval(() => {
    if (!gameRunning) {
      clearInterval(interval);
    } else {
      moveSnake();
      checkLoose();
      if (!gameLost) {
        redrawBoard();
      }
    }
  }, INTERVAL);
}

function redrawBoard() {
  if (gameRunning) document.getElementById("btnRestart").innerText = "Restart";
  const board = document.getElementById("board");
  board.innerHTML = "";

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      const pos = snake.find((element) => element.x == x && element.y == y);
      const divPos = document.createElement("div");
      divPos.className = "dot";
      if (pos) {
        divPos.classList.add("snake");
        if (snake[0].x == x && snake[0].y == y) {
          divPos.classList.add("snake-head");
          const head = document.createElement("div");
          head.className = "snake-head-left";

          switch (direction) {
            case DIRECTIONS_INFO.up:
              head.className = "snake-head-up";
              break;
            case DIRECTIONS_INFO.left:
              head.className = "snake-head-left";
              break;
            case DIRECTIONS_INFO.right:
              head.className = "snake-head-right";
              break;
            case DIRECTIONS_INFO.down:
              head.className = "snake-head-down";
              break;
          }
          divPos.appendChild(head);
        }
      } else if (y === food.y && x === food.x) {
        divPos.classList.add("food");
      } else {
        divPos.classList.add("blank");
      }
      board.appendChild(divPos);
    }
  }
}
// const boardEl = document.getElementById("board");
window.addEventListener("keydown", (e) => {
  eventKeyPressed(e.key);
});

function eventKeyPressed(keyPressed) {
  let dir = 0;
  const keysAllowed = [
    "w",
    "a",
    "s",
    "d",
    "ArrowUp",
    "ArrowLeft",
    "ArrowDown",
    "ArrowRight",
  ];

  if (!keysAllowed.find((key) => key == keyPressed)) {
    return;
  }

  if (snake[0].direction === DIRECTIONS_INFO.stop) {
    keyPressed = "a";
  }

  console.log("Key:", keyPressed);

  switch (keyPressed) {
    case "w":
    case "ArrowUp":
      if (snake[0].direction !== DIRECTIONS_INFO.down)
        direction = DIRECTIONS_INFO.up;
      break;
    case "a":
    case "ArrowLeft":
      if (snake[0].direction !== DIRECTIONS_INFO.right)
        direction = DIRECTIONS_INFO.left;
      break;
    case "s":
    case "ArrowDown":
      if (snake[0].direction !== DIRECTIONS_INFO.up)
        direction = DIRECTIONS_INFO.down;
      break;
    case "d":
    case "ArrowRight":
      if (snake[0].direction !== DIRECTIONS_INFO.left)
        direction = DIRECTIONS_INFO.right;
      break;
    default:
      break;
  }

  if (!gameRunning) {
    gameRunning = true;
    gameLost = false;
    gameStart();
  }
}

function moveSnake() {
  const head = snake[0];

  let newPos = {};
  // Verifica sentido
  switch (direction) {
    case DIRECTIONS_INFO.up:
      newPos = { y: head.y - 1, x: head.x, direction: direction };
      snake.unshift(newPos);
      break;
    case DIRECTIONS_INFO.down:
      newPos = { y: head.y + 1, x: head.x, direction: direction };
      snake.unshift(newPos);
      break;
    case DIRECTIONS_INFO.left:
      newPos = { y: head.y, x: head.x - 1, direction: direction };
      snake.unshift(newPos);
      break;
    case DIRECTIONS_INFO.right:
      newPos = { y: head.y, x: head.x + 1, direction: direction };
      snake.unshift(newPos);
      break;
  }

  if (newPos.x === food.x && newPos.y === food.y) {
    score++;
    document.getElementById("score").innerText = score;
    generateFood();
  } else {
    snake.pop();
  }
}

function checkLoose() {
  if (
    snake[0].x < 0 ||
    snake[0].y < 0 ||
    snake[0].x > BOARD_WIDTH - 1 ||
    snake[0].y > BOARD_HEIGHT - 1
  ) {
    setLost();
  } else {
    snake.map((snkElement, idx) => {
      const fail = snake.some((element, idx2) => {
        return (
          snkElement.x === element.x &&
          snkElement.y === element.y &&
          idx != idx2
        );
      });
      if (fail) {
        setLost();
      }
    });
  }
}

function logSnake(snk) {
  console.log(snk.length, "---->");
  if (Array.isArray(snk)) {
    snk.map((ele) => {
      console.log(
        "Y:",
        ele.y,
        "X:",
        ele.x,
        "Direction:",
        Object.keys(DIRECTIONS_INFO)[ele.direction]
      );
    });
  } else {
    console.log(
      "Y:",
      snk.y,
      "X:",
      snk.x,
      "Direction:",
      Object.keys(DIRECTIONS_INFO)[snk.direction]
    );
  }
  console.log("<----");
}

function setLost() {
  gameRunning = false;
  gameLost = true;
  const snk = Array.from(document.getElementsByClassName("snake"));

  snk.map((element) => {
    element.classList.add("snake-lost");
  });
}

function restart() {
  score = 0;
  document.getElementById("score").innerText = score;
  const board = document.getElementById("board");
  board.focus({ focusVisible: false });
  //   document.activeElement = null;

  console.log(document.activeElement);

  gameRunning = false;
  gameLost = false;
  direction = 0;

  const posX = Math.floor(BOARD_WIDTH / 2);
  const posY = Math.floor(BOARD_HEIGHT / 2);

  snake = [
    { y: posY, x: posX, direction: DIRECTIONS_INFO.stop },
    { y: posY, x: posX + 1, direction: DIRECTIONS_INFO.stop },
    { y: posY, x: posX + 2, direction: DIRECTIONS_INFO.stop },
  ];

  generateFood();

  redrawBoard();
}

function generateFood() {
  let posSuccess = false;

  while (!posSuccess) {
    food.x = Math.floor(Math.random() * BOARD_WIDTH);
    food.y = Math.floor(Math.random() * BOARD_HEIGHT);

    const checkFood = snake.find((ele) => {
      return ele.x == food.x && ele.y == food.y;
    });

    if (!checkFood) {
      posSuccess = true;
    }
  }
}

function changeLevel(e) {
  let int = 1050 - e.value * 100;

  INTERVAL = int;
  console.log(INTERVAL);
  gameRunning = false;
  restart();
}

function changeLargura(e) {
  BOARD_WIDTH = e.value;

  r = document.querySelector(":root");
  r.style.setProperty("--width", BOARD_WIDTH);
  gameRunning = false;
  redrawBoard();
}

function changeAltura(e) {
  BOARD_HEIGHT = e.value;
  console.log(BOARD_HEIGHT);

  r = document.querySelector(":root");
  r.style.setProperty("--height", BOARD_HEIGHT);
  gameRunning = false;
  redrawBoard();
}

function btnArrowPressed(btn) {
  console.log(btn.id);
  eventKeyPressed(btn.id);
}
