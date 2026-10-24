class Ray {
    constructor(a, b) {
        this.a = a
        this.b = b
    }
    cast(segment) {

        // RAY in parametric: Point + Delta*u
        let x1 = this.a.x;
        let y1 = this.a.y;
        let x2 = this.b.x - this.a.x;
        let y2 = this.b.y - this.a.y;

        // SEGMENT in parametric: Point + Delta*t
        let x3 = segment.a.x;
        let y3 = segment.a.y;
        let x4 = segment.b.x - segment.a.x;
        let y4 = segment.b.y - segment.a.y;

        // Are they parallel? If so, no intersect
        let r_mag = Math.hypot(x2, y2)
        let s_mag = Math.hypot(x4, y4)
        // let r_mag = sqrt(x2 * x2 + y2 * y2);
        // let s_mag = sqrt(x4 * x4 + y4 * y4);
        if (x2 / r_mag == x4 / s_mag && y2 / r_mag == y4 / s_mag) {
            // Unit vectors are the same.
            return false
        }

        // SOLVE FOR u & t
        // x1 + x2 * u = x3 + x4 * t && y1 + y2 * u = y3 + y4 * t
        //==> u = (x3 + x4 * t - x1) / x2 = (y3 + y4 * t - y1) / y2
        //==> x3 * y2 + x4 * t * y2 - x1 * y2 = y3 * x2 + y4 * t * x2 - y1 * x2
        //==> t = (x2 * (y3 - y1) + y2 * (x1 - x3)) / (x4 * y2 - y4 * x2)
        let t = (x2 * (y3 - y1) + y2 * (x1 - x3)) / (x4 * y2 - y4 * x2);
        let u = (x3 + x4 * t - x1) / x2;

        // Must be within parametic whatevers for RAY/SEGMENT
        if (u < 0) return false
        if (t < 0 || t > 1) return false

        // Return the POINT OF INTERSECTION
        // return new Vector(
        //     x1 + x2 * u,
        //     y1 + y2 * u
        // )
        return {
            x: x1 + x2 * u,
            y: y1 + y2 * u,
            param: u
        };

    }
}