let canvas = document.getElementById("grafo");
let ctx = canvas.getContext("2d");

let nodos = [];
let aristas = [];
let modo = "nodo";
let seleccionado = null;
let contador = 1;

let nodoArrastrando = null;

function cambiarModo(nuevoModo){
  modo = nuevoModo;
  seleccionado = null;
}

canvas.addEventListener("mousedown", function(e) {
  let x = e.offsetX;
  let y = e.offsetY;

  for (let nodo of nodos) {
    let dx = nodo.x - x;
    let dy = nodo.y - y;
    if (Math.sqrt(dx*dx + dy*dy) < 20) {

      if (modo === "mover") {
        nodoArrastrando = nodo;
        return;
      }

      if (modo === "eliminar") {
        eliminarNodo(nodo);
        dibujar();
        return;
      }

      if (modo === "arista") {
        if (!seleccionado) {
          seleccionado = nodo;
        } else {
          aristas.push({from: seleccionado, to: nodo});
          seleccionado = null;
          dibujar();
        }
        return;
      }
    }
  }

  if (modo === "nodo") {
    nodos.push({x, y, id: contador++});
    dibujar();
  }
});

canvas.addEventListener("mousemove", function(e) {
  if (modo === "mover" && nodoArrastrando) {
    nodoArrastrando.x = e.offsetX;
    nodoArrastrando.y = e.offsetY;
    dibujar();
  }
});

canvas.addEventListener("mouseup", function() {
  nodoArrastrando = null;
});

function eliminarNodo(nodo) {
  nodos = nodos.filter(n => n !== nodo);
  aristas = aristas.filter(a => a.from !== nodo && a.to !== nodo);
}

function dibujar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar aristas
  for (let arista of aristas) {

    let from = arista.from;
    let to = arista.to;

    let existeContraria = aristas.some(a =>
      a.from === to && a.to === from
    );

    let offset = existeContraria ? 12 : 0;

    let dx = to.x - from.x;
    let dy = to.y - from.y;
    let length = Math.sqrt(dx*dx + dy*dy);

    let offsetX = -dy / length * offset;
    let offsetY = dx / length * offset;

    let startX = from.x + offsetX;
    let startY = from.y + offsetY;
    let endX = to.x + offsetX;
    let endY = to.y + offsetY;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = "purple";
    ctx.lineWidth = 2;
    ctx.stroke();

    dibujarFlecha(startX, startY, endX, endY);
  }

  // Dibujar nodos
  for (let nodo of nodos) {
    ctx.beginPath();
    ctx.arc(nodo.x, nodo.y, 20, 0, Math.PI*2);
    ctx.strokeStyle = "cyan";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(nodo.id, nodo.x, nodo.y);
  }
}

function dibujarFlecha(x1, y1, x2, y2) {
  let angle = Math.atan2(y2 - y1, x2 - x1);
  let arrowLength = 15;

  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - arrowLength * Math.cos(angle - Math.PI/6),
    y2 - arrowLength * Math.sin(angle - Math.PI/6)
  );
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - arrowLength * Math.cos(angle + Math.PI/6),
    y2 - arrowLength * Math.sin(angle + Math.PI/6)
  );
  ctx.strokeStyle = "purple";
  ctx.stroke();
}