let hombre, mujer, peso, estatura, edad, actividad, enviar, unidadesAltura, result
hombre = document.getElementById('men')
mujer = document.getElementById('woman')
peso = document.getElementById('peso')
estatura = document.getElementById('altura')
edad = document.getElementById('edad')
actividad = document.getElementById('actividad')
enviar = document.getElementById('enviar')
unidadesAltura = document.getElementById('unidadesAltura')
result = document.getElementById('result')

let sistem, sexo
sistem = document.getElementById('sistem')
sexo = document.getElementsByName('sexo')

let valuePeso, valueEstatura
valuePeso = peso.value
valueEstatura = estatura.value


enviar.addEventListener('click', tmbGeneral)
addEventListener('keyup', event => {
    if (event.keyCode == 13) tmbGeneral()
});

let res
function tmbGeneral() {

    switch (sistem.value) {
        case 'kg':
            valuePeso = peso.value
            break
        case 'lb':
            valuePeso = peso.value * 0.453592
            break

        default:
            break
    }

    switch (unidadesAltura.value) {
        case 'cm':
            valueEstatura = estatura.value;
            break
        case 'in':
            valueEstatura = estatura.value * 2.54;
            break

        default:
            break
    }

    res = 10 * valuePeso + 6.25 * valueEstatura - 5 * edad.value

    if (sexo[0].checked) {
        res += 5
    } else if (sexo[1].checked) {
        res -= 161
    }

    switch (actividad.value) {
        case '1':
            res *= 1.05
            break
        case '2':
            res *= 1.375
            break
        case '3':
            res *= 1.55
            break
        case '4':
            res *= 1.725
            break
        case '5':
            res *= 1.9
            break

        default:
            break
    }

    result.innerHTML = ''
    result.innerHTML = 'Tu tasa metabolica basal es de: ' + res.toFixed(2)
}

