/**
 * MyRectangle
 * @constructor
 * @param {XMLScene} scene - reference to MyScene object
 * @param {number} x1 - x1 coordinate
 * @param {number} x2 - x2 coordinate
 * @param {number} y1 - y1 coordinate
 * @param {number} y2 - y2 coordinate
 */

class MyRectangle extends CGFobject {
	constructor(scene, x1, x2, y1, y2) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;

		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,	//0
			this.x2, this.y1, 0,	//1
			this.x1, this.y2, 0,	//2
			this.x2, this.y2, 0		//3
		];
		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			1, 3, 2,
		];

		//Facing Z positive
		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];

		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */

		this.texCoords = [
			0, 1,
			1, 1,
			0, 0,
			1, 0
		]

		this.texDefault = this.texCoords;

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	updateTexLength(length_s, length_t) {
		this.texCoords = this.texDefault.slice();

		for(var i = 0; i < this.texCoords.length; i+=2){
			this.texCoords[i] /= length_s;
			this.texCoords[i+1] /= length_t;
		}
		this.updateTexCoordsGLBuffers();
	}
}
