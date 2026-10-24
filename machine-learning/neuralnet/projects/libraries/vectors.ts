// Vector js Alejandro Agredo
// instagram @agredo_alejo
// interface Vec {
//     x: number,
//     y: number,
//     z: number
// }
export const Vector = class {
    x: number; y: number; z: number
    constructor(x = 0, y = 0, z = 0) {
        this.x = x
        this.y = y
        this.z = z
    }

    inverse() {
        return this.mult(-1)
    }
    static inverseOf(vector: any) {
        return new Vector(vector.x * -1, vector.y * -1, vector.z * -1)
    }
    get invert() {
        return new Vector(this.x * -1, this.y * -1, this.z * -1)
    }


    add(x: any, y = 0, z = 0) {
        if (x instanceof Vector) {
            this.x += x.x || 0
            this.y += x.y || 0
            this.z += x.z || 0
            return this
        }
        this.x += x || 0
        this.y += y || 0
        this.z += z || 0
        return this
    }
    static add(vector: any, x: any, y = 0, z = 0) {
        if (x instanceof Vector) {
            return new Vector(
                vector.x + x.x,
                vector.y + x.y,
                vector.z + x.z
            )
        }
        return new Vector(
            vector.x + x,
            vector.y + y,
            vector.z + z
        )
    }


    sub(x: any, y = 0, z = 0) {
        if (x instanceof Vector) {
            this.x -= x.x || 0
            this.y -= x.y || 0
            this.z -= x.z || 0
            return this
        }
        this.x -= x || 0
        this.y -= y || 0
        this.z -= z || 0
        return this
    }
    static sub(vector: any, x: any, y = 0, z = 0) {
        if (x instanceof Vector) {
            return new Vector(
                vector.x - x.x,
                vector.y - x.y,
                vector.z - x.z
            )
        }
        return new Vector(
            vector.x - x,
            vector.y - y,
            vector.z - z
        )
    }


    mult(factor: number) {
        if (isFinite(factor)) {
            this.x *= factor
            this.y *= factor
            this.z *= factor
            return this
        }
        return this
    }
    static mult(vector: any, factor: number) {
        if (isFinite(factor)) {
            return new Vector(vector.x * factor, vector.y * factor, vector.z * factor)
        }
        return new Vector(vector.x, vector.y, vector.z)
    }


    div(divisor: number) {
        if (divisor !== 0 && isFinite(divisor)) {
            let inverse = 1 / divisor
            this.x *= inverse
            this.y *= inverse
            this.z *= inverse
            return this
        }
        return this
    }
    static div(vector: any, divisor: number) {
        if (divisor !== 0 && isFinite(divisor)) {
            let inverse = 1 / divisor
            return new Vector(vector.x * inverse, vector.y * inverse, vector.z * inverse)
        }
        return new Vector(vector.x, vector.y, vector.z)
    }


    set(x: any, y = 0, z = 0) {
        if (x instanceof Vector) {
            this.x = x.x
            this.y = x.y
            this.z = x.z
            return this
        }
        this.x = x
        this.y = y
        this.z = z
        return this
    }

    copy() {
        return new Vector(this.x, this.y, this.z)
    }

    magSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z
    }

    mag() {
        return Math.hypot(this.x, this.y, this.z)
    }


    normalize() {
        return this.div(Math.hypot(this.x, this.y, this.z))
    }
    static normalize(vector: any) {
        return Vector.div(vector, Math.hypot(vector.x, vector.y, vector.z))
    }
    get normalized() {
        return Vector.div(this, Math.hypot(this.x, this.y, this.z))
    }


    setMag(number: number) {
        return this.div(this.mag()).mult(number)
    }
    static setMag(vector: any, number: number) {
        return Vector.div(vector, Math.hypot(vector.x, vector.y, vector.z)).mult(number)
    }

    max(otherVector: any) {
        return this.mag() > otherVector.mag() ? this : otherVector
    }

    static max(vector: any, otherVector: any) {
        return vector.mag() > otherVector.mag() ? vector.copy() : otherVector.copy()
    }

    min(otherVector: any) {
        return this.mag() < otherVector.mag() ? this : otherVector
    }

    static min(vector: any, otherVector: any) {
        return vector.mag() < otherVector.mag() ? vector.copy() : otherVector.copy()
    }

    equals(otherVector: any) {
        return this.x == otherVector.x && this.y == otherVector.y && this.z == otherVector.z
    }

    static equals(vector: any, otherVector: any) {
        return vector.x == otherVector.x && vector.y == otherVector.y && vector.z == otherVector.z
    }

    dist(otherVector: any) {
        return Math.hypot(this.x - otherVector.x, this.y - otherVector.y, this.z - otherVector.z)
    }

    static dist(vector: any, otherVector: any) {
        return Math.hypot(vector.x - otherVector.x, vector.y - otherVector.y, vector.z - otherVector.z)
    }

    distSq(otherVector: any) {
        return Math.hypot(this.x - otherVector.x, this.y - otherVector.y, this.z - otherVector.z) ** 2
    }
    static distSq(vector: any, otherVector: any) {
        return Math.hypot(vector.x - otherVector.x, vector.y - otherVector.y, vector.z - otherVector.z) ** 2
    }

    cross(otherVector: any) {
        return new Vector(
            this.y * otherVector.z - this.z * otherVector.y,
            this.z * otherVector.x - this.x * otherVector.z,
            this.x * otherVector.y - this.y * otherVector.x
        )
    }

    static cross(vector: any, otherVector: any) {
        return new Vector(
            vector.y * otherVector.z - vector.z * otherVector.y,
            vector.z * otherVector.x - vector.x * otherVector.z,
            vector.x * otherVector.y - vector.y * otherVector.x
        )
    }


    dot(otherVector: any) {
        return this.x * otherVector.x + this.y * otherVector.y + this.z * otherVector.z
    }

    static dot(vector: any, otherVector: any) {
        return vector.x * otherVector.x + vector.y * otherVector.y + vector.z * otherVector.z
    }

    maxMag(number: any) {
        let mag = Math.hypot(this.x, this.y, this.z)
        if (mag > number) {
            return this.div(mag).mult(number)
        }
        return this
    }

    minMag(number: any) {
        let mag = Math.hypot(this.x, this.y, this.z)
        if (mag < number) {
            return this.div(mag).mult(number)
        }
        return this
    }

    constrainMag(min: number, max: number) {
        let mag = Math.hypot(this.x, this.y, this.z)
        if (mag < min) {
            return this.div(mag).mult(min)
        } else if (mag > max) {
            return this.div(mag).mult(max)
        }
        return this
    }

    toArray() {
        return [this.x, this.y, this.z]
    }

    static toArray(vector: any) {
        return [vector.x, vector.y, vector.z]
    }

    matrixMult(array: [][]) {
        let vectorArray = [this.x, this.y, this.z]
        let result = []
        if (array[0].length < 1 || array[0].length > 3) {
            console.error('Columns of array must go from 1 to 3')
            return
        }
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < 3; j++) {
                let sum = 0
                for (let k = 0; k < array[0].length; k++) {
                    sum += array[i][k] * vectorArray[k]
                }
                result[i] = sum
            }
        }
        this.x = result[0] || 0
        this.y = result[1] || 0
        this.z = result[2] || 0

        return this
    }

    static matrixMult(array: [][], vector: any) {
        let vectorArray = [vector.x, vector.y, vector.z]
        let result = []
        if (array[0].length < 1 || array[0].length > 3) {
            console.error('Columns of array must go from 1 to 3')
            return
        }
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < 3; j++) {
                let sum = 0
                for (let k = 0; k < array[0].length; k++) {
                    sum += array[i][k] * vectorArray[k]
                }
                result[i] = sum
            }
        }
        return new Vector(result[0], result[1], result[2])
    }

    changeOfBasis(vi = { x: 1, y: 0, z: 0 }, vj = { x: 0, y: 1, z: 0 }, vk = { x: 0, y: 0, z: 1 }) {
        let x = this.x, y = this.y, z = this.z
        this.x = x * vi.x + y * vj.x + z * vk.x
        this.y = x * vi.y + y * vj.y + z * vk.y
        this.z = x * vi.z + y * vj.z + z * vk.z
        return this
    }

    static changeOfBasis(vector: any, vi = { x: 1, y: 0, z: 0 }, vj = { x: 0, y: 1, z: 0 }, vk = { x: 0, y: 0, z: 1 }) {
        return new Vector(
            vector.x * vi.x + vector.y * vj.x + vector.z * vk.x,
            vector.x * vi.y + vector.y * vj.y + vector.z * vk.y,
            vector.x * vi.z + vector.y * vj.z + vector.z * vk.z
        )
    }

    lerp(otherVector: any, alpha: number) {
        this.x += (otherVector.x - this.x) * alpha || 0
        this.y += (otherVector.y - this.y) * alpha || 0
        this.z += (otherVector.z - this.z) * alpha || 0
        return this
    }
    static lerp(vector: any, otherVector: any, alpha: number) {
        return new Vector(
            vector.x + (otherVector.x - vector.x) * alpha,
            vector.y + (otherVector.y - vector.y) * alpha,
            vector.z + (otherVector.z - vector.z) * alpha
        )
    }

    angleBetween(otherVector: any) {
        let magMult = this.mag() * otherVector.mag()
        if (magMult !== 0) {
            let dotOverMag = this.dot(otherVector) / magMult
            return Math.acos(Math.max(Math.min(dotOverMag, 1), -1))
        }
    }
    static angleBetween(vector: any, otherVector: any) {
        let magMult = vector.mag() * otherVector.mag()
        if (magMult !== 0) {
            let dotOverMag = vector.dot(otherVector) / magMult
            return Math.acos(Math.max(Math.min(dotOverMag, 1), -1))
        }
    }

    heading3D() {
        return [
            Math.atan2(this.y, this.x),
            Math.atan2(Math.hypot(this.x, this.y), this.z)
        ]
    }
    heading() {
        return Math.atan2(this.y, this.x)
    }

    rotate(angle: number) {
        let cosOfAngle = Math.cos(angle),
            sinOfAngle = Math.sin(angle),
            x = this.x
        this.x = x * cosOfAngle + this.y * -sinOfAngle || 0
        this.y = x * sinOfAngle + this.y * cosOfAngle || 0
        return this
    }

    static rotate(vector: any, angle: number) {
        let cosOfAngle = Math.cos(angle),
            sinOfAngle = Math.sin(angle)
        return new Vector(vector.x * cosOfAngle + vector.y * -sinOfAngle, vector.x * sinOfAngle + vector.y * cosOfAngle, vector.z)
    }

    rotateX(angle: number) {
        let cosOfAngle = Math.cos(angle),
            sinOfAngle = Math.sin(angle),
            y = this.y
        this.y = y * cosOfAngle + this.z * -sinOfAngle || 0
        this.z = y * sinOfAngle + this.z * cosOfAngle || 0
        return this
    }

    static rotateX(vector: any, angle: number) {
        let cosOfAngle = Math.cos(angle),
            sinOfAngle = Math.sin(angle)
        return new Vector(vector.x, vector.y * cosOfAngle + vector.z * -sinOfAngle, vector.y * sinOfAngle + vector.z * cosOfAngle)
    }

    rotateY(angle: number) {
        let cosOfAngle = Math.cos(angle),
            sinOfAngle = Math.sin(angle),
            x = this.x
        this.x = x * cosOfAngle + this.z * sinOfAngle || 0
        this.z = x * -sinOfAngle + this.z * cosOfAngle || 0
        return this
    }
    static rotateY(vector: any, angle: number) {
        let cosOfAngle = Math.cos(angle),
            sinOfAngle = Math.sin(angle)
        return new Vector(vector.x * cosOfAngle + vector.z * sinOfAngle, vector.y, vector.x * -sinOfAngle + vector.z * cosOfAngle)
    }


    static fromAngle(angle: number) {
        return new Vector(Math.cos(angle), Math.sin(angle))
    }
    static fromAngles(polar: number, azimuth: number) {
        return new Vector(
            Math.sin(azimuth) * Math.cos(polar),
            Math.sin(azimuth) * Math.sin(polar),
            Math.cos(azimuth)
        )
    }

    static random2D() {
        return Vector.fromAngle(Math.random() * Math.PI * 2)
    }
    static random3D() {
        return Vector.fromAngles(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2)
    }

    static scalarProyection(vertex: any, vector: any, otherVector: any) {
        let vertexVector = Vector.sub(vector, vertex)
        let vertexOtherVector = Vector.sub(otherVector, vertex)

        vertexVector.normalize()
        vertexVector.mult(vertexOtherVector.dot(vertexVector))

        return Vector.add(vertex, vertexVector)
    }

    // Constants
    static get right() {
        return new Vector(1, 0, 0)
    }
    static get left() {
        return new Vector(-1, 0, 0)
    }

    static get up() {
        return new Vector(0, 1, 0)
    }
    static get down() {
        return new Vector(0, -1, 0)
    }

    static get forward() {
        return new Vector(0, 0, 1)
    }
    static get back() {
        return new Vector(0, 0, -1)
    }

    static get zero() {
        return new Vector()
    }

    static get one() {
        return new Vector(1, 1, 1)
    }

}
export const vector = (x: number, y: number, z: number) => new Vector(x, y, z)

// // Rotation Matrices! 

// rotationX = [
//     [1, 0, 0],
//     [0, Math.cos(angle), -Math.sin(angle)],
//     [0, Math.sin(angle), Math.cos(angle)]
// ]

// rotationY = [
//     [Math.cos(angle), 0, Math.sin(angle)],
//     [0, 1, 0],
//     [-Math.sin(angle), 0, Math.cos(angle)]
// ]
// rotationZ = [
//     [Math.cos(angle), -Math.sin(angle), 0],
//     [Math.sin(angle), Math.cos(angle), 0],
//     [0, 0, 1]
// ]
