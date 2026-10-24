class Complex {
    constructor(real, imaginary) {
        this.real = real || 0
        this.imaginary = imaginary || 0
    }
    static transform(num) {
        return (num instanceof Complex) ? num.copy() : new Complex(num, 0)
    }
    print() {
        let sgn = (this.imaginary < 0) ? ' - ' : ' + '
        console.log('' + this.real + '' + sgn + '' + Math.abs(this.imaginary) + 'i')
    }
    copy() {
        return new Complex(this.real, this.imaginary)
    }
    mult(other) {
        let num1 = Complex.transform(this)
        let num2 = Complex.transform(other)

        this.real = (num1.real * num2.real) - (num1.imaginary * num2.imaginary)
        this.imaginary = (num1.real * num2.imaginary) + (num1.imaginary * num2.real)

        return this
    }

    static mult(first, other) {
        return first.copy().mult(other)
    }
    static power(num, p) {
        let result = new Complex(1, 0)
        for (let j = 0; j < p; j++) {
            result.mult(num)
        }
        return result


    }
}
const i = new Complex(0, 1)



// let b = Complex.power(i, 3)
// b.print()
// let num = 0
// setInterval(() => {
//     Complex.power(i, num).print()
//     num++
// }, 1000);

