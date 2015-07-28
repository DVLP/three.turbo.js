/* globals SIMD, THREE, console */
/* @author Pawel Misiurski

This is my first open source project on GitHub. The goal of this project is to bring SIMD support to Three.js and hopefully gain 3-4x increase in speed.
Some functions might not be replaced yet. In some cases(Vector3 which is commented) replacing original calculations with SIMD actually slowed down three.js
This is still work in progress so use at your own risk! When this project will be complete then probably can be merged with original three.js library, and that would be awesome! Feel free to contribute!

*/
 
'use strict';
// SIMD.Float32x4 is also being checked just in case old Chromium SIMD is present. This extension will not work with Intel's Chromium build
if (typeof SIMD !== 'undefined' && SIMD.Float32x4) {
    console.log('SIMD mode enabled');
    THREE.Matrix4.prototype.multiplyMatrices = function (a, b) {
        var ae = a.elements,
            be = b.elements,
            tb = this.elements,
            arr1 = SIMD.Float32x4(ae[0], ae[1], ae[2], ae[3]),
            arr3 = SIMD.Float32x4(ae[4], ae[5], ae[6], ae[7]),
            arr5 = SIMD.Float32x4(ae[8], ae[9], ae[10], ae[11]),
            arr7 = SIMD.Float32x4(ae[12], ae[13], ae[14], ae[15]),
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

    THREE.Vector4 = function (x, y, z, w) {
        var _this = this;
        this.simd = SIMD.Float32x4(x || 0, y || 0, z || 0, (w !== undefined) ? w : 1);
        Object.defineProperty(this, 'x', {
            get: function () {
                return SIMD.Float32x4.extractLane(_this.simd, 0);
            },
            set: function (val) {
                _this.setX(val);
            }
        });
        Object.defineProperty(this, 'y', {
            get: function () {
                return SIMD.Float32x4.extractLane(_this.simd, 1);
            },
            set: function (val) {
                _this.setY(val);
            }
        });
        Object.defineProperty(this, 'z', {
            get: function () {
                return SIMD.Float32x4.extractLane(_this.simd, 2);
            },
            set: function (val) {
                _this.setZ(val);
            }
        });
        Object.defineProperty(this, 'w', {
            get: function () {
                return SIMD.Float32x4.extractLane(_this.simd, 3);
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
        setW: function (w) {
            this.simd = SIMD.Float32x4.replaceLane(this.simd, 3, w);
            return this;
        },
        setComponent: function (index, value) {
            this.simd = SIMD.Float32x4.replaceLane(this.simd, index, value);
        },

        getComponent: function (index) {
            SIMD.Float32x4.extractLane(this.simd, index);
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
            var arr1 = SIMD.Float32x4(e[0], e[1], e[2], e[3]);
            var arr2 = SIMD.Float32x4.splat(this.x);
            var arr3 = SIMD.Float32x4(e[4], e[5], e[6], e[7]);
            var arr4 = SIMD.Float32x4.splat(this.y);
            var arr5 = SIMD.Float32x4(e[8], e[9], e[10], e[11]);
            var arr6 = SIMD.Float32x4.splat(this.z);
            var arr7 = SIMD.Float32x4(e[12], e[13], e[14], e[15]);
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
    
        THREE.Vector3.prototype.add = function (v, w) {
            if ( w !== undefined ) {
                THREE.warn( 'THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
                return this.addVectors( v, w );
            }
            this.simd = SIMD.Float32x4.add(SIMD.Float32x4(this.x, this.y, this.z, 0), SIMD.Float32x4(v.x, v.y, v.z, 0));
            this.x = SIMD.Float32x4.extractLane(this.simd, 0);
            this.y = SIMD.Float32x4.extractLane(this.simd, 1);
            this.z = SIMD.Float32x4.extractLane(this.simd, 2);

            return this;
        };
        THREE.Vector3.prototype.addScalar = function (s) {
            this.simd = SIMD.Float32x4.add(SIMD.Float32x4(this.x, this.y, this.z, 0), SIMD.Float32x4.splat(s));
            this.x = SIMD.Float32x4.extractLane(this.simd, 0);
            this.y = SIMD.Float32x4.extractLane(this.simd, 1);
            this.z = SIMD.Float32x4.extractLane(this.simd, 2);

            return this;
        };
        THREE.Vector3.prototype.addVectors = function (a, b) {
            this.simd = SIMD.Float32x4.add(SIMD.Float32x4(a.x, a.y, a.z, a.w), SIMD.Float32x4(b.x, b.y, b.z));
            this.x = SIMD.Float32x4.extractLane(this.simd, 0);
            this.y = SIMD.Float32x4.extractLane(this.simd, 1);
            this.z = SIMD.Float32x4.extractLane(this.simd, 2);

            return this;
        };
        THREE.Vector3.prototype.sub = function ( v, w ) {
            if ( w !== undefined ) {
                THREE.warn( 'THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
                return this.subVectors( v, w );
            }
            this.simd = SIMD.Float32x4.sub(SIMD.Float32x4(this.x, this.y, this.z, 0), SIMD.Float32x4(v.x, v.y, v.z, 0));
            this.x = SIMD.Float32x4.extractLane(this.simd, 0);
            this.y = SIMD.Float32x4.extractLane(this.simd, 1);
            this.z = SIMD.Float32x4.extractLane(this.simd, 2);

            return this;
        };
        THREE.Vector3.prototype.subScalar = function (s) {
            this.simd = SIMD.Float32x4.sub(SIMD.Float32x4(this.x, this.y, this.z, 0), SIMD.Float32x4.splat(s));
            this.x = SIMD.Float32x4.extractLane(this.simd, 0);
            this.y = SIMD.Float32x4.extractLane(this.simd, 1);
            this.z = SIMD.Float32x4.extractLane(this.simd, 2);

            return this;
        };
        THREE.Vector3.prototype.subVectors = function (a, b) {
            this.simd = SIMD.Float32x4.sub(SIMD.Float32x4(a.x, a.y, a.z, 1), SIMD.Float32x4(b.x, b.y, b.z, 1));
            //debugger;
            this.x = SIMD.Float32x4.extractLane(this.simd, 0);
            this.y = SIMD.Float32x4.extractLane(this.simd, 1);
            this.z = SIMD.Float32x4.extractLane(this.simd, 2);

            return this;
        };
        THREE.Vector3.prototype.multiply = function ( v, w ) {
            if ( w !== undefined ) {
                THREE.warn( 'THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.' );
                return this.multiplyVectors( v, w );
            }
            this.simd = SIMD.Float32x4.mul(SIMD.Float32x4(this.x, this.y, this.z, 0), SIMD.Float32x4(v.x, v.y, v.z, 0));
            this.x = SIMD.Float32x4.extractLane(this.simd, 0);
            this.y = SIMD.Float32x4.extractLane(this.simd, 1);
            this.z = SIMD.Float32x4.extractLane(this.simd, 2);

            return this;
        };
        THREE.Vector3.prototype.multiplyScalar = function (scalar) {
            this.simd = SIMD.Float32x4.mul(SIMD.Float32x4(this.x, this.y, this.z, 0), SIMD.Float32x4.splat(scalar));
            this.x = SIMD.Float32x4.extractLane(this.simd, 0);
            this.y = SIMD.Float32x4.extractLane(this.simd, 1);
            this.z = SIMD.Float32x4.extractLane(this.simd, 2);

            return this;
        };
        THREE.Vector3.prototype.multiplyVectors = function ( a, b ) {
            this.simd = SIMD.Float32x4.mul(SIMD.Float32x4(a.x, a.y, a.z, 0), SIMD.Float32x4(b.x, b.y, b.z, 0));
            this.x = SIMD.Float32x4.extractLane(this.simd, 0);
            this.y = SIMD.Float32x4.extractLane(this.simd, 1);
            this.z = SIMD.Float32x4.extractLane(this.simd, 2);

            return this;
        };*/

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

            this.x = SIMD.Float32x4.extractLane(res, 0);
            this.y = SIMD.Float32x4.extractLane(res, 1);
            this.z = SIMD.Float32x4.extractLane(res, 2);

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
            this.x = SIMD.Float32x4.extractLane(this.simd, 0);
            this.y = SIMD.Float32x4.extractLane(this.simd, 1);
            this.z = SIMD.Float32x4.extractLane(this.simd, 2);

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
            
            this.x = SIMD.Float32x4.extractLane(res, 0);
            this.y = SIMD.Float32x4.extractLane(res, 1);
            this.z = SIMD.Float32x4.extractLane(res, 2);

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
            res = new Float32Array([0, 0, 0, 0]);
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
            this.x = SIMD.Float32x4.extractLane(res, 0);
            this.y = SIMD.Float32x4.extractLane(res, 1);
            this.z = SIMD.Float32x4.extractLane(res, 2);

            return this;

        };

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
        add: function (v, w) {
            if ( w !== undefined ) {
                THREE.warn( 'THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
                return this.addVectors( v, w );
            }
            this.simd = SIMD.Float32x4.add(this.simd, SIMD.Float32x4(v.x, v.y, v.z, 0));
            return this;
        },
        addScalar: function (s) {
            this.simd = SIMD.Float32x4.add(this.simd, SIMD.Float32x4.splat(s));
            return this;
        },
        addVectors: function (a, b) {
            this.simd = SIMD.Float32x4.add(SIMD.Float32x4(a.x, a.y, a.z, a.w), SIMD.Float32x4(b.x, b.y, b.z));
            return this;
        },
        sub: function ( v, w ) {
            if ( w !== undefined ) {
                THREE.warn( 'THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
                return this.subVectors( v, w );
            }
            this.simd = SIMD.Float32x4.sub(this.simd, SIMD.Float32x4(v.x, v.y, v.z, 0));
            return this;
        },
        subScalar: function (s) {
            this.simd = SIMD.Float32x4.sub(this.simd, SIMD.Float32x4.splat(s));
            return this;
        },
        subVectors: function (a, b) {
            this.simd = SIMD.Float32x4.sub(SIMD.Float32x4(a.x, a.y, a.z, a.w), SIMD.Float32x4(b.x, b.y, b.z, 0));
            return this;
        },
        multiply: function ( v, w ) {
            if ( w !== undefined ) {
                THREE.warn( 'THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.' );
                return this.multiplyVectors( v, w );
            }
            this.simd = SIMD.Float32x4.mul(this.simd, SIMD.Float32x4(v.x, v.y, v.z, 0));
            return this;
        },
        multiplyScalar: function (scalar) {
            this.simd = SIMD.Float32x4.mul(this.simd, SIMD.Float32x4.splat(scalar));
            return this;
        },

        multiplyVectors: function ( a, b ) {
            this.simd = SIMD.Float32x4.mul(SIMD.Float32x4(a.x, a.y, a.z, 0), SIMD.Float32x4(b.x, b.y, b.z, 0));
            return this;
        },

        applyEuler: function () {
            var quaternion;
            return function ( euler ) {
                if ( euler instanceof THREE.Euler === false ) {
                    THREE.error( 'THREE.Vector3: .applyEuler() now expects a Euler rotation rather than a Vector3 and order.' );
                }
                if ( quaternion === undefined ) quaternion = new THREE.Quaternion();
                this.applyQuaternion( quaternion.setFromEuler( euler ) );
                return this;
            };
        }(),

        applyAxisAngle: function () {

            var quaternion;

            return function ( axis, angle ) {

                if ( quaternion === undefined ) quaternion = new THREE.Quaternion();

                this.applyQuaternion( quaternion.setFromAxisAngle( axis, angle ) );

                return this;

            };

        }(),

        applyMatrix3: function ( m ) {
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

            this.x = SIMD.Float32x4.extractLane(res, 0);
            this.y = SIMD.Float32x4.extractLane(res, 1);
            this.z = SIMD.Float32x4.extractLane(res, 2);

            return this;

        },

        applyMatrix4: function ( m ) {
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
            return this;
        },

        applyProjection: function ( m ) {

            // input: THREE.Matrix4 projection matrix

            var x = this.x, y = this.y, z = this.z;

            var e = m.elements;
            var d = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] ); // perspective divide

            this.x = ( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z + e[ 12 ] ) * d;
            this.y = ( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z + e[ 13 ] ) * d;
            this.z = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * d;

            return this;

        },

        applyQuaternion: function ( q ) {

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
            res = new Float32Array([0, 0, 0, 0]);
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
            this.x = SIMD.Float32x4.extractLane(res, 0);
            this.y = SIMD.Float32x4.extractLane(res, 0);
            this.z = SIMD.Float32x4.extractLane(res, 0);

            return this;

        },

        project: function () {

            var matrix;

            return function ( camera ) {

                if ( matrix === undefined ) matrix = new THREE.Matrix4();

                matrix.multiplyMatrices( camera.projectionMatrix, matrix.getInverse( camera.matrixWorld ) );
                return this.applyProjection( matrix );

            };

        }(),

        unproject: function () {

            var matrix;

            return function ( camera ) {

                if ( matrix === undefined ) matrix = new THREE.Matrix4();

                matrix.multiplyMatrices( camera.matrixWorld, matrix.getInverse( camera.projectionMatrix ) );
                return this.applyProjection( matrix );

            };

        }(),

        transformDirection: function ( m ) {

            // input: THREE.Matrix4 affine matrix
            // vector interpreted as a direction

            var x = this.x, y = this.y, z = this.z;

            var e = m.elements;

            this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z;
            this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z;
            this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z;

            this.normalize();

            return this;

        },


        divide: function ( v ) {

            this.x /= v.x;
            this.y /= v.y;
            this.z /= v.z;

            return this;

        },

        divideScalar: function ( scalar ) {

            if ( scalar !== 0 ) {

                var invScalar = 1 / scalar;

                this.x *= invScalar;
                this.y *= invScalar;
                this.z *= invScalar;

            } else {

                this.x = 0;
                this.y = 0;
                this.z = 0;

            }

            return this;

        },

        min: function ( v ) {

            if ( this.x > v.x ) {

                this.x = v.x;

            }

            if ( this.y > v.y ) {

                this.y = v.y;

            }

            if ( this.z > v.z ) {

                this.z = v.z;

            }

            return this;

        },

        max: function ( v ) {

            if ( this.x < v.x ) {

                this.x = v.x;

            }

            if ( this.y < v.y ) {

                this.y = v.y;

            }

            if ( this.z < v.z ) {

                this.z = v.z;

            }

            return this;

        },

        clamp: function ( min, max ) {

            // This function assumes min < max, if this assumption isn't true it will not operate correctly

            if ( this.x < min.x ) {

                this.x = min.x;

            } else if ( this.x > max.x ) {

                this.x = max.x;

            }

            if ( this.y < min.y ) {

                this.y = min.y;

            } else if ( this.y > max.y ) {

                this.y = max.y;

            }

            if ( this.z < min.z ) {

                this.z = min.z;

            } else if ( this.z > max.z ) {

                this.z = max.z;

            }

            return this;

        },

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

        },

        negate: function () {

            this.x = - this.x;
            this.y = - this.y;
            this.z = - this.z;

            return this;

        },

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