let botonBorrar, botonRetirar, inputDinero, resultado, cajero, dineroEntregado, borrar

botonBorrar = document.getElementById('borrar')
botonRetirar = document.getElementById('entregar')
inputDinero = document.getElementById('dinero')
resultado = document.getElementById('resultado')

borrar = () => resultado.innerHTML = ''

class Billete {
    constructor(valor, cantidad) {
        this.valor = valor
        this.cantidad = cantidad
    }
}

botonBorrar.addEventListener('click', borrar)
botonRetirar.addEventListener('click', entregar)
addEventListener('keyup', (event) => {
    if (event.keyCode == 13) {
        entregar()
    }
})

cajero = []
for (let i = 7; i > 0; i--) {
    let residuo = i % 4

    if (residuo !== 0) {

        let valor = residuo + Math.floor(residuo / 3) * 2
        valor *= 10 ** Math.floor(i / 4)

        cajero.push(new Billete(valor, 1000 / valor))
    }
}

function entregar() {
    borrar()
    dineroEntregado = []

    let dinero = parseInt(inputDinero.value)

    for (billete of cajero) {
        if (dinero > 0) {
            let div = Math.floor(dinero / billete.valor)
            let cantidad

            if (div > billete.cantidad) {
                cantidad = billete.cantidad

            } else {
                cantidad = div
            }

            if (cantidad !== 0) {
                dineroEntregado.push(new Billete(billete.valor, cantidad))
            }

            dinero -= billete.valor * cantidad

        }
    }
    if (dinero > 0) {
        resultado.innerHTML = 'No tenemos dinero suficiente'
    } else {
        for (billete of dineroEntregado) {
            let text = 'billete'
            if (billete.cantidad > 1) {
                text += 's'
            }

            resultado.innerHTML += billete.cantidad + ' ' + text + ' de: $ ' + billete.valor + '<br>'
        }
    }
}