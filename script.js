const menu = document.getElementById("menu");
const juego = document.getElementById("juego");
const btnRegresar = document.getElementById("regresar");

function mostrarJuego(nombre) {
  menu.classList.add("oculto");
  juego.classList.remove("oculto");
  btnRegresar.classList.remove("oculto");

  switch (nombre) {
    case "piedraPapelTijera": piedraPapelTijera(); break;
    case "adivinaNumero": adivinaNumero(); break;
    case "memorama": memorama(); break;
    case "snake": snake(); break;
    case "juegoSalto": juegoSalto(); break;
  }
}

function regresarMenu() {
  juego.classList.add("oculto");
  btnRegresar.classList.add("oculto");
  menu.classList.remove("oculto");
  juego.innerHTML = "";
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
    Elegiste ${eleccionJugador}, la PC eligió ${eleccionPC}. ${resultado};
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

  if (intento === secreto) pista.innerText = "🎉 ¡Adivinaste!";
  else if (intento > secreto) pista.innerText = "⬇️ Es más bajo";
  else pista.innerText = "⬆️ Es más alto";
}

/* === 🧩 Memorama === */
function memorama() {
  const cartas = ["🍎","🍌","🍒","🍎","🍌","🍒"];
  cartas.sort(() => Math.random() - 0.5);
  juego.innerHTML = <h2>🧩 Memorama</h2><div id="tablero"></div>;
  const tablero = document.getElementById("tablero");
  let seleccion = [];

  cartas.forEach((emoji, i) => {
    const btn = document.createElement("button");
    btn.innerText = "❓";
    btn.onclick = () => {
      if (seleccion.length < 2 && btn.innerText === "❓") {
        btn.innerText = emoji;
        seleccion.push({ emoji, btn });
        if (seleccion.length === 2) {
          setTimeout(() => {
            if (seleccion[0].emoji !== seleccion[1].emoji) {
              seleccion[0].btn.innerText = "❓";
              seleccion[1].btn.innerText = "❓";
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
  juego.innerHTML = <canvas id="canvas" width="300" height="300"></canvas>;
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const box = 10;
  let snake = [{x:150,y:150}];
  let dir = "RIGHT";
  let food = {x:Math.floor(Math.random()*30)*box, y:Math.floor(Math.random()*30)*box};

  document.onkeydown = e => {
    if (e.key === "ArrowUp" && dir !== "DOWN") dir = "UP";
    if (e.key === "ArrowDown" && dir !== "UP") dir = "DOWN";
    if (e.key === "ArrowLeft" && dir !== "RIGHT") dir = "LEFT";
    if (e.key === "ArrowRight" && dir !== "LEFT") dir = "RIGHT";
  };

  function dibujar() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0,0,300,300);
    snake.forEach(s => {
      ctx.fillStyle = "#00ffff";
      ctx.fillRect(s.x,s.y,box,box);
    });
    ctx.fillStyle = "red";
    ctx.fillRect(food.x,food.y,box,box);

    let cabeza = {x:snake[0].x, y:snake[0].y};
    if (dir==="UP") cabeza.y -= box;
    if (dir==="DOWN") cabeza.y += box;
    if (dir==="LEFT") cabeza.x -= box;
    if (dir==="RIGHT") cabeza.x += box;

    if (cabeza.x===food.x && cabeza.y===food.y){
      food = {x:Math.floor(Math.random()*30)*box, y:Math.floor(Math.random()*30)*box};
    } else snake.pop();

    if (cabeza.x<0||cabeza.x>=300||cabeza.y<0||cabeza.y>=300||snake.some(s=>s.x===cabeza.x&&s.y===cabeza.y)){
      alert("💀 Perdiste");
      regresarMenu();
      clearInterval(juegoActivo);
    }

    snake.unshift(cabeza);
  }
  const juegoActivo = setInterval(dibujar,100);
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
      setTimeout(()=>player.classList.remove("jump"),600);
    }
  };

  let check = setInterval(()=>{
    const pTop = parseInt(window.getComputedStyle(player).getPropertyValue("top"));
    const oLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue("left"));
    if(oLeft<40 && oLeft>0 && pTop>=130){
      alert("💥 Te chocaste!");
      clearInterval(check);
      regresarMenu();
    }
  },10);
}

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
  bottom: 0;
  left: 30px;
  border-radius: 5px;
}
#player.jump {
  animation: saltar 0.6s ease-out;
}
@keyframes saltar {
  0% {bottom: 0;}
  50% {bottom: 80px;}
  100% {bottom: 0;}
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
  from {right: -20px;}
  to {right: 320px;}
}`;
document.head.appendChild(estiloExtra);
