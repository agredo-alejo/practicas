let canvas = document.getElementById('areaDibujo')
let c2d = canvas.getContext('2d')
let borrador = document.getElementById('borrador')

borrador.addEventListener('click', () => {
	c2d.clearRect(0, 0, canvas.width, canvas.height)
})

let teclas = {
	UP: 38,
	DOWN: 40,
	LEFT: 37,
	RIGHT: 39
};

let x = 150;
let y = 150;
let movimiento = 10;


canvas.addEventListener('mousedown', () => {
	canvas.addEventListener('mousemove', dibujarMouse)
})
canvas.addEventListener('mouseup', () => {
	canvas.removeEventListener('mousemove', dibujarMouse)
})
document.addEventListener('keydown', dibujarTeclado)



function dibujarMouse(event) {
	let mouseX = event.x;
	let mouseY = event.y;

	// linea('blue', mouseX, mouseY, mouseX + 1, mouseY + 1);
	c2d.beginPath()
	c2d.arc(mouseX, mouseY, 5, 0, Math.PI * 2, true)
	c2d.fillStyle = 'blue'
	c2d.fill()
	c2d.closePath()
}

function dibujarTeclado(event) {
	let color = 'blue';
	switch (event.keyCode) {
		case teclas.DOWN:
			// console.log('abajo :3');
			linea(color, x, y, x, y + movimiento);
			y += movimiento;
			break;
		case teclas.UP:
			// console.log('arriba :D');
			linea(color, x, y, x, y - movimiento);
			y -= movimiento;
			break;
		case teclas.RIGHT:
			// console.log('derecha');
			linea(color, x, y, x + movimiento, y);
			x += movimiento;
			break;
		case teclas.LEFT:
			// console.log('izquierda');
			linea(color, x, y, x - movimiento, y);
			x -= movimiento;
			break;
		default:
			// console.log('otra tecla');
			break;
	}
}

function linea(color, xi, yi, xf, yf) {
	c2d.beginPath();
	c2d.strokeStyle = color;
	c2d.lineWidth = 5;
	c2d.moveTo(xi, yi);
	c2d.lineTo(xf, yf);
	c2d.stroke();
	c2d.closePath();
}

