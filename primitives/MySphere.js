/**
 * MySphere
 * @constructor
 * @param {XMLScene} scene - reference to MyScene object
 * @param {number} radius - radius of the sphere
 * @param {number} slices - number of divisions around axis
 * @param {number} stacks - number of divisions between poles
 */

class MySphere extends CGFobject {
	constructor(scene, radius, slices, stacks) {
		super(scene);
		this.radius = radius;
		this.slices = slices;
		this.stacks = stacks;
		this.initBuffers();
	}

	initBuffers() {
		var ang_perimeter = Math.PI*2/this.slices;
		var ang_height = Math.PI/this.stacks;

		this.vertices = [];
		this.indices = [];
 		this.normals = [];
 		this.texCoords = [];
		for(var j = 0; j <= this.slices; j++)
 		{
 			for(var i = 0; i <= this.stacks; i++)
 			{
 				var temp = Math.PI-ang_height*i;

				this.vertices.push( Math.sin(temp)*Math.cos(j*ang_perimeter)*this.radius,
					Math.sin(temp)*Math.sin(j*ang_perimeter)*this.radius,
					Math.cos(temp)*this.radius );

				this.normals.push( Math.sin(temp) * Math.cos(j*ang_perimeter),
					Math.sin(temp) * Math.sin(j*ang_perimeter),
					Math.cos(temp) );

				this.texCoords.push( j/this.slices,
					1 - i/this.stacks );

				if(i > 0 && j > 0) {
					var verts = this.vertices.length/3;
					this.indices.push(verts-2, verts-1, verts-this.stacks-2);
					this.indices.push(verts-this.stacks-2, verts-this.stacks-3, verts-2);
					this.indices.push(verts-2, verts-this.stacks-2, verts-1);
					this.indices.push(verts-this.stacks-2, verts-2, verts-this.stacks-3);
				}
 			}
 		}

		for (var slice = 0; slice < this.slices; slice++) {

			if (slice + 1 == this.slices) {
				this.indices.push(0,slice + 1, 1);
			}
			else {
				this.indices.push(0, slice + 1,slice + 2);
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}
