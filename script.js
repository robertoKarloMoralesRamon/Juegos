const menu = document.getElementById("menu");
const juego = document.getElementById("juego");
const btnRegresar = document.getElementById("regresar");
let juegoActivo = null; // para intervals/loops
let animationId = null;
let keyHandlerBackup = null;

function mostrarJuego(nombre) {
  // limpiar cualquier estado previo
  limpiarGlobal();
  menu.classList.add("oculto");
  juego.classList.remove("oculto");
  btnRegresar.classList.remove("oculto");

  switch (nombre) {
    case "piedraPapelTijera": piedraPapelTijera(); break;
    case "adivinaNumero": adivinaNumero(); break;
    case "memorama": memorama(); break;
    case "snake": snake(); break;
    case "juegoSalto": juegoSalto(); break;
    case "buscaminas": buscaminas(); break;
    case "ticTacToe": ticTacToe(); break;
    case "pong": pong(); break;
    case "breakout": breakout(); break;
    case "spaceShooter": spaceShooter(); break;
    default:
      juego.innerHTML = "<p>Juego no encontrado.</p>";
  }
}

function regresarMenu() {
  limpiarGlobal();
  juego.classList.add("oculto");
  btnRegresar.classList.add("oculto");
  menu.classList.remove("oculto");
  juego.innerHTML = "";
}

function limpiarGlobal() {
  // clear interval, animation frames, event handlers
  if (juegoActivo) {
    clearInterval(juegoActivo);
    juegoActivo = null;
  }
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  // quitar listeners de teclado
  document.onkeydown = null;
  document.onkeyup = null;
  document.onkeypress = null;
  // evitar contexto por defecto (buscaminas)
  document.oncontextmenu = null;
}

/* === 🕹️ Piedra, Papel o Tijera === */
function piedraPapelTijera() {
  juego.innerHTML = `
    <h2>🪨 Piedra, Papel o Tijera</h2>
    <div>
      <button onclick="jugar('piedra')">🪨</button>
      <button onclick="jugar('papel')">📄</button>
      <button onclick="jugar('tijera')">✂️</button>
    </div>
    <p id="resultado"></p>
  `;
}

function jugar(eleccionJugador) {
  const opciones = ["piedra", "papel", "tijera"];
  const eleccionPC = opciones[Math.floor(Math.random() * 3)];
  let resultado;

  if (eleccionJugador === eleccionPC) resultado = "Empate 😐";
  else if (
    (eleccionJugador === "piedra" && eleccionPC === "tijera") ||
    (eleccionJugador === "papel" && eleccionPC === "piedra") ||
    (eleccionJugador === "tijera" && eleccionPC === "papel")
  ) resultado = "¡Ganaste! 🎉";
  else resultado = "Perdiste 💀";

  document.getElementById("resultado").innerText =
    `Elegiste ${eleccionJugador}, la PC eligió ${eleccionPC}. ${resultado}`;
}

/* === 🎯 Adivina el Número === */
function adivinaNumero() {
  const numeroSecreto = Math.floor(Math.random() * 100) + 1;
  juego.innerHTML = `
    <h2>🎯 Adivina el Número (1-100)</h2>
    <input id="guess" type="number" placeholder="Tu número">
    <button onclick="verificarNumero(${numeroSecreto})">Probar</button>
    <p id="pista"></p>
  `;
}

function verificarNumero(secreto) {
  const intento = parseInt(document.getElementById("guess").value);
  const pista = document.getElementById("pista");

  if (Number.isNaN(intento)) {
    pista.innerText = "Introduce un número válido.";
    return;
  }
  if (intento === secreto) pista.innerText = "🎉 ¡Adivinaste!";
  else if (intento > secreto) pista.innerText = "⬇️ Es más bajo";
  else pista.innerText = "⬆️ Es más alto";
}

/* === 🧩 Memorama === */
function memorama() {
  const cartas = ["🍎", "🍌", "🍒", "🍉", "🍇", "🍑"];
  const parejas = cartas.concat(cartas);
  parejas.sort(() => Math.random() - 0.5);
  juego.innerHTML = `
    <h2>🧩 Memorama</h2>
    <div id="tablero"></div>
  `;
  const tablero = document.getElementById("tablero");
  tablero.style.gridTemplateColumns = `repeat(4, 60px)`;
  tablero.style.width = "max-content";
  let seleccion = [];
  parejas.forEach((emoji, i) => {
    const btn = document.createElement("button");
    btn.innerText = "❓";
    btn.className = "memcell";
    btn.onclick = () => {
      if (seleccion.length < 2 && btn.innerText === "❓") {
        btn.innerText = emoji;
        seleccion.push({ emoji, btn });
        if (seleccion.length === 2) {
          setTimeout(() => {
            if (seleccion[0].emoji !== seleccion[1].emoji) {
              seleccion[0].btn.innerText = "❓";
              seleccion[1].btn.innerText = "❓";
            } else {
              seleccion[0].btn.disabled = true;
              seleccion[1].btn.disabled = true;
            }
            seleccion = [];
          }, 700);
        }
      }
    };
    tablero.appendChild(btn);
  });
}

/* === 🐍 Snake (versión simple) === */
function snake() {
  juego.innerHTML = `<canvas id="canvas" width="300" height="300"></canvas>`;
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const box = 10;
  let snake = [{ x: 150, y: 150 }];
  let dir = "RIGHT";
  let food = {
    x: Math.floor(Math.random() * 30) * box,
    y: Math.floor(Math.random() * 30) * box
  };

  document.onkeydown = e => {
    if (e.key === "ArrowUp" && dir !== "DOWN") dir = "UP";
    if (e.key === "ArrowDown" && dir !== "UP") dir = "DOWN";
    if (e.key === "ArrowLeft" && dir !== "RIGHT") dir = "LEFT";
    if (e.key === "ArrowRight" && dir !== "LEFT") dir = "RIGHT";
  };

  function dibujar() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 300, 300);

    snake.forEach(s => {
      ctx.fillStyle = "#00ffff";
      ctx.fillRect(s.x, s.y, box, box);
    });

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let cabeza = { x: snake[0].x, y: snake[0].y };
    if (dir === "UP") cabeza.y -= box;
    if (dir === "DOWN") cabeza.y += box;
    if (dir === "LEFT") cabeza.x -= box;
    if (dir === "RIGHT") cabeza.x += box;

    if (cabeza.x === food.x && cabeza.y === food.y) {
      food = {
        x: Math.floor(Math.random() * 30) * box,
        y: Math.floor(Math.random() * 30) * box
      };
    } else {
      snake.pop();
    }

    if (
      cabeza.x < 0 || cabeza.x >= 300 ||
      cabeza.y < 0 || cabeza.y >= 300 ||
      snake.some(s => s.x === cabeza.x && s.y === cabeza.y)
    ) {
      alert("💀 Perdiste");
      regresarMenu();
      clearInterval(juegoActivo);
    }

    snake.unshift(cabeza);
  }

  juegoActivo = setInterval(dibujar, 100);
}

/* === 🏃 Juego de Salto === */
function juegoSalto() {
  juego.innerHTML = `
    <h2>🏃 Juego de Salto</h2>
    <div id="gameArea">
      <div id="player"></div>
      <div id="obstacle"></div>
    </div>
    <p>Presiona espacio para saltar</p>
  `;

  const player = document.getElementById("player");
  const obstacle = document.getElementById("obstacle");

  document.onkeydown = e => {
    if (e.code === "Space" && !player.classList.contains("jump")) {
      player.classList.add("jump");
      setTimeout(() => player.classList.remove("jump"), 600);
    }
  };

  juegoActivo = setInterval(() => {
    const pTop = parseInt(window.getComputedStyle(player).getPropertyValue("top"));
    const oLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue("left"));
    if (oLeft < 40 && oLeft > 0 && pTop >= 130) {
      alert("💥 Te chocaste!");
      clearInterval(juegoActivo);
      regresarMenu();
    }
  }, 10);
}

// Estilos dinámicos para el juego de salto (se añaden una vez)
const estiloExtra = document.createElement("style");
estiloExtra.innerHTML = `
#gameArea {
  position: relative;
  width: 300px;
  height: 150px;
  background: #111;
  overflow: hidden;
  margin: auto;
  border: 2px solid #00ffff55;
  border-radius: 10px;
}
#player {
  width: 30px;
  height: 30px;
  background: #00ffff;
  position: absolute;
  top: 120px;
  left: 30px;
  border-radius: 5px;
}
#player.jump {
  animation: saltar 0.6s ease-out;
}
@keyframes saltar {
  0% { top: 120px; }
  50% { top: 40px; }
  100% { top: 120px; }
}
#obstacle {
  width: 20px;
  height: 30px;
  background: red;
  position: absolute;
  bottom: 0;
  right: 0;
  animation: mover 1.5s linear infinite;
}
@keyframes mover {
  from { right: -20px; }
  to { right: 320px; }
}`;
document.head.appendChild(estiloExtra);

/* ===================== NUEVOS JUEGOS ===================== */

/* === 6. Buscaminas (Minesweeper) === */
function buscaminas() {
  const rows = 8, cols = 8, mines = 10;
  let grid = [];
  juego.innerHTML = `
    <h2>💣 Buscaminas</h2>
    <div id="minesBoard"></div>
    <div class="controls"><span class="small">Clic izquierdo: descubrir · Clic derecho: marcar</span></div>
    <button onclick="buscaminas()">Reiniciar</button>
  `;
  const board = document.getElementById("minesBoard");
  board.innerHTML = "";
  board.style.width = (cols * 36) + "px";
  board.style.display = "grid";
  board.style.gridTemplateColumns = `repeat(${cols}, 36px)`;
  // init
  for (let r=0;r<rows;r++){
    grid[r] = [];
    for (let c=0;c<cols;c++){
      grid[r][c] = { mine:false, revealed:false, flagged:false, adjacent:0, el:null };
    }
  }
  // place mines
  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random()*rows);
    const c = Math.floor(Math.random()*cols);
    if (!grid[r][c].mine) { grid[r][c].mine = true; placed++; }
  }
  // calc adjacent
  for (let r=0;r<rows;r++) for (let c=0;c<cols;c++){
    let count = 0;
    for (let dr=-1; dr<=1; dr++) for (let dc=-1; dc<=1; dc++){
      const nr = r+dr, nc = c+dc;
      if (nr>=0 && nr<rows && nc>=0 && nc<cols && grid[nr][nc].mine) count++;
    }
    grid[r][c].adjacent = count;
  }
  // render
  for (let r=0;r<rows;r++){
    for (let c=0;c<cols;c++){
      const cell = document.createElement("div");
      cell.className = "buscaminas-cell";
      cell.style.background = "#222";
      cell.style.border = "2px solid #111";
      cell.dataset.r = r; cell.dataset.c = c;
      cell.innerText = "";
      cell.oncontextmenu = (e) => {
        e.preventDefault();
        toggleFlag(r,c);
      };
      cell.onclick = () => revealCell(r,c);
      board.appendChild(cell);
      grid[r][c].el = cell;
    }
  }

  function toggleFlag(r,c){
    const cell = grid[r][c];
    if (cell.revealed) return;
    cell.flagged = !cell.flagged;
    cell.el.innerText = cell.flagged ? "🚩" : "";
  }

  function revealCell(r,c){
    const cell = grid[r][c];
    if (cell.flagged || cell.revealed) return;
    cell.revealed = true;
    cell.el.style.background = "#444";
    if (cell.mine) {
      cell.el.innerText = "💣";
      // reveal all mines
      for (let i=0;i<rows;i++) for (let j=0;j<cols;j++){
        if (grid[i][j].mine) grid[i][j].el.innerText = "💣";
      }
      setTimeout(()=> { alert("💥 Has perdido"); }, 50);
      return;
    } else {
      if (cell.adjacent>0) {
        cell.el.innerText = cell.adjacent;
      } else {
        // flood fill neighbors
        for (let dr=-1; dr<=1; dr++) for (let dc=-1; dc<=1; dc++){
          const nr = r+dr, nc = c+dc;
          if (nr>=0 && nr<rows && nc>=0 && nc<cols && !grid[nr][nc].revealed) revealCell(nr,nc);
        }
      }
    }
    // check win
    let unrevealed = 0;
    for (let i=0;i<rows;i++) for (let j=0;j<cols;j++) if (!grid[i][j].revealed) unrevealed++;
    if (unrevealed === mines) {
      setTimeout(()=> alert("🎉 Ganaste!"), 50);
    }
  }
}

/* === 7. Tic-Tac-Toe === */
function ticTacToe() {
  let board = Array(9).fill("");
  let turn = "X";
  let vsAI = false;

  juego.innerHTML = `
    <h2>🔢 Tic-Tac-Toe</h2>
    <div>
      <label><input id="modeAI" type="checkbox"> Jugar contra IA</label>
    </div>
    <div id="ttt" class="grid-ttt"></div>
    <p id="tttMsg"></p>
    <button onclick="ticTacToe()">Reiniciar</button>
  `;
  const mode = document.getElementById("modeAI");
  const gridEl = document.getElementById("ttt");
  const msg = document.getElementById("tttMsg");
  gridEl.style.gridTemplateColumns = "repeat(3, 70px)";
  gridEl.style.width = "max-content";

  mode.onchange = () => { vsAI = mode.checked; reset(); };

  function reset(){
    board.fill(""); turn = "X"; msg.innerText = `Turno: ${turn}`;
    gridEl.innerHTML = "";
    for (let i=0;i<9;i++){
      const cell = document.createElement("button");
      cell.className = "cell-ttt";
      cell.onclick = () => play(i);
      gridEl.appendChild(cell);
    }
  }

  function play(i){
    if (board[i] || checkWinner(board)) return;
    board[i] = turn;
    render();
    const w = checkWinner(board);
    if (w) { msg.innerText = w==="Tie" ? "Empate" : `Ganador: ${w}`; return; }
    turn = turn === "X" ? "O" : "X";
    msg.innerText = `Turno: ${turn}`;
    if (vsAI && turn === "O") {
      setTimeout(aiMove, 250);
    }
  }

  function aiMove(){
    // simple: elegir aleatorio de vacíos, pero si hay jugada ganadora, tomarla
    const empty = board.map((v,i)=> v===""?i:-1).filter(i=>i>-1);
    // check immediate win or block
    for (let idx of empty) {
      const clone = board.slice(); clone[idx] = "O";
      if (checkWinner(clone) === "O") { play(idx); return; }
    }
    for (let idx of empty) {
      const clone = board.slice(); clone[idx] = "X";
      if (checkWinner(clone) === "X") { play(idx); return; }
    }
    const choice = empty[Math.floor(Math.random()*empty.length)];
    play(choice);
  }

  function render(){
    gridEl.childNodes.forEach((n,i)=> n.innerText = board[i]);
  }

  function checkWinner(b){
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (let [a,b1,c] of lines) if (b[a] && b[a]===b[b1] && b[a]===b[c]) return b[a];
    if (b.every(x=>x)) return "Tie";
    return null;
  }

  reset();
}

/* === 8. Pong === */
function pong() {
  juego.innerHTML = `<h2>🎾 Pong</h2><canvas id="pongCanvas" width="600" height="320"></canvas><p id="scorePong"></p><button onclick="pong()">Reiniciar</button>`;
  const canvas = document.getElementById("pongCanvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  let paddleH = 80, paddleW = 10;
  let leftY = (H-paddleH)/2, rightY = (H-paddleH)/2;
  let ball = { x: W/2, y: H/2, vx: 4, vy: 2, r: 7 };
  let scoreL = 0, scoreR = 0;
  document.onkeydown = e => {
    if (e.key === "w") leftY -= 20;
    if (e.key === "s") leftY += 20;
    if (e.key === "ArrowUp") rightY -= 20;
    if (e.key === "ArrowDown") rightY += 20;
    leftY = Math.max(0, Math.min(H-paddleH, leftY));
    rightY = Math.max(0, Math.min(H-paddleH, rightY));
  };

  function draw() {
    ctx.fillStyle = "#000"; ctx.fillRect(0,0,W,H);
    // paddles
    ctx.fillStyle = "#00ffff"; ctx.fillRect(10, leftY, paddleW, paddleH);
    ctx.fillStyle = "#ff7b7b"; ctx.fillRect(W-20, rightY, paddleW, paddleH);
    // ball
    ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2); ctx.fillStyle="#fff"; ctx.fill();
    // net
    ctx.fillStyle="#444"; for (let y=0;y<H;y+=20) ctx.fillRect(W/2-1,y,2,10);
    // move ball
    ball.x += ball.vx; ball.y += ball.vy;
    // bounce top/bottom
    if (ball.y <= ball.r || ball.y >= H-ball.r) ball.vy *= -1;
    // left paddle collision
    if (ball.x - ball.r <= 10 + paddleW && ball.y >= leftY && ball.y <= leftY + paddleH) {
      ball.vx *= -1.05; // speed up slightly
      // adjust vy by where it hit
      let delta = ball.y - (leftY + paddleH/2);
      ball.vy = delta * 0.12;
    }
    // right paddle collision
    if (ball.x + ball.r >= W-20 && ball.y >= rightY && ball.y <= rightY + paddleH) {
      ball.vx *= -1.05;
      let delta = ball.y - (rightY + paddleH/2);
      ball.vy = delta * 0.12;
    }
    // score
    if (ball.x < 0) { scoreR++; resetBall(-1); }
    if (ball.x > W) { scoreL++; resetBall(1); }
    // simple AI for right paddle
    if (ball.vx > 0) {
      if (rightY + paddleH/2 < ball.y - 10) rightY += 4;
      if (rightY + paddleH/2 > ball.y + 10) rightY -= 4;
      rightY = Math.max(0, Math.min(H-paddleH, rightY));
    }
    document.getElementById("scorePong").innerText = `Jugador: ${scoreL} — CPU: ${scoreR}`;
    if (scoreL >= 10 || scoreR >= 10) {
      setTimeout(()=> alert(scoreL>scoreR ? "🎉 Ganaste Pong!" : "Perdiste Pong"), 50);
      regresarMenu();
      clearInterval(juegoActivo);
    }
  }

  function resetBall(dir=1) {
    ball.x = W/2; ball.y = H/2;
    ball.vx = 4 * dir;
    ball.vy = (Math.random()*4)-2;
  }

  juegoActivo = setInterval(draw, 16);
}

/* === 9. Rompebloques (Breakout) === */
function breakout() {
  juego.innerHTML = `<h2>💎 Rompebloques</h2><canvas id="breakCanvas" width="480" height="320"></canvas><p id="lifeScore"></p><button onclick="breakout()">Reiniciar</button>`;
  const canvas = document.getElementById("breakCanvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  let paddle = { x: W/2 - 40, y: H-20, w: 80, h: 10 };
  let ball = { x: W/2, y: H-30, vx: 4, vy: -4, r:7 };
  let rows = 5, cols = 7;
  let bricks = [];
  let lives = 3, score = 0;
  for (let r=0;r<rows;r++){
    bricks[r]=[];
    for (let c=0;c<cols;c++){
      bricks[r][c] = { x: c* (W/cols) + 10, y: r*24 + 30, w: (W/cols)-20, h: 18, alive:true };
    }
  }
  let left=false, right=false;
  document.onkeydown = e => { if (e.key==="ArrowLeft") left=true; if (e.key==="ArrowRight") right=true; };
  document.onkeyup = e => { if (e.key==="ArrowLeft") left=false; if (e.key==="ArrowRight") right=false; };

  function draw(){
    ctx.fillStyle="#000"; ctx.fillRect(0,0,W,H);
    // paddle
    if (left) paddle.x -=6;
    if (right) paddle.x +=6;
    paddle.x = Math.max(0, Math.min(W-paddle.w, paddle.x));
    ctx.fillStyle="#00ffff"; ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
    // ball
    ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r,0,Math.PI*2); ctx.fillStyle="#fff"; ctx.fill();
    ball.x += ball.vx; ball.y += ball.vy;
    if (ball.x<=ball.r || ball.x>=W-ball.r) ball.vx*=-1;
    if (ball.y<=ball.r) ball.vy*=-1;
    // paddle collision
    if (ball.y + ball.r >= paddle.y && ball.x >= paddle.x && ball.x <= paddle.x + paddle.w) {
      ball.vy *= -1;
      ball.y = paddle.y - ball.r;
    }
    // bricks
    for (let r=0;r<rows;r++) for (let c=0;c<cols;c++){
      const b = bricks[r][c];
      if (!b.alive) continue;
      ctx.fillStyle="#ffb84d"; ctx.fillRect(b.x, b.y, b.w, b.h);
      if (ball.x > b.x && ball.x < b.x + b.w && ball.y - ball.r < b.y + b.h && ball.y + ball.r > b.y) {
        b.alive = false;
        ball.vy *= -1;
        score += 10;
      }
    }
    if (ball.y > H) {
      lives--;
      if (lives <= 0) { setTimeout(()=> alert("💥 Perdiste Breakout"),50); regresarMenu(); clearInterval(juegoActivo); return; }
      ball.x = W/2; ball.y = H-30; ball.vx = 4; ball.vy = -4;
    }
    if (bricks.flat().every(b=>!b.alive)) { setTimeout(()=> alert("🎉 Has destruido todos los bloques!"),50); regresarMenu(); clearInterval(juegoActivo); return; }
    document.getElementById("lifeScore").innerText = `Vidas: ${lives} — Puntos: ${score}`;
  }

  juegoActivo = setInterval(draw, 16);
}

/* === 10. Space Shooter === */
function spaceShooter() {
  juego.innerHTML = `<h2>🚀 Space Shooter</h2><canvas id="spaceCanvas" width="400" height="520"></canvas><p id="spaceScore"></p><button onclick="spaceShooter()">Reiniciar</button>`;
  const canvas = document.getElementById("spaceCanvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  let ship = { x: W/2 - 18, y: H-60, w:36, h:36 };
  let bullets = [];
  let enemies = [];
  let enemyTimer = 0;
  let score = 0;
  let left=false,right=false,shooting=false;
  document.onkeydown = e => {
    if (e.key==="ArrowLeft") left=true;
    if (e.key==="ArrowRight") right=true;
    if (e.key===" ") shooting=true;
  };
  document.onkeyup = e => {
    if (e.key==="ArrowLeft") left=false;
    if (e.key==="ArrowRight") right=false;
    if (e.key===" ") shooting=false;
  };

  function spawnEnemy(){
    const ex = Math.random()*(W-40)+20;
    enemies.push({ x: ex, y: -30, w:30, h:30, vy: 1 + Math.random()*1.5 });
  }

  function draw(){
    ctx.fillStyle="#000"; ctx.fillRect(0,0,W,H);
    // ship
    if (left) ship.x -=5;
    if (right) ship.x +=5;
    ship.x = Math.max(0, Math.min(W-ship.w, ship.x));
    ctx.fillStyle="#00ffff"; ctx.fillRect(ship.x, ship.y, ship.w, ship.h);
    // shooting
    if (shooting && bullets.length<5) {
      bullets.push({ x: ship.x + ship.w/2 - 3, y: ship.y, vy: -6 });
    }
    // bullets
    bullets.forEach(b=> { b.y += b.vy; ctx.fillStyle="#fff"; ctx.fillRect(b.x, b.y, 6, 12); });
    bullets = bullets.filter(b => b.y > -20);
    // spawn enemies periodically
    enemyTimer++;
    if (enemyTimer % 60 === 0) spawnEnemy();
    // move enemies
    enemies.forEach(en => { en.y += en.vy; ctx.fillStyle="#ff6b6b"; ctx.fillRect(en.x, en.y, en.w, en.h); });
    // collisions
    enemies.forEach((en, ei) => {
      bullets.forEach((b, bi) => {
        if (b.x < en.x + en.w && b.x + 6 > en.x && b.y < en.y + en.h && b.y + 12 > en.y) {
          // hit
          enemies.splice(ei,1);
          bullets.splice(bi,1);
          score += 10;
        }
      });
      // enemy hits ship?
      if (en.x < ship.x + ship.w && en.x + en.w > ship.x && en.y < ship.y + ship.h && en.y + en.h > ship.y) {
        setTimeout(()=> alert("💥 Has sido alcanzado. Game Over"),50);
        regresarMenu(); clearInterval(juegoActivo);
      }
      // enemy passes bottom
      if (en.y > H) {
        enemies.splice(ei,1);
      }
    });
    document.getElementById("spaceScore").innerText = `Puntos: ${score}`;
  }

  juegoActivo = setInterval(draw, 16);
}
