/* globals THREE */
module( "SIMD" );

var matrixEquals4 = function( a, b, tolerance ) {
	tolerance = tolerance || 0.0001;
	if( a.elements.length != b.elements.length ) {
		return false;
	}
	for( var i = 0, il = a.elements.length; i < il; i ++ ) {
		var delta = a.elements[i] - b.elements[i];
		if( delta > tolerance ) {
			return false;
		}
	}
	return true;
};
/*
test( "matrixInverse", function() {
	var a = new THREE.Matrix4();
	ok( a.determinant() == 1, "Passed!" );

	var b = new THREE.Matrix4().set( 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 );
	//var c = new THREE.Matrix4().set( 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 );
	b.multiplyMatrices(b, b);
	//c.oldMultiplyMatrices(c, c);
	ok( b.elements[0] == c.elements[0] );
	ok( b.elements[1] == c.elements[1] );
	ok( b.elements[2] == c.elements[2] );
	ok( b.elements[3] == c.elements[3] );
	ok( b.elements[4] == c.elements[4] );
	ok( b.elements[5] == c.elements[5] );
	ok( b.elements[6] == c.elements[6] );
	ok( b.elements[7] == c.elements[7] );
	ok( b.elements[8] == c.elements[8] );
	ok( b.elements[9] == c.elements[9] );
	ok( b.elements[10] == c.elements[10] );
	ok( b.elements[11] == c.elements[11] );
	ok( b.elements[12] == c.elements[12] );
	ok( b.elements[13] == c.elements[13] );
	ok( b.elements[14] == c.elements[14] );
	ok( b.elements[15] == c.elements[15] );

	for(var i = 0; i < 5000000; i++) {
		b.multiplyMatrices(b, b);
	}
	ok( true );
});*/
test( "oldMatrixInverse", function() {
	var a = new THREE.Matrix4();
	ok( a.determinant() == 1, "Passed!" );

	//var b = new THREE.Matrix4().set( 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 );
	//b.multiplyMatrices(b, b);
var c = new THREE.Matrix4().set( 21, 11, 22, 23, 44, 55, 66, 72, 48, 29, 110, 131, 112, 153, 124, 151 );
		
	for(var i = 0; i < 500; i++) {
		c.getInverse(c);
	}
	ok( true );
});