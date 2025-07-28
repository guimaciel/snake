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

window.mobileAndTabletCheck = function () {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);

  return check;
};

const arrowBtnsDiv = document.getElementById("controllers-col-left");

if (mobileAndTabletCheck()) {
  arrowBtnsDiv.style.display = "inline";
} else {
  arrowBtnsDiv.style.display = "none";
}
