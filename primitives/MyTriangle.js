/**
 * MyTriangle
 * @constructor
 * @param {XMLScene} scene - reference to MyScene object
 * @param {number} x1 - x1 coordinate
 * @param {number} x2 - x2 coordinate
 * @param {number} x3 - x3 coordinate
 * @param {number} y1 - y1 coordinate
 * @param {number} y2 - y2 coordinate
 * @param {number} y3 - y3 coordinate
 * @param {number} z1 - z1 coordinate
 * @param {number} z2 - z2 coordinate
 * @param {number} z3 - z3 coordinate
 */

class MyTriangle extends CGFobject {
	constructor(scene, x1, x2, x3, y1, y2, y3, z1, z2, z3) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.x3 = x3;
		this.y1 = y1;
		this.y2 = y2;
		this.y3 = y3;
		this.z1 = z1;
		this.z2 = z2;
		this.z3 = z3;

		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [
			this.x1, this.y1, this.z1,	//0
			this.x2, this.y2, this.z2,	//1
			this.x3, this.y3, this.z3	//2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2
		];

		//Facing Z positive
		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
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
			1, 0
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	updateTexLength(length_s, length_t) {
		this.l1 = Math.sqrt(Math.pow((this.x1 - this.x3), 2) + Math.pow((this.y1 - this.y3), 2) + Math.pow((this.z1 - this.z3), 2));
		this.l2 = Math.sqrt(Math.pow((this.x2 - this.x1), 2) + Math.pow((this.y2 - this.y1), 2) + Math.pow((this.z2 - this.z1), 2));
		this.l3 = Math.sqrt(Math.pow((this.x3 - this.x2), 2) + Math.pow((this.y3 - this.y2), 2) + Math.pow((this.z3 - this.z2), 2));

		this.cosB = (Math.pow(this.l1, 2) - Math.pow(this.l2, 2) + Math.pow(this.l3, 2)) / (2 * this.l1 * this.l3);
		this.sinB = Math.sqrt(1 - Math.pow(this.cosB, 2));

		this.texCoords = [
			(this.l3 - this.l1 * this.cosB) / length_s, (length_t - this.l1 * this.sinB) / length_t,
			0, 1,
			this.l3 / length_s, 1
		];

		this.updateTexCoordsGLBuffers();
	}
}
