/**
 * MyTorus
 * @constructor
 * @param {XMLScene} scene - reference to MyScene object
 * @param {number} outer - radius of the "circular axis" of the torus
 * @param {number} inner - the "tube" radius
 * @param {number} slices - number of divisions around the circles with the inner radius
 * @param {number} loops - number of divisions along the "tube"
 */

class MyTorus extends CGFobject {
    constructor(scene, outer, inner, slices, loops) {
        super(scene);

        this.outer = outer;
        this.inner = inner;
        this.slices = slices;
        this.loops = loops;

        this.initBuffers();
    };

	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		var alphaAng = 2*Math.PI/this.slices;
		var loopAng = 2*Math.PI/this.loops;

		for(var i = 0; i <= this.slices; ++i) {
			for(var j = 0; j <= this.loops; ++j) {

				this.vertices.push(
					(this.outer + this.inner*Math.cos(loopAng*j)) * Math.cos(alphaAng*i),
					(this.outer + this.inner*Math.cos(loopAng*j)) * Math.sin(alphaAng*i),
					this.inner * Math.sin(loopAng*j)
                );

                if (j < this.loops && i < this.slices) {
                    this.indices.push(
                        (i+1)*(this.loops+1) + j, i*(this.loops+1) + j+1, i*(this.loops+1) + j,
                        i*(this.loops+1) + j+1, (i+1)*(this.loops+1) + j, (i+1)*(this.loops+1) + j+1
                    );
                }

				this.texCoords.push(
					i*1/this.slices,
					j*1/this.loops
				);

				this.normals.push(
					Math.cos(loopAng*j) * Math.cos(alphaAng*i),
                    Math.cos(loopAng*j) * Math.sin(alphaAng*i),
                    Math.sin(loopAng*j)
				);

			}
        }

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

}
