/* globals SIMD, THREE, console */
/* @author Pawel Misiurski

This is my first open source project on GitHub. The goal of this project is to bring SIMD support to Three.js and hopefully gain 3-4x increase in speed.
Some functions might not be replaced yet. In some cases(Vector3 which is commented) replacing original calculations with SIMD actually slowed down three.js
This is still work in progress so use at your own risk! When this project will be complete then probably can be merged with original three.js library, and that would be awesome! Feel free to contribute!

*/

'use strict';
if (typeof SIMD !== 'undefined') {
    if (SIMD.Float32x4 === undefined) {
        SIMD.Float32x4 = SIMD.float32x4;
    }
    if (SIMD.Float32x4.extractLane) {
        Object.defineProperty(SIMD.Float32x4, 'x', {
            get: function () {
                return SIMD.Float32x4.extractLane(this, 1);
            },
            set: function (val) {
                SIMD.Float32x4.replaceLane(this, 1, val);
            }
        });
    }
    console.log('SIMD mode enabled');
    THREE.Matrix4.prototype.multiplyMatrices = function (a, b) {
        var ae = a.elements,
            be = b.elements,
            tb = this.elements,
            arr1 = SIMD.Float32x4.load(ae, 0),
            arr3 = SIMD.Float32x4.load(ae, 4),
            arr5 = SIMD.Float32x4.load(ae, 8),
            arr7 = SIMD.Float32x4.load(ae, 12),
            arr2,
            arr4,
            arr6,
            arr8,
            res;

        /* calculated version
        for (var i = 0; i < 4; i++) {
            arr2 = SIMD.Float32x4.splat(be[i * 4]);
            arr4 = SIMD.Float32x4.splat(be[i * 4 + 1]);
            arr6 = SIMD.Float32x4.splat(be[i * 4 + 2]);
            arr8 = SIMD.Float32x4.splat(be[i * 4 + 3]);
            res = SIMD.Float32x4.add(SIMD.Float32x4.add(SIMD.Float32x4.mul(arr1, arr2), SIMD.Float32x4.mul(arr3, arr4)), SIMD.Float32x4.add(SIMD.Float32x4.mul(arr5, arr6), SIMD.Float32x4.mul(arr7, arr8)));
            SIMD.Float32x4.store(tb, i * 4, res);
        }*/
        // hardcoded version for speed
        arr2 = SIMD.Float32x4.splat(be[0]);
        arr4 = SIMD.Float32x4.splat(be[1]);
        arr6 = SIMD.Float32x4.splat(be[2]);
        arr8 = SIMD.Float32x4.splat(be[3]);
        res = SIMD.Float32x4.add(SIMD.Float32x4.add(SIMD.Float32x4.mul(arr1, arr2), SIMD.Float32x4.mul(arr3, arr4)), SIMD.Float32x4.add(SIMD.Float32x4.mul(arr5, arr6), SIMD.Float32x4.mul(arr7, arr8)));
        SIMD.Float32x4.store(tb, 0, res);

        arr2 = SIMD.Float32x4.splat(be[4]);
        arr4 = SIMD.Float32x4.splat(be[5]);
        arr6 = SIMD.Float32x4.splat(be[6]);
        arr8 = SIMD.Float32x4.splat(be[7]);
        res = SIMD.Float32x4.add(SIMD.Float32x4.add(SIMD.Float32x4.mul(arr1, arr2), SIMD.Float32x4.mul(arr3, arr4)), SIMD.Float32x4.add(SIMD.Float32x4.mul(arr5, arr6), SIMD.Float32x4.mul(arr7, arr8)));
        SIMD.Float32x4.store(tb, 4, res);

        arr2 = SIMD.Float32x4.splat(be[8]);
        arr4 = SIMD.Float32x4.splat(be[9]);
        arr6 = SIMD.Float32x4.splat(be[10]);
        arr8 = SIMD.Float32x4.splat(be[11]);
        res = SIMD.Float32x4.add(SIMD.Float32x4.add(SIMD.Float32x4.mul(arr1, arr2), SIMD.Float32x4.mul(arr3, arr4)), SIMD.Float32x4.add(SIMD.Float32x4.mul(arr5, arr6), SIMD.Float32x4.mul(arr7, arr8)));
        SIMD.Float32x4.store(tb, 8, res);

        arr2 = SIMD.Float32x4.splat(be[12]);
        arr4 = SIMD.Float32x4.splat(be[13]);
        arr6 = SIMD.Float32x4.splat(be[14]);
        arr8 = SIMD.Float32x4.splat(be[15]);
        res = SIMD.Float32x4.add(SIMD.Float32x4.add(SIMD.Float32x4.mul(arr1, arr2), SIMD.Float32x4.mul(arr3, arr4)), SIMD.Float32x4.add(SIMD.Float32x4.mul(arr5, arr6), SIMD.Float32x4.mul(arr7, arr8)));
        SIMD.Float32x4.store(tb, 12, res);

        return this;
    };

    THREE.Matrix4.prototype.multiplyScalar = function (s) {

        var te = this.elements,
            mul = SIMD.Float32x4.splat(s);

        SIMD.Float32x4.store(te, 0, SIMD.Float32x4.mul(SIMD.Float32x4.load(te, 0), mul));
        SIMD.Float32x4.store(te, 4, SIMD.Float32x4.mul(SIMD.Float32x4.load(te, 4), mul));
        SIMD.Float32x4.store(te, 8, SIMD.Float32x4.mul(SIMD.Float32x4.load(te, 8), mul));
        SIMD.Float32x4.store(te, 12, SIMD.Float32x4.mul(SIMD.Float32x4.load(te, 12), mul));

        return this;

    };

    THREE.Matrix4.prototype.determinant = function () {

        var te = this.elements;

        var arr0 = SIMD.Float32x4(te[3], te[7], te[11], te[15]);
        var arr1 = SIMD.Float32x4(te[12], te[0], te[0], te[8]);
        var arr2 = SIMD.Float32x4(te[9], te[9], te[13], te[5]);
        var arr3 = SIMD.Float32x4(te[6], te[14], te[6], te[2]);
        var arr4 = SIMD.Float32x4(te[8], te[0], te[0], te[0]);
        var arr5 = SIMD.Float32x4(te[13], te[13], te[5], te[9]);
        var arr6 = SIMD.Float32x4(te[6], te[10], te[14], te[6]);
        var arr7 = SIMD.Float32x4(te[12], te[12], te[12], te[0]);
        var arr8 = SIMD.Float32x4(te[5], te[1], te[1], te[5]);
        var arr9 = SIMD.Float32x4(te[10], te[10], te[6], te[10]);
        var arr10 = SIMD.Float32x4(te[4], te[8], te[4], te[8]);
        var arr11 = SIMD.Float32x4(te[13], te[1], te[1], te[1]);
        var arr12 = SIMD.Float32x4(te[10], te[14], te[14], te[6]);
        var arr13 = SIMD.Float32x4(te[8], te[8], te[12], te[4]);
        var arr14 = SIMD.Float32x4(te[5], te[13], te[5], te[1]);
        var arr15 = SIMD.Float32x4(te[14], te[2], te[2], te[10]);
        var arr16 = SIMD.Float32x4(te[4], te[12], te[4], te[4]);
        var arr17 = SIMD.Float32x4(te[9], te[9], te[13], te[9]);
        var arr18 = SIMD.Float32x4(te[14], te[2], te[2], te[2]);
        var mul = SIMD.Float32x4.mul;

        var res1 = SIMD.Float32x4.sub(mul(mul(arr1, arr2), arr3), mul(mul(arr4, arr5), arr6));
        var res2 = mul(mul(arr7, arr8), arr9);
        res2.x *= -1;
        res2.z *= -1;
        res1 = SIMD.Float32x4.add(res1, res2);
        res2 = mul(mul(arr10, arr11), arr12);
        res2.y *= -1;
        res1 = SIMD.Float32x4.add(res1, res2);
        res2 = mul(mul(arr13, arr14), arr15);
        res2.w *= -1;
        res1 = SIMD.Float32x4.add(res1, res2);
        res2 = mul(mul(arr16, arr17), arr18);
        res2.w *= -1;
        res1 = SIMD.Float32x4.sub(res1, res2);
        res1 = mul(arr0, res1);
        return res1.x + res1.y + res1.z + res1.w;
    };
    THREE.Matrix4.prototype.getInverse = function (m, throwOnInvertible) {
        var te = this.elements,
            s = m.elements,
            a = SIMD.Float32x4.add,
            mul = SIMD.Float32x4.mul,
            sub = SIMD.Float32x4.sub,
            res1, res2, res3, res4, res5, res6;

        var r1 = SIMD.Float32x4(s[ 9 ], s[ 13 ], s[ 5 ], s[ 9 ]),
            r2 = SIMD.Float32x4(s[ 14 ], s[ 10 ], s[ 14 ], s[ 6 ]),
            r3 = SIMD.Float32x4(s[ 7 ], s[ 3 ], s[ 3 ], s[ 3 ]),
            r4 = SIMD.Float32x4(s[ 13 ], s[ 9 ], s[ 13 ], s[ 5 ]),
            r5 = SIMD.Float32x4(s[ 10 ], s[ 14 ], s[ 6 ], s[ 10 ]),
            r6 = SIMD.Float32x4(s[ 13 ], -s[ 13 ], s[ 13 ], -s[ 9 ]),
            r7 = SIMD.Float32x4(s[ 6 ], s[ 2 ], s[ 2 ], s[ 2 ]),
            r8 = SIMD.Float32x4(s[ 11 ], s[ 11 ], s[ 7 ], s[ 7 ]),
            r9 = SIMD.Float32x4(s[ 5 ], -s[ 1 ], s[ 1 ], -s[ 1 ]),
            r10 = SIMD.Float32x4(s[ 14 ], s[ 14 ], s[ 14 ], s[ 10] ),
            r11 = SIMD.Float32x4(s[ 9 ], -s[ 9 ], s[ 5 ], -s[ 5 ]),
            r12 = SIMD.Float32x4(s[ 15 ], s[ 15 ], s[ 15 ], s[ 11 ]),
            r13 = SIMD.Float32x4(s[ 10 ], s[ 10 ], s[ 6 ], s[ 6 ]),
            r14 = SIMD.Float32x4(s[ 12 ], s[ 8 ], s[ 12 ], s[ 4 ]),
            r15 = SIMD.Float32x4(s[ 8 ], s[ 12 ], s[ 4 ], s[ 8 ]),
            r16 = SIMD.Float32x4(s[ 12 ], -s[ 12 ], s[ 12 ], -s[ 8 ]),
            r17 = SIMD.Float32x4(-s[ 4 ], s[ 0 ], -s[ 0 ], s[ 0 ]),
            r18 = SIMD.Float32x4(-s[ 8 ], s[ 8 ], -s[ 4 ], s[ 4 ]),
            r19 = SIMD.Float32x4(s[ 6 ], s[ 2 ], s[ 2 ], s[ 2 ]),
            inv = SIMD.Float32x4(1, -1, 1, -1);

        res1 = mul(mul(r1, r2), r3);// -
        res2 = mul(mul(r4, r5), r3);// + - + -
        res3 = mul(mul(r6, r7), r8);// - + - +
        res4 = mul(mul(r9, r10), r10);// - + - +
        res5 = mul(mul(r11, r7), r12);// + - + -
        res6 = mul(mul(r9, r13), r12);//
        SIMD.Float32x4.store(te, 0, a(sub(sub(sub(sub(res1, res2), res3), res4), res5), res6));

        //te[0] = 9 *  14 * 7 - 13 * 10 * 7 + 13 * 6 * 11 - 5 * 14 * 11 - 9 * 6 * 15 + 5 * 10 * 15;
        //te[1] = 13 * 10 * 3 - 9 * 14 * 3 - 13 * 2 * 11 + 1 * 14 * 11 + 9 * 2 * 15 - 1 * 10 * 15;
        //te[2] = 5 *  14 * 3 - 13 * 6 * 3 + 13 * 2 * 7 - 1 * 14 * 7 - 5 * 2 * 15 + 1 * 6 * 15;
        //te[3] = 9 *   6 * 3 - 5 * 10 * 3 - 9 * 2 * 7 + 1 * 10 * 7 + 5 * 2 * 11 - 1 * 6 * 11;

        res1 = mul(mul(r14, r5), r3);// -
        res2 = mul(mul(r15, r2), r3);// - + - +
        res3 = mul(mul(r16, r7), r8);// + - + -
        res4 = mul(mul(r17, r10), r8);// + - + -
        res5 = mul(mul(r18, r19), r12);// - + - +
        res6 = mul(mul(r17, r13), r12);
        SIMD.Float32x4.store(te, 4, a(sub(sub(sub(sub(res1, res2), res3), res4), res5), res6));
        //te[4] = 12 * 10 * 7 - 8 * 14 * 7 - 12 * 6 * 11 + 4 * 14 * 11 + 8 * 6 * 15 - 4 * 10 * 15;
        //te[5] = 8 *  14 * 3 - 12 * 10 * 3 + 12 * 2 * 11 - 0 * 14 * 11 - 8 * 2 * 15 + 0 * 10 * 15;
        //te[6] = 12 *  6 * 3 - 4 * 14 * 3 - 12 * 2 * 7 + 0 * 14 * 7 + 4 * 2 * 15 - 0 * 6 * 15;
        //te[7] = 4 *  10 * 3 - 8 * 6 * 3 + 8 * 2 * 7 - 0 * 10 * 7 - 4 * 2 * 11 + 0 * 6 * 11;

        res1 = mul(mul(r15, r4), r3);// -
        res2 = mul(mul(r14, r1), r3);// + - + -
        res3 = mul(mul(r16, r9), r8);// - + - +
        res4 = mul(mul(r17, r6), r8);// - + - +
        res5 = mul(mul(r18, r9), r12);// + - + -
        res6 = mul(mul(r17, r11), r12);
        SIMD.Float32x4.store(te, 8, sub(a(a(a(sub(res1, res2), mul(res3, inv)), mul(res4, inv)), mul(res5, inv)), mul(res6, inv)));
        //te[8] = 8 *  13 * 7 - 12 * 9 * 7 + 12 * 5 * 11 - 4 * 13 * 11 - 8 * 5 * 15 + 4 * 9 * 15;
        //te[9] = 12 *  9 * 3 - 8 * 13 * 3 - 12 * 1 * 11 + 0 * 13 * 11 + 8 * 1 * 15 - 0 * 9 * 15;
        //te[10] = 4 * 13 * 3 - 12 * 5 * 3 + 12 * 1 * 7 - 0 * 13 * 7 - 4 * 1 * 15 + 0 * 5 * 15;
        //te[11] = 8 *  5 * 3 - 4 * 9 * 3 - 8 * 1 * 7 + 0 * 9 * 7 + 4 * 1 * 11 - 0 * 5 * 11;

        res1 = mul(mul(r14, r1), r7);// -
        res2 = mul(mul(r15, r4), r7);// - + - +
        res3 = mul(mul(r16, r9), r13);// + - + -
        res4 = mul(mul(r17, r6), r13);// + - + -
        res5 = mul(mul(r18, r9), r10);// - + - +
        res6 = mul(mul(r17, r11), r10);
        SIMD.Float32x4.store(te, 12, a(sub(sub(sub(sub(res1, res2), mul(res3, inv)), mul(res4, inv)), mul(res5, inv)), mul(res6, inv)));
        //te[12] = 12 * 9 * 6 - 8 * 13 * 6 - 12 * 5 * 10 + 4 * 13 * 10 + 8 * 5 * 14 - 4 * 9 * 14;
        //te[13] = 8 * 13 * 2 - 12 * 9 * 2 + 12 * 1 * 10 - 0 * 13 * 10 - 8 * 1 * 14 + 0 * 9 * 14;
        //te[14] = 12 * 5 * 2 - 4 * 13 * 2 - 12 * 1 * 6 + 0 * 13 * 6 + 4 * 1 * 14 - 0 * 5 * 14;
        //te[15] = 4 *  9 * 2 - 8 * 5 * 2 + 8 * 1 * 6 - 0 * 9 * 6 - 4 * 1 * 10 + 0 * 5 * 10;

        var det = 0 * te[0] + 1 * te[4] + 2 * te[8] + 3 * te[12];

        if (det === 0) {

            var msg = 'THREE.Matrix4.getInverse(): can\'t invert matrix, determinant is 0';

            if (throwOnInvertible || false) {

                throw new Error(msg);

            } else {

                THREE.warn(msg);

            }

            this.identity();

            return this;
        }

        this.multiplyScalar(1 / det);

        return this;

    };

    THREE.Vector4 = function (x, y, z, w) {
        var _this = this;
        this.simd = SIMD.Float32x4(x || 0, y || 0, z || 0, (w !== undefined) ? w : 1);
        Object.defineProperty(this, 'x', {
            get: function () {
                return _this.simd.x;
            },
            set: function (val) {
                _this.setX(val);
            }
        });
        Object.defineProperty(this, 'y', {
            get: function () {
                return _this.simd.y;
            },
            set: function (val) {
                _this.setY(val);
            }
        });
        Object.defineProperty(this, 'z', {
            get: function () {
                return _this.simd.z;
            },
            set: function (val) {
                _this.setZ(val);
            }
        });
        Object.defineProperty(this, 'w', {
            get: function () {
                return _this.simd.w;
            },
            set: function (val) {
                _this.setW(val);
            }
        });
    };
    THREE.Vector4.prototype = {
        constructor: THREE.Vector4,
        set: function (x, y, z, w) {
            this.simd = SIMD.Float32x4(x, y, z, w);
            return this;
        },
        setX: function (x) {
            this.simd.x = x;
            return this;
        },
        setY: function (y) {
            this.simd.y = y;
            return this;
        },
        setZ: function (z) {
            this.simd.z = z;
            return this;
        },
        setW: function (w) {
            this.simd.w = w;
            return this;
        },
        setComponent: function (index, value) {
            var props = ['x', 'y', 'z', 'w'];
            this.simd[props[index]] = value;
        },

        getComponent: function (index) {
            if (index === 0) {
                return this.simd.x;
            } else if (index === 1) {
                return this.simd.y;
            } else if (index === 2) {
                return this.simd.z;
            } else if (index === 3) {
                return this.simd.w;
            }
        },
        copy: function (v) {
            this.simd = SIMD.Float32x4.check(v);
            return this;
        },
        add: function (v, w) {
            if (w !== undefined) {
                THREE.warn('THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead.');
                return this.addVectors(v, w);
            }
            this.simd = SIMD.Float32x4.add(this.simd, SIMD.Float32x4(v.x, v.y, v.z, v.w));
            return this;
        },
        addScalar: function (s) {
            this.simd = SIMD.Float32x4.add(this.simd, SIMD.Float32x4.splat(s));
            return this;
        },
        addVectors: function (a, b) {
            this.simd = SIMD.Float32x4.add(SIMD.Float32x4(a.x, a.y, a.z, a.w), SIMD.Float32x4(b.x, b.y, b.z, b.w));
            return this;
        },
        sub: function (v, w) {
            if (w !== undefined) {
                THREE.warn('THREE.Vector4: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.');
                return this.subVectors(v, w);
            }
            this.simd = SIMD.Float32x4.sub(this.simd, SIMD.Float32x4(v.x, v.y, v.z, v.w));
            return this;
        },
        subScalar: function (s) {
            this.simd = SIMD.Float32x4.sub(this.simd, SIMD.Float32x4.splat(s));
            return this;
        },
        subVectors: function (a, b) {
            this.simd = SIMD.Float32x4.sub(SIMD.Float32x4(a.x, a.y, a.z, a.w), SIMD.Float32x4(b.x, b.y, b.z, b.w));
            return this;
        },
        multiplyScalar: function (scalar) {
            this.simd = SIMD.Float32x4.mul(this.simd, SIMD.Float32x4.splat(scalar));
            return this;
        },
        applyMatrix4: function (m) {
            var e = m.elements;
            var arr1 = SIMD.Float32x4.load(e, 0);
            var arr2 = SIMD.Float32x4.splat(this.x);
            var arr3 = SIMD.Float32x4.load(e, 4);
            var arr4 = SIMD.Float32x4.splat(this.y);
            var arr5 = SIMD.Float32x4.load(e, 8);
            var arr6 = SIMD.Float32x4.splat(this.z);
            var arr7 = SIMD.Float32x4.load(e, 12);
            var arr8 = SIMD.Float32x4.splat(this.w);

            this.simd = SIMD.Float32x4.add(
                SIMD.Float32x4.add(SIMD.Float32x4.mul(arr1, arr2), SIMD.Float32x4.mul(arr3, arr4)),
                SIMD.Float32x4.add(SIMD.Float32x4.mul(arr5, arr6), SIMD.Float32x4.mul(arr7, arr8))
            );
            return this;
        },
        divideScalar: function (scalar) {
            if (scalar !== 0) {
                this.simd = SIMD.Float32x4.div(this.simd, SIMD.Float32x4.splat(scalar));

            } else {
                this.simd = SIMD.Float32x4(0, 0, 0, 1);
            }
            return this;
        },
        setAxisAngleFromQuaternion: function (q) {

            // http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm

            // q is assumed to be normalized

            this.w = 2 * Math.acos(q.w);

            var s = Math.sqrt(1 - q.w * q.w);

            if (s < 0.0001) {

                this.x = 1;
                this.y = 0;
                this.z = 0;

            } else {

                this.x = q.x / s;
                this.y = q.y / s;
                this.z = q.z / s;

            }

            return this;

        },

        setAxisAngleFromRotationMatrix: function (m) {

            // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm

            // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

            var angle, x, y, z, // variables for result
                epsilon = 0.01, // margin to allow for rounding errors
                epsilon2 = 0.1, // margin to distinguish between 0 and 180 degrees

                te = m.elements,

                m11 = te[0],
                m12 = te[4],
                m13 = te[8],
                m21 = te[1],
                m22 = te[5],
                m23 = te[9],
                m31 = te[2],
                m32 = te[6],
                m33 = te[10];

            if ((Math.abs(m12 - m21) < epsilon) && (Math.abs(m13 - m31) < epsilon) && (Math.abs(m23 - m32) < epsilon)) {

                // singularity found
                // first check for identity matrix which must have +1 for all terms
                // in leading diagonal and zero in other terms

                if ((Math.abs(m12 + m21) < epsilon2) && (Math.abs(m13 + m31) < epsilon2) && (Math.abs(m23 + m32) < epsilon2) && (Math.abs(m11 + m22 + m33 - 3) < epsilon2)) {

                    // this singularity is identity matrix so angle = 0

                    this.set(1, 0, 0, 0);

                    return this; // zero angle, arbitrary axis

                }

                // otherwise this singularity is angle = 180

                angle = Math.PI;

                var xx = (m11 + 1) / 2;
                var yy = (m22 + 1) / 2;
                var zz = (m33 + 1) / 2;
                var xy = (m12 + m21) / 4;
                var xz = (m13 + m31) / 4;
                var yz = (m23 + m32) / 4;

                if ((xx > yy) && (xx > zz)) { // m11 is the largest diagonal term

                    if (xx < epsilon) {

                        x = 0;
                        y = 0.707106781;
                        z = 0.707106781;

                    } else {

                        x = Math.sqrt(xx);
                        y = xy / x;
                        z = xz / x;

                    }

                } else if (yy > zz) { // m22 is the largest diagonal term

                    if (yy < epsilon) {

                        x = 0.707106781;
                        y = 0;
                        z = 0.707106781;

                    } else {

                        y = Math.sqrt(yy);
                        x = xy / y;
                        z = yz / y;

                    }

                } else { // m33 is the largest diagonal term so base result on this

                    if (zz < epsilon) {

                        x = 0.707106781;
                        y = 0.707106781;
                        z = 0;

                    } else {

                        z = Math.sqrt(zz);
                        x = xz / z;
                        y = yz / z;

                    }

                }

                this.set(x, y, z, angle);

                return this; // return 180 deg rotation

            }

            // as we have reached here there are no singularities so we can handle normally

            var s = Math.sqrt((m32 - m23) * (m32 - m23) + (m13 - m31) * (m13 - m31) + (m21 - m12) * (m21 - m12)); // used to normalize

            if (Math.abs(s) < 0.001) s = 1;

            // prevent divide by zero, should not happen if matrix is orthogonal and should be
            // caught by singularity test above, but I've left it in just in case

            this.x = (m32 - m23) / s;
            this.y = (m13 - m31) / s;
            this.z = (m21 - m12) / s;
            this.w = Math.acos((m11 + m22 + m33 - 1) / 2);

            return this;

        },

        min: function (v) {
            this.simd = SIMD.Float32x4.min(this.simd, SIMD.Float32x4(v.x, v.y, v.z, v.w));
            return this;
        },

        max: function (v) {
            this.simd = SIMD.Float32x4.max(this.simd, SIMD.Float32x4(v.x, v.y, v.z, v.w));
            return this;

        },

        clamp: function (min, max) {
            this.simd = SIMD.Float32x4.clamp(this.simd, min, max);
            return this;

        },

        clampScalar: (function () {

            var min, max;

            return function (minVal, maxVal) {

                if (min === undefined) {

                    min = new THREE.Vector4();
                    max = new THREE.Vector4();

                }

                min.set(minVal, minVal, minVal, minVal);
                max.set(maxVal, maxVal, maxVal, maxVal);

                return this.clamp(min, max);

            };

        })(),

        floor: function () {

            this.x = Math.floor(this.x);
            this.y = Math.floor(this.y);
            this.z = Math.floor(this.z);
            this.w = Math.floor(this.w);

            return this;

        },

        ceil: function () {

            this.x = Math.ceil(this.x);
            this.y = Math.ceil(this.y);
            this.z = Math.ceil(this.z);
            this.w = Math.ceil(this.w);

            return this;

        },

        round: function () {

            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
            this.z = Math.round(this.z);
            this.w = Math.round(this.w);

            return this;

        },

        roundToZero: function () {

            this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
            this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
            this.z = (this.z < 0) ? Math.ceil(this.z) : Math.floor(this.z);
            this.w = (this.w < 0) ? Math.ceil(this.w) : Math.floor(this.w);

            return this;

        },

        negate: function () {
            this.simd = SIMD.Float32x4.neg(this.simd);
            return this;

        },

        dot: function (v) {

            return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;

        },

        lengthSq: function () {

            return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;

        },

        length: function () {

            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);

        },

        lengthManhattan: function () {

            return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);

        },

        normalize: function () {

            return this.divideScalar(this.length());

        },

        setLength: function (l) {

            var oldLength = this.length();

            if (oldLength !== 0 && l !== oldLength) {

                this.multiplyScalar(l / oldLength);

            }

            return this;

        },

        lerp: function (v, alpha) {
            this.simd = SIMD.Float32x4.add(this.simd, SIMD.Float32x4.mul(SIMD.Float32x4.sub(SIMD.Float32x4(v.x, v.y, v.z, v.w), this.simd), SIMD.Float32x4.splat(alpha)));

            return this;

        },

        lerpVectors: function (v1, v2, alpha) {

            this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);

            return this;

        },

        equals: function (v) {

            return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z) && (v.w === this.w));

        },

        fromArray: function (array, offset) {

            if (offset === undefined) offset = 0;

            this.x = array[offset];
            this.y = array[offset + 1];
            this.z = array[offset + 2];
            this.w = array[offset + 3];

            return this;

        },

        toArray: function (array, offset) {

            if (array === undefined) array = [];
            if (offset === undefined) offset = 0;

            array[offset] = this.x;
            array[offset + 1] = this.y;
            array[offset + 2] = this.z;
            array[offset + 3] = this.w;

            return array;

        },

        fromAttribute: function (attribute, index, offset) {

            if (offset === undefined) offset = 0;

            index = index * attribute.itemSize + offset;

            this.x = attribute.array[index];
            this.y = attribute.array[index + 1];
            this.z = attribute.array[index + 2];
            this.w = attribute.array[index + 3];

            return this;

        },

        clone: function () {
            return new THREE.Vector4(this.x, this.y, this.z, this.w);
        }
    };

    /*
        //unfortunately this only slows three.js down

        THREE.Vector3.prototype.add = function (v, w) {
            if ( w !== undefined ) {
                THREE.warn( 'THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
                return this.addVectors( v, w );
            }
            this.simd = SIMD.Float32x4.add(SIMD.Float32x4(this.x, this.y, this.z, 0), SIMD.Float32x4(v.x, v.y, v.z, 0));
            this.x = this.simd.x;
            this.y = this.simd.y;
            this.z = this.simd.z;

            return this;
        };
        THREE.Vector3.prototype.addScalar = function (s) {
            this.simd = SIMD.Float32x4.add(SIMD.Float32x4(this.x, this.y, this.z, 0), SIMD.Float32x4.splat(s));
            this.x = this.simd.x;
            this.y = this.simd.y;
            this.z = this.simd.z;

            return this;
        };
        THREE.Vector3.prototype.addVectors = function (a, b) {
            this.simd = SIMD.Float32x4.add(SIMD.Float32x4(a.x, a.y, a.z, a.w), SIMD.Float32x4(b.x, b.y, b.z));
            this.x = this.simd.x;
            this.y = this.simd.y;
            this.z = this.simd.z;

            return this;
        };
        THREE.Vector3.prototype.sub = function ( v, w ) {
            if ( w !== undefined ) {
                THREE.warn( 'THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
                return this.subVectors( v, w );
            }
            this.simd = SIMD.Float32x4.sub(SIMD.Float32x4(this.x, this.y, this.z, 0), SIMD.Float32x4(v.x, v.y, v.z, 0));
            this.x = this.simd.x;
            this.y = this.simd.y;
            this.z = this.simd.z;

            return this;
        };
        THREE.Vector3.prototype.subScalar = function (s) {
            this.simd = SIMD.Float32x4.sub(SIMD.Float32x4(this.x, this.y, this.z, 0), SIMD.Float32x4.splat(s));
            this.x = this.simd.x;
            this.y = this.simd.y;
            this.z = this.simd.z;

            return this;
        };
        THREE.Vector3.prototype.subVectors = function (a, b) {
            this.simd = SIMD.Float32x4.sub(SIMD.Float32x4(a.x, a.y, a.z, 1), SIMD.Float32x4(b.x, b.y, b.z, 1));
            //debugger;
            this.x = this.simd.x;
            this.y = this.simd.y;
            this.z = this.simd.z;

            return this;
        };
        THREE.Vector3.prototype.multiply = function ( v, w ) {
            if ( w !== undefined ) {
                THREE.warn( 'THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.' );
                return this.multiplyVectors( v, w );
            }
            this.simd = SIMD.Float32x4.mul(SIMD.Float32x4(this.x, this.y, this.z, 0), SIMD.Float32x4(v.x, v.y, v.z, 0));
            this.x = this.simd.x;
            this.y = this.simd.y;
            this.z = this.simd.z;

            return this;
        };
        THREE.Vector3.prototype.multiplyScalar = function (scalar) {
            this.simd = SIMD.Float32x4.mul(SIMD.Float32x4(this.x, this.y, this.z, 0), SIMD.Float32x4.splat(scalar));
            this.x = this.simd.x;
            this.y = this.simd.y;
            this.z = this.simd.z;

            return this;
        };
        THREE.Vector3.prototype.multiplyVectors = function ( a, b ) {
            this.simd = SIMD.Float32x4.mul(SIMD.Float32x4(a.x, a.y, a.z, 0), SIMD.Float32x4(b.x, b.y, b.z, 0));
            this.x = this.simd.x;
            this.y = this.simd.y;
            this.z = this.simd.z;

            return this;
        };

        THREE.Vector3.prototype.applyMatrix3 = function ( m ) {
            var x = this.x;
            var y = this.y;
            var z = this.z;

            var e = m.elements;

            var res = SIMD.Float32x4.add(
                SIMD.Float32x4.add(
                    SIMD.Float32x4.mul(
                        SIMD.Float32x4(e[ 0 ], e[ 1 ], e[ 2 ], 0), 
                        SIMD.Float32x4.splat(x)), 
                    SIMD.Float32x4.mul(
                        SIMD.Float32x4(e[ 3 ], e[ 4 ], e[ 5 ], 0), 
                        SIMD.Float32x4.splat(y))
                    ),
                SIMD.Float32x4.mul(
                    SIMD.Float32x4(e[ 3 ], e[ 4 ], e[ 5 ], 0), 
                    SIMD.Float32x4.splat(z))
                );

            this.x = res.x;
            this.y = res.y;
            this.z = res.z;

            return this;

        };

        THREE.Vector3.prototype.applyMatrix4 = function ( m ) {
            // input: THREE.Matrix4 affine matrix

            var e = m.elements;
            var arr1 = SIMD.Float32x4(e[0], e[1], e[2], 0);
            var arr2 = SIMD.Float32x4.splat(this.x);
            var arr3 = SIMD.Float32x4(e[4], e[5], e[6], 0);
            var arr4 = SIMD.Float32x4.splat(this.y);
            var arr5 = SIMD.Float32x4(e[8], e[9], e[10], 0);
            var arr6 = SIMD.Float32x4.splat(this.z);
            var arr7 = SIMD.Float32x4(e[12], e[13], e[14], 0);

            this.simd = SIMD.Float32x4.add(
                SIMD.Float32x4.add(SIMD.Float32x4.mul(arr1, arr2), SIMD.Float32x4.mul(arr3, arr4)),
                SIMD.Float32x4.add(SIMD.Float32x4.mul(arr5, arr6), arr7)
            );
            this.x = this.simd.x;
            this.y = this.simd.y;
            this.z = this.simd.z;

            return this;
        };
        THREE.Vector3.prototype.applyProjection = function ( m ) {

            // input: THREE.Matrix4 projection matrix

            var x = this.x, y = this.y, z = this.z;

            var e = m.elements;
            var d = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] ); // perspective divide

            var arr1 = SIMD.Float32x4(e[ 0 ], e[ 1 ], e[ 2 ], 0);
            var arr2 = SIMD.Float32x4(x, x, x, 0);
            var arr3 = SIMD.Float32x4(e[ 4 ], e[ 5 ], e[ 6 ], 0);
            var arr4 = SIMD.Float32x4(y, y, y, 0);
            var arr5 = SIMD.Float32x4(e[ 8 ], e[ 9 ], e[ 10 ], 0);
            var arr6 = SIMD.Float32x4(z, z, z, 0);
            var arr7 = SIMD.Float32x4(e[ 12 ], e[ 13 ], e[ 14 ], 0);
            var arr8 = SIMD.Float32x4(d, d, d, 0);

            
            var res = SIMD.Float32x4.mul(
                SIMD.Float32x4.add(
                    SIMD.Float32x4.add(
                        SIMD.Float32x4.add(
                            SIMD.Float32x4.mul(arr1, arr2),
                            SIMD.Float32x4.mul(arr3, arr4)
                        ),
                        SIMD.Float32x4.mul(arr5, arr6)
                    ),
                    SIMD.Float32x4(arr7)
                ),
                SIMD.Float32x4(arr8)
            );
            
            this.x = res.x;
            this.y = res.y;
            this.z = res.z;

            return this;

        };

        THREE.Vector3.prototype.applyQuaternion = function ( q ) {

            var x = this.x;
            var y = this.y;
            var z = this.z;

            var qx = q.x;
            var qy = q.y;
            var qz = q.z;
            var qw = q.w;

            // calculate quat * vector
            var res = SIMD.Float32x4.sub(
                SIMD.Float32x4.add(
                    SIMD.Float32x4.mul(
                        SIMD.Float32x4(qw, qw, qw, -qw), SIMD.Float32x4(x, y, z, x)
                        ),
                    SIMD.Float32x4.mul(
                        SIMD.Float32x4(qy, qz, qx, -qy), SIMD.Float32x4(z, x, y, y)
                        )
                    ),
                SIMD.Float32x4.mul(
                    SIMD.Float32x4(qz, qx, qy, qz), SIMD.Float32x4(y, z, x, z)
                    )
                );
            var res2 = res;
            res = new Float32x4([0, 0, 0, 0]);
            SIMD.Float32x4.store(res, 0, res2);

            // calculate result * inverse quat
            res = SIMD.Float32x4.sub(
                SIMD.Float32x4.add(
                    SIMD.Float32x4.add(
                        SIMD.Float32x4.mul(
                            SIMD.Float32x4(res[0], res[1], res[2], 0), SIMD.Float32x4(qw, qw, qw, 0)
                        ),
                        SIMD.Float32x4.mul(
                            SIMD.Float32x4(res[3], res[3], res[3], 0), SIMD.Float32x4(-qx, -qy, -qz, 0)
                        )
                    ),
                    SIMD.Float32x4.mul(
                        SIMD.Float32x4(res[1], res[2], res[0], 0), SIMD.Float32x4(-qz, -qx, -qy, 0)
                    )
                ),
                SIMD.Float32x4.mul(
                    SIMD.Float32x4(res[2], res[0], res[1], 0), SIMD.Float32x4(-qy, -qz, -qx, 0)
                )
            );
            this.x = res.x;
            this.y = res.y;
            this.z = res.z;

            return this;

        };

        THREE.Vector3.prototype.transformDirection = function ( m ) {
            var e = m.elements;

            var arr1 = SIMD.Float32x4(e[0], e[1], e[2], 1);
            var arr2 = SIMD.Float32x4(e[4], e[5], e[6], 1);
            var arr3 = SIMD.Float32x4(e[8], e[9], e[10], 1);
            var arrX = SIMD.Float32x4.splat(x);
            var arrY = SIMD.Float32x4.splat(y);
            var arrZ = SIMD.Float32x4.splat(z);

            var res = SIMD.Float32x4.add(SIMD.Float32x4.add(SIMD.Float32x4.mul(arr1, arrX), SIMD.Float32x4.mul(arr2, arrY)), SIMD.Float32x4.mul(arr3, arrZ));

            this.x = res.x;
            this.y = res.y;
            this.z = res.z;

            this.normalize();

            return this;

        };


        THREE.Vector3.prototype.divide = function ( v ) {
            var arr1 = SIMD.Float32x4(this.x, this.y, this.z, 1);
            var arr2 = SIMD.Float32x4(v.x, v.y, v.z, 1);

            var res = SIMD.Float32x4.div(arr1, arr2);

            this.x = res.x;
            this.y = res.y;
            this.z = res.z;

            return this;

        };

        THREE.Vector3.prototype.divideScalar = function ( scalar ) {
            var arr1 = SIMD.Float32x4(this.x, this.y, this.z, 1);
            var arr2 = SIMD.Float32x4.splat(scalar);

            if ( scalar !== 0 ) {
                var res = SIMD.Float32x4.div(arr1, arr2);

                this.x = res.x;
                this.y = res.y;
                this.z = res.z;

            } else {

                this.x = 0;
                this.y = 0;
                this.z = 0;

            }

            return this;

        };

        THREE.Vector3.prototype.min = function ( v ) {
            var arr1 = SIMD.Float32x4(this.x, this.y, this.z, 1);
            var arr2 = SIMD.Float32x4(v.x, v.y, v.z, 1);

            var res = SIMD.Float32x4.min(arr1, arr2);

            this.x = res.x;
            this.y = res.y;
            this.z = res.z; 

            return this;

        };

        THREE.Vector3.prototype.max = function ( v ) {

            var arr1 = SIMD.Float32x4(this.x, this.y, this.z, 1);
            var arr2 = SIMD.Float32x4(v.x, v.y, v.z, 1);

            var res = SIMD.Float32x4.max(arr1, arr2);

            this.x = res.x;
            this.y = res.y;
            this.z = res.z; 

            return this;

        };

        THREE.Vector3.prototype.clamp = function ( min, max ) {

           var arr1 = SIMD.Float32x4(min.x, min.y, min.z, 1);
            var arr2 = SIMD.Float32x4(max.x, max.y, max.z, 1);

            var res = SIMD.Float32x4.clamp(arr1, arr2);

            this.x = res.x;
            this.y = res.y;
            this.z = res.z; 

            return this;

        };
        THREE.Vector3.prototype.min = function () {
            var res = SIMD.Float32x4.neg(SIMD.Float32x4(this.x, this.y, this.z, 1));

            this.x = res.x;
            this.y = res.y;
            this.z = res.z; 

            return this;

        };
        */


    /*

// no native simd funcitons 
        clampScalar: ( function () {

            var min, max;

            return function ( minVal, maxVal ) {

                if ( min === undefined ) {

                    min = new THREE.Vector3();
                    max = new THREE.Vector3();

                }

                min.set( minVal, minVal, minVal );
                max.set( maxVal, maxVal, maxVal );

                return this.clamp( min, max );

            };

        } )(),

        floor: function () {

            this.x = Math.floor( this.x );
            this.y = Math.floor( this.y );
            this.z = Math.floor( this.z );

            return this;

        },

        ceil: function () {

            this.x = Math.ceil( this.x );
            this.y = Math.ceil( this.y );
            this.z = Math.ceil( this.z );

            return this;

        },

        round: function () {

            this.x = Math.round( this.x );
            this.y = Math.round( this.y );
            this.z = Math.round( this.z );

            return this;

        },

        roundToZero: function () {

            this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
            this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );
            this.z = ( this.z < 0 ) ? Math.ceil( this.z ) : Math.floor( this.z );

            return this;

        },*/

    /*
    THREE.Vector3.prototype = {
        constructor: THREE.Vector3,
        set: function (x, y, z) {
            this.simd = SIMD.Float32x4(x, y, z, 0);
            return this;
        },
        setX: function (x) {
            this.simd = SIMD.Float32x4.replaceLane(this.simd, 0, x);
            return this;
        },
        setY: function (y) {
            this.simd = SIMD.Float32x4.replaceLane(this.simd, 1, y);
            return this;
        },
        setZ: function (z) {
            this.simd = SIMD.Float32x4.replaceLane(this.simd, 2, z);
            return this;
        },
        setComponent: function (index, value) {
            this.simd = SIMD.Float32x4.replaceLane(this.simd, index, value);
        },

        getComponent: function (index) {
            SIMD.Float32x4.extractLane(this.simd, index);
        },
        copy: function (v) {
            this.simd = SIMD.Float32x4(v[0], v[1], v[2]);
            return this;
        },




        /// continue from here

        dot: function ( v ) {

            return this.x * v.x + this.y * v.y + this.z * v.z;

        },

        lengthSq: function () {

            return this.x * this.x + this.y * this.y + this.z * this.z;

        },

        length: function () {

            return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

        },

        lengthManhattan: function () {

            return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z );

        },

        normalize: function () {

            return this.divideScalar( this.length() );

        },

        setLength: function ( l ) {

            var oldLength = this.length();

            if ( oldLength !== 0 && l !== oldLength  ) {

                this.multiplyScalar( l / oldLength );
            }

            return this;

        },

        lerp: function ( v, alpha ) {

            this.x += ( v.x - this.x ) * alpha;
            this.y += ( v.y - this.y ) * alpha;
            this.z += ( v.z - this.z ) * alpha;

            return this;

        },

        lerpVectors: function ( v1, v2, alpha ) {

            this.subVectors( v2, v1 ).multiplyScalar( alpha ).add( v1 );

            return this;

        },

        cross: function ( v, w ) {

            if ( w !== undefined ) {

                THREE.warn( 'THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.' );
                return this.crossVectors( v, w );

            }

            var x = this.x, y = this.y, z = this.z;

            this.x = y * v.z - z * v.y;
            this.y = z * v.x - x * v.z;
            this.z = x * v.y - y * v.x;

            return this;

        },

        crossVectors: function ( a, b ) {

            var ax = a.x, ay = a.y, az = a.z;
            var bx = b.x, by = b.y, bz = b.z;

            this.x = ay * bz - az * by;
            this.y = az * bx - ax * bz;
            this.z = ax * by - ay * bx;

            return this;

        },

        projectOnVector: function () {

            var v1, dot;

            return function ( vector ) {

                if ( v1 === undefined ) v1 = new THREE.Vector3();

                v1.copy( vector ).normalize();

                dot = this.dot( v1 );

                return this.copy( v1 ).multiplyScalar( dot );

            };

        }(),

        projectOnPlane: function () {

            var v1;

            return function ( planeNormal ) {

                if ( v1 === undefined ) v1 = new THREE.Vector3();

                v1.copy( this ).projectOnVector( planeNormal );

                return this.sub( v1 );

            }

        }(),

        reflect: function () {

            // reflect incident vector off plane orthogonal to normal
            // normal is assumed to have unit length

            var v1;

            return function ( normal ) {

                if ( v1 === undefined ) v1 = new THREE.Vector3();

                return this.sub( v1.copy( normal ).multiplyScalar( 2 * this.dot( normal ) ) );

            }

        }(),

        angleTo: function ( v ) {

            var theta = this.dot( v ) / ( this.length() * v.length() );

            // clamp, to handle numerical problems

            return Math.acos( THREE.Math.clamp( theta, - 1, 1 ) );

        },

        distanceTo: function ( v ) {

            return Math.sqrt( this.distanceToSquared( v ) );

        },

        distanceToSquared: function ( v ) {

            var dx = this.x - v.x;
            var dy = this.y - v.y;
            var dz = this.z - v.z;

            return dx * dx + dy * dy + dz * dz;

        },
        setFromMatrixPosition: function ( m ) {

            this.x = m.elements[ 12 ];
            this.y = m.elements[ 13 ];
            this.z = m.elements[ 14 ];

            return this;

        },

        setFromMatrixScale: function ( m ) {

            var sx = this.set( m.elements[ 0 ], m.elements[ 1 ], m.elements[  2 ] ).length();
            var sy = this.set( m.elements[ 4 ], m.elements[ 5 ], m.elements[  6 ] ).length();
            var sz = this.set( m.elements[ 8 ], m.elements[ 9 ], m.elements[ 10 ] ).length();

            this.x = sx;
            this.y = sy;
            this.z = sz;

            return this;
        },

        setFromMatrixColumn: function ( index, matrix ) {
            
            var offset = index * 4;

            var me = matrix.elements;

            this.x = me[ offset ];
            this.y = me[ offset + 1 ];
            this.z = me[ offset + 2 ];

            return this;

        },

        equals: function ( v ) {

            return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) );

        },

        fromArray: function ( array, offset ) {

            if ( offset === undefined ) offset = 0;

            this.x = array[ offset ];
            this.y = array[ offset + 1 ];
            this.z = array[ offset + 2 ];

            return this;

        },

        toArray: function ( array, offset ) {

            if ( array === undefined ) array = [];
            if ( offset === undefined ) offset = 0;

            array[ offset ] = this.x;
            array[ offset + 1 ] = this.y;
            array[ offset + 2 ] = this.z;

            return array;

        },

        fromAttribute: function ( attribute, index, offset ) {

            if ( offset === undefined ) offset = 0;

            index = index * attribute.itemSize + offset;

            this.x = attribute.array[ index ];
            this.y = attribute.array[ index + 1 ];
            this.z = attribute.array[ index + 2 ];

            return this;

        },

        clone: function () {

            return new THREE.Vector3( this.x, this.y, this.z );

        }

    };
    */
}