var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
  /**
   * @constructor
   */
  constructor(filename, scene) {
    this.loadedOk = null;

    this.filename = filename;

    // Establish bidirectional references between scene and graph.
    this.scene = scene;
    scene.graph = this;

    this.nodes = [];

    this.idRoot = null; // The id of the root element.

    this.axisCoords = [];
    this.axisCoords['x'] = [1, 0, 0];
    this.axisCoords['y'] = [0, 1, 0];
    this.axisCoords['z'] = [0, 0, 1];

    // File reading
    this.reader = new CGFXMLreader();

    /*
     * Read the contents of the xml file, and refer to this class for loading and error handlers.
     * After the file is read, the reader calls onXMLReady on this object.
     * If any error occurs, the reader calls onXMLError on this object, with an error message
     */
    this.reader.open('scenes/' + filename, this);
  }

  /*
   * Callback to be executed after successful reading
   */
  onXMLReady() {
    this.log("XML Loading finished.");
    var rootElement = this.reader.xmlDoc.documentElement;

    // Here should go the calls for different functions to parse the various blocks
    var error = this.parseXMLFile(rootElement);

    if (error != null) {
      this.onXMLError(error);
      return;
    }

    this.loadedOk = true;

    // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
    //this.scene.onGraphLoaded();

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        if (!this.changeTheme)
        this.scene.onGraphLoaded();
  
  }

  /**
   * Parses the XML file, processing each block.
   * @param {XML root element} rootElement
   */
  parseXMLFile(rootElement) {
    if (rootElement.nodeName != "lxs")
      return "root tag <lxs> missing";

    var nodes = rootElement.children;

    // Reads the names of the nodes to an auxiliary buffer.
    var nodeNames = [];

    for (var i = 0; i < nodes.length; i++) {
      nodeNames.push(nodes[i].nodeName);
    }

    var error;

    // Processes each node, verifying errors.

    // <scene>
    var index;
    if ((index = nodeNames.indexOf("scene")) == -1)
      return "tag <scene> missing";
    else {
      if (index != SCENE_INDEX)
        this.onXMLMinorError("tag <scene> out of order " + index);

      //Parse scene block
      if ((error = this.parseScene(nodes[index])) != null)
        return error;
    }

    // <views>
    if ((index = nodeNames.indexOf("views")) == -1)
      return "tag <views> missing";
    else {
      if (index != VIEWS_INDEX)
        this.onXMLMinorError("tag <views> out of order");

      //Parse views block
      if ((error = this.parseView(nodes[index])) != null)
        return error;
    }

    // <globals>
    if ((index = nodeNames.indexOf("globals")) == -1)
      return "tag <globals> missing";
    else {
      if (index != AMBIENT_INDEX)
        this.onXMLMinorError("tag <globals> out of order");

      //Parse ambient block
      if ((error = this.parseAmbient(nodes[index])) != null)
        return error;
    }

    // <lights>
    if ((index = nodeNames.indexOf("lights")) == -1)
      return "tag <lights> missing";
    else {
      if (index != LIGHTS_INDEX)
        this.onXMLMinorError("tag <lights> out of order");

      //Parse lights block
      if ((error = this.parseLights(nodes[index])) != null)
        return error;
    }

    // <textures>
    if ((index = nodeNames.indexOf("textures")) == -1)
      return "tag <textures> missing";
    else {
      if (index != TEXTURES_INDEX)
        this.onXMLMinorError("tag <textures> out of order");

      //Parse textures block
      if ((error = this.parseTextures(nodes[index])) != null)
        return error;
    }

    // <materials>
    if ((index = nodeNames.indexOf("materials")) == -1)
      return "tag <materials> missing";
    else {
      if (index != MATERIALS_INDEX)
        this.onXMLMinorError("tag <materials> out of order");

      //Parse materials block
      if ((error = this.parseMaterials(nodes[index])) != null)
        return error;
    }

    // <transformations>
    if ((index = nodeNames.indexOf("transformations")) == -1)
      return "tag <transformations> missing";
    else {
      if (index != TRANSFORMATIONS_INDEX)
        this.onXMLMinorError("tag <transformations> out of order");

      //Parse transformations block
      if ((error = this.parseTransformations(nodes[index])) != null)
        return error;
    }

    // <animations>
    if ((index = nodeNames.indexOf("animations")) == -1)
      return "tag <animations> missing";
    else {
      if (index != ANIMATIONS_INDEX)
        this.onXMLMinorError("tag <animations> out of order");

      //Parse animations block
      if ((error = this.parseAnimations(nodes[index])) != null)
        return error;
    }

    // <primitives>
    if ((index = nodeNames.indexOf("primitives")) == -1)
      return "tag <primitives> missing";
    else {
      if (index != PRIMITIVES_INDEX)
        this.onXMLMinorError("tag <primitives> out of order");

      //Parse primitives block
      if ((error = this.parsePrimitives(nodes[index])) != null)
        return error;
    }

    // <components>
    if ((index = nodeNames.indexOf("components")) == -1)
      return "tag <components> missing";
    else {
      if (index != COMPONENTS_INDEX)
        this.onXMLMinorError("tag <components> out of order");

      //Parse components block
      if ((error = this.parseComponents(nodes[index])) != null)
        return error;
    }
    this.log("all parsed");
  }

  /**
   * Parses the <scene> block.
   * @param {scene block element} sceneNode
   */
  parseScene(sceneNode) {

    // Get root of the scene.
    var root = this.reader.getString(sceneNode, 'root')
    if (root == null)
      return "no root defined for scene";

    this.idRoot = root;

    // Get axis length
    var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
    if (axis_length == null)
      this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

    this.referenceLength = axis_length || 1;

    this.log("Parsed scene");

    return null;
  }

  /*
   * Parses the <views> block.
   * @param {view block element} viewsNode
   */
  parseView(viewsNode) {
    var view_children = viewsNode.children;

    this.views = [];
    this.numViews = 0;
    this.defaultView = this.reader.getString(viewsNode, 'default');

    for (var i = 0; i < view_children.length; i++) {
      // Storing view information
      var global = [];

      // Get id of the current light.
      var viewId = this.reader.getString(view_children[i], 'id');
      if (viewId == null)
        return "no ID defined for view";

      // Checks for repeated IDs.
      if (this.views[viewId] != null)
        return "ID must be unique for each view (conflict: ID = " + viewId + ")";

      // There are only perspective ortho views
      var type = view_children[i].nodeName;

      if (type != "perspective" && type != "ortho") {
        this.onXMLMinorError("unknown tag <" + type + ">");
        continue;
      }

      global.push(type);

      // Get common features between perspective and ortho cameras
      var near = this.reader.getFloat(view_children[i], 'near');
      if (!(near != null && !isNaN(near)))
        return "unable to parse near of the view for ID = " + viewId;

      var far = this.reader.getFloat(view_children[i], 'far');
      if (!(far != null && !isNaN(far)))
        return "unable to parse far of the view for ID = " + viewId;

      var from = this.parseCoordinates3D(view_children[i].children[0]);
      if (!Array.isArray(from))
        return from;

      var to = this.parseCoordinates3D(view_children[i].children[1]);
      if (!Array.isArray(to))
        return to;

      //perspective
      if (view_children[i].nodeName == "perspective") {
        var angle = this.reader.getFloat(view_children[i], 'angle');

        if (!(angle != null && !isNaN(angle)))
          return "unable to parse angle of the view for ID = " + viewId;

        //convert angle in degrees to rads
        angle = angle * DEGREE_TO_RAD;

        global.push(...[angle, near, far, from, to]);

      }
      //ortho
      else if (view_children[i].nodeName == "ortho") {
        var left = this.reader.getFloat(view_children[i], 'left');
        if (!(left != null && !isNaN(left)))
          return "unable to parse left of the light for ID = " + viewId;

        var right = this.reader.getFloat(view_children[i], 'right');
        if (!(right != null && !isNaN(right)))
          return "unable to parse right of the light for ID = " + viewId;

        var top = this.reader.getFloat(view_children[i], 'top');
        if (!(top != null && !isNaN(top)))
          return "unable to parse top of the light for ID = " + viewId;

        var bottom = this.reader.getFloat(view_children[i], 'bottom');
        if (!(bottom != null && !isNaN(bottom)))
          return "unable to parse bottom of the light for ID = " + viewId;


        global.push(...[left, right, bottom, top, near, far, from, to]);

        //up is optional
        if (view_children[i].children.length > 2) {
          var up = this.parseCoordinates3D(view_children[i].children[2]);
          if (!Array.isArray(to))
            return to;

          global.push(up);
        } else
          global.push(vec3.fromValues(0, 1, 0));

      }

      this.views[viewId] = global;
      this.numViews++;
    }

    if (this.numViews == 0)
      return "at least one view must be defined";

    this.log("Parsed views");

    return null;
  }

  /**
   * Parses the <ambient> node.
   * @param {ambient block element} ambientsNode
   */
  parseAmbient(ambientsNode) {

    var children = ambientsNode.children;

    this.ambient = [];
    this.background = [];

    var nodeNames = [];

    for (var i = 0; i < children.length; i++)
      nodeNames.push(children[i].nodeName);

    var ambientIndex = nodeNames.indexOf("ambient");
    var backgroundIndex = nodeNames.indexOf("background");

    var color = this.parseColor(children[ambientIndex], "ambient");
    if (!Array.isArray(color))
      return color;
    else
      this.ambient = color;

    color = this.parseColor(children[backgroundIndex], "background");
    if (!Array.isArray(color))
      return color;
    else
      this.background = color;

    this.log("Parsed ambient");

    return null;
  }

  /**
   * Parses the <light> node.
   * @param {lights block element} lightsNode
   */
  parseLights(lightsNode) {
    var children = lightsNode.children;

    this.lights = [];
    var numLights = 0;

    var grandChildren = [];
    var nodeNames = [];

    // Any number of lights.
    for (var i = 0; i < children.length; i++) {

      // Storing light information
      var global = [];
      var attributeNames = [];
      var attributeTypes = [];

      //Check type of light
      if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
        this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
        continue;
      } else {
        attributeNames.push(...["location", "ambient", "diffuse", "specular", "attenuation"]);
        attributeTypes.push(...["position", "color", "color", "color", "array"]);
      }

      // Get id of the current light.
      var lightId = this.reader.getString(children[i], 'id');
      if (lightId == null)
        return "no ID defined for light";

      // Checks for repeated IDs.
      if (this.lights[lightId] != null)
        return "ID must be unique for each light (conflict: ID = " + lightId + ")";

      // Light enable/disable
      var enableLight = true;
      var aux = this.reader.getBoolean(children[i], 'enabled');
      if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
        this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

      enableLight = aux;

      //Add enabled boolean and type name to light info
      global.push(enableLight);
      global.push(children[i].nodeName);

      grandChildren = children[i].children;
      // Specifications for the current light.

      nodeNames = [];
      for (var j = 0; j < grandChildren.length; j++) {
        nodeNames.push(grandChildren[j].nodeName);
      }

      for (var j = 0; j < attributeNames.length; j++) {
        var attributeIndex = nodeNames.indexOf(attributeNames[j]);

        if (attributeIndex != -1) {
          if (attributeTypes[j] == "position")
            var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
          else if (attributeTypes[j] == "array") {
            var temp = grandChildren[attributeIndex];
            var aux = [];
            aux[0] = this.reader.getFloat(temp, 'constant');
            aux[1] = this.reader.getFloat(temp, 'linear');
            aux[2] = this.reader.getFloat(temp, 'quadratic');
          } else
            var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

          if (!Array.isArray(aux))
            return aux;

          global.push(aux);
        } else
          return "light " + attributeNames[i] + " undefined for ID = " + lightId;
      }

      // Gets the additional attributes of the spot light
      if (children[i].nodeName == "spot") {
        var angle = this.reader.getFloat(children[i], 'angle');
        if (!(angle != null && !isNaN(angle)))
          return "unable to parse angle of the light for ID = " + lightId;

        var exponent = this.reader.getFloat(children[i], 'exponent');
        if (!(exponent != null && !isNaN(exponent)))
          return "unable to parse exponent of the light for ID = " + lightId;

        var targetIndex = nodeNames.indexOf("target");

        // Retrieves the light target.
        var targetLight = [];
        if (targetIndex != -1) {
          var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
          if (!Array.isArray(aux))
            return aux;

          targetLight = aux;
        } else
          return "light target undefined for ID = " + lightId;

        global.push(...[angle, exponent, targetLight])
      }

      this.lights[lightId] = global;
      numLights++;
    }

    if (numLights == 0)
      return "at least one light must be defined";
    else if (numLights > 8)
      this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

    this.log("Parsed lights");
    return null;
  }

  /**
   * Parses the <textures> block.
   * @param {textures block element} texturesNode
   */
  parseTextures(texturesNode) {
    //For each texture in textures block, check ID and file URL
    this.textures = [];
    this.piece_textures = [];
    this.numTextures = 0;
    var children = texturesNode.children;

    for (var i = 0; i < children.length; ++i) {
      // Get id of the current light.
      var textureId = this.reader.getString(children[i], 'id');
      if (textureId == null)
        return "no ID defined for texture";

      // Checks for repeated IDs.
      if (this.textures[textureId] != null)
        return "ID must be unique for each texture (conflict: ID = " + textureId + ")";

      var file = this.reader.getString(children[i], 'file');
      if (file == null)
        return "no file defined for texture";

      var temp_tex = new CGFtexture(this.scene, file);;

      this.textures[textureId] = temp_tex;

      if (textureId.includes("exo"))
        this.piece_textures.push(temp_tex);

      this.numTextures++;
    }

    if (this.numTextures == 0)
      return "at least one texture must be defined";


    this.shuffle(this.piece_textures);

    /*******************************************************/
    this.game = new MyGame(this.scene, this, this.piece_textures);
    /*******************************************************/

    this.log("Parsed textures");
    return null;
  }

  /**
   * Parses the <materials> node.
   * @param {materials block element} materialsNode
   */
  parseMaterials(materialsNode) {
    var children = materialsNode.children;

    this.materials = [];
    this.numMaterials = 0;

    // Any number of materials.
    for (var i = 0; i < children.length; i++) {

      if (children[i].nodeName != "material") {
        this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
        continue;
      }

      // Get id of the current material.
      var materialID = this.reader.getString(children[i], 'id');
      if (materialID == null)
        return "no ID defined for material";

      // Checks for repeated IDs.
      if (this.materials[materialID] != null)
        return "ID must be unique for each light (conflict: ID = " + materialID + ")";

      var shininess = this.reader.getFloat(children[i], 'shininess');
      if (!(shininess != null && !isNaN(shininess)))
        return "unable to parse shininess of the material for ID = " + materialID;

      var emission = this.parseColor(children[i].children[0]);
      if (!Array.isArray(emission))
        return emission;

      var ambient = this.parseColor(children[i].children[1]);
      if (!Array.isArray(ambient))
        return ambient;

      var diffuse = this.parseColor(children[i].children[2]);
      if (!Array.isArray(diffuse))
        return diffuse;

      var specular = this.parseColor(children[i].children[3]);
      if (!Array.isArray(specular))
        return specular;

      //creates new material with the saved information
      var material = new CGFappearance(this.scene);
      material.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
      material.setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
      material.setSpecular(specular[0], specular[1], specular[2], specular[3]);
      material.setEmission(emission[0], emission[1], emission[2], emission[3])
      material.setShininess(shininess);

      this.materials[materialID] = material;
      this.numMaterials++;
    }

    if (this.numMaterials == 0)
      return "at least one material must be defined";

    this.log("Parsed materials");
    return null;
  }

  /**
   * Parses the <transformations> block.
   * @param {transformations block element} transformationsNode
   */
  parseTransformations(transformationsNode) {
    var children = transformationsNode.children;

    this.transformations = [];
    this.numTransformations = 0;

    var grandChildren = [];

    // Any number of transformations.
    for (var i = 0; i < children.length; i++) {

      if (children[i].nodeName != "transformation") {
        this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
        continue;
      }

      // Get id of the current transformation.
      var transformationID = this.reader.getString(children[i], 'id');
      if (transformationID == null)
        return "no ID defined for transformation";

      // Checks for repeated IDs.
      if (this.transformations[transformationID] != null)
        return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

      grandChildren = children[i].children;
      // Specifications for the current transformation.

      var transfMatrix = mat4.create();

      for (var j = 0; j < grandChildren.length; j++) {
        switch (grandChildren[j].nodeName) {
          case 'translate':
            var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
            if (!Array.isArray(coordinates))
              return coordinates;

            transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
            break;
          case 'scale':
            var coordinates = this.parseCoordinates3D(grandChildren[j], "scale transformation for ID " + transformationID);
            if (!Array.isArray(coordinates))
              return coordinates;

            transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
            break;
          case 'rotate':
            var angle = this.reader.getFloat(grandChildren[j], 'angle');
            if (!(angle != null && !isNaN(angle)))
              return "unable to parse angle of the rotation for ID = " + transformationID;

            var axis = this.reader.getString(grandChildren[j], 'axis');
            if (axis == null)
              return "null axis for the rotation for ID = " + transformationID;

            transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle * DEGREE_TO_RAD, this.axisCoords[axis]);
            break;
        }
      }

      this.transformations[transformationID] = transfMatrix;
      this.numTransformations++;
    }

    if (this.numTransformations == 0)
      return "at least one transformation must be defined";

    this.log("Parsed transformations");
    return null;
  }


  /**
   * Parses the <animations> block.
   * @param {animations block element} animationsNode
   */
  parseAnimations(animationsNode) {
    var children = animationsNode.children;
    var grandChildren;
    var grandgrandChildren;

    this.animations = [];

    // Any number of animations.
    for (var n = 0; n < children.length; n++) {
      if (children[n].nodeName != "animation") {
        this.onXMLMinorError("unknown tag <" + children[n].nodeName + ">");
        continue;
      }

      // Get id of the current animation.
      var animationID = this.reader.getString(children[n], 'id');
      if (animationID == null)
        return "no ID defined for animation";

      // Checks for repeated IDs.
      if (this.animations[animationID] != null)
        return "ID must be unique for each animation (conflict: ID = " + animationID + ")";

      grandChildren = children[n].children;

      if (grandChildren.length < 1)
        return "There must be at least one keyframe in the animation " + animationID;

      var keyframes = [];

      for (var x = 0; x < grandChildren.length; x++) {
        // Validate the animation type
        if (grandChildren[x].nodeName != 'keyframe') {
          return "The animation type must be keyframe."
        }

        var instant = this.reader.getFloat(grandChildren[x], 'instant');

        grandgrandChildren = grandChildren[x].children;

        //every keyframe has 3 elements in a specific order: translate, rotate and scale
        if (grandgrandChildren.length != 3)
          return "The keyframe must have three elements (translate, rotate and scale).";
        else if (grandgrandChildren[0].nodeName != "translate" || grandgrandChildren[1].nodeName != "rotate" || grandgrandChildren[2].nodeName != "scale")
          return "Elements of the keyframe are out of order.";


        //translate
        var translate = grandgrandChildren[0];
        var trans_vec = this.parseCoordinates3D(translate);

        //rotate
        var rotate = grandgrandChildren[1];
        var angle_x = this.reader.getFloat(rotate, 'angle_x')
        var angle_y = this.reader.getFloat(rotate, 'angle_y');
        var angle_z = this.reader.getFloat(rotate, 'angle_z');
        var rot_vec = vec3.fromValues(angle_x, angle_y, angle_z);

        //scale
        var scale = grandgrandChildren[2];
        var sca_vec = this.parseCoordinates3D(scale);

        var keyFrameTransfs = [];
        keyFrameTransfs.push(...[trans_vec, rot_vec, sca_vec]);

        var keyf = new Keyframe(this, instant, keyFrameTransfs);
        keyframes.push(keyf);
      }

      var keyFrameAnim = new KeyframeAnimation(animationID, this.scene, keyframes);
      this.animations[animationID] = keyFrameAnim;
    }

    this.log("Parsed animations");
    return null;
  }

  /**
   * Parses the <primitives> block.
   * @param {primitives block element} primitivesNode
   */
  parsePrimitives(primitivesNode) {
    var children = primitivesNode.children;

    this.primitives = [];
    this.numPrimitives = 0;

    var grandChildren = [];

    // Any number of primitives.
    for (var i = 0; i < children.length; i++) {
      if (children[i].nodeName != "primitive") {
        this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
        continue;
      }

      // Get id of the current primitive.
      var primitiveId = this.reader.getString(children[i], 'id');
      if (primitiveId == null)
        return "no ID defined for texture";

      // Checks for repeated IDs.
      if (this.primitives[primitiveId] != null)
        return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

      grandChildren = children[i].children;

      // Validate the primitive type
      if (grandChildren.length != 1 ||
        (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
          grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
          grandChildren[0].nodeName != 'torus' && grandChildren[0].nodeName != 'plane' &&
          grandChildren[0].nodeName != 'patch' && grandChildren[0].nodeName != 'cylinder2')) {
        return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere, torus, plane, patch or cylinder2)";
      }

      // Specifications for the current primitive.
      var primitiveType = grandChildren[0].nodeName;

      // Retrieves the primitive coordinates.
      if (primitiveType == 'rectangle') {
        // x1
        var x1 = this.reader.getFloat(grandChildren[0], 'x1');
        if (!(x1 != null && !isNaN(x1)))
          return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

        // y1
        var y1 = this.reader.getFloat(grandChildren[0], 'y1');
        if (!(y1 != null && !isNaN(y1)))
          return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

        // x2
        var x2 = this.reader.getFloat(grandChildren[0], 'x2');
        if (!(x2 != null && !isNaN(x2) && x2 > x1))
          return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

        // y2
        var y2 = this.reader.getFloat(grandChildren[0], 'y2');
        if (!(y2 != null && !isNaN(y2) && y2 > y1))
          return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

        var rect = new MyRectangle(this.scene, x1, x2, y1, y2);

        this.primitives[primitiveId] = rect;
      } else if (primitiveType == 'cylinder') {
        // base
        var base = this.reader.getFloat(grandChildren[0], 'base');
        if (!(base != null && !isNaN(base)))
          return "unable to parse base of the primitive coordinates for ID = " + primitiveId;

        // top
        var top = this.reader.getFloat(grandChildren[0], 'top');
        if (!(top != null && !isNaN(top)))
          return "unable to parse top of the primitive coordinates for ID = " + primitiveId;

        // height
        var height = this.reader.getFloat(grandChildren[0], 'height');
        if (!(height != null && !isNaN(height)))
          return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

        // slices
        var slices = this.reader.getFloat(grandChildren[0], 'slices');
        if (!(slices != null && !isNaN(slices)))
          return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

        // stacks
        var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
        if (!(stacks != null && !isNaN(stacks)))
          return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

        var cyl = new MyCylinder(this.scene, height, base, top, slices, stacks);

        this.primitives[primitiveId] = cyl;
      } else if (primitiveType == 'torus') {
        // outer radius
        var outer = this.reader.getFloat(grandChildren[0], 'outer');
        if (!(outer != null && !isNaN(outer)))
          return "unable to parse outer of the primitive coordinates for ID = " + primitiveId;

        // inner radius
        var inner = this.reader.getFloat(grandChildren[0], 'inner');
        if (!(inner != null && !isNaN(inner)))
          return "unable to parse inner of the primitive coordinates for ID = " + primitiveId;

        // slices
        var slices = this.reader.getFloat(grandChildren[0], 'slices');
        if (!(slices != null && !isNaN(slices)))
          return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

        // loops
        var loops = this.reader.getFloat(grandChildren[0], 'loops');
        if (!(loops != null && !isNaN(loops)))
          return "unable to parse loops of the primitive coordinates for ID = " + primitiveId;

        var tor = new MyTorus(this.scene, outer, inner, slices, loops);

        this.primitives[primitiveId] = tor;
      } else if (primitiveType == 'triangle') {
        // x1
        var x1 = this.reader.getFloat(grandChildren[0], 'x1');
        if (!(x1 != null && !isNaN(x1)))
          return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

        // y1
        var y1 = this.reader.getFloat(grandChildren[0], 'y1');
        if (!(y1 != null && !isNaN(y1)))
          return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

        // z1
        var z1 = this.reader.getFloat(grandChildren[0], 'z1');
        if (!(z1 != null && !isNaN(z1)))
          return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;

        // x2
        var x2 = this.reader.getFloat(grandChildren[0], 'x2');
        if (!(x2 != null && !isNaN(x2)))
          return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

        // y2
        var y2 = this.reader.getFloat(grandChildren[0], 'y2');
        if (!(y2 != null && !isNaN(y2)))
          return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

        // z2
        var z2 = this.reader.getFloat(grandChildren[0], 'z2');
        if (!(z2 != null && !isNaN(z2)))
          return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;

        // x3
        var x3 = this.reader.getFloat(grandChildren[0], 'x3');
        if (!(x3 != null && !isNaN(x3)))
          return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;

        // y3
        var y3 = this.reader.getFloat(grandChildren[0], 'y3');
        if (!(y3 != null && !isNaN(y3)))
          return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;

        // z3
        var z3 = this.reader.getFloat(grandChildren[0], 'z3');
        if (!(z3 != null && !isNaN(z3)))
          return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;

        var trig = new MyTriangle(this.scene, x1, x2, x3, y1, y2, y3, z1, z2, z3);

        this.primitives[primitiveId] = trig;
      } else if (primitiveType == 'sphere') {
        // radius
        var radius = this.reader.getFloat(grandChildren[0], 'radius');
        if (!(radius != null && !isNaN(radius) && radius > 0))
          return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;

        // slices
        var slices = this.reader.getFloat(grandChildren[0], 'slices');
        if (!(slices != null && !isNaN(slices) && slices > 0))
          return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

        // stacks
        var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
        if (!(stacks != null && !isNaN(stacks) && stacks > 0))
          return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

        var sphr = new MySphere(this.scene, radius, slices, stacks);

        this.primitives[primitiveId] = sphr;
      } else if (primitiveType == 'plane') {
        // npartsU
        var npartsU = this.reader.getFloat(grandChildren[0], 'npartsU');
        if (!(npartsU != null && !isNaN(npartsU)))
          return "unable to parse npartsU of the primitive coordinates for ID = " + primitiveId;

        // npartsV
        var npartsV = this.reader.getFloat(grandChildren[0], 'npartsV');
        if (!(npartsV != null && !isNaN(npartsV)))
          return "unable to parse npartsV of the primitive coordinates for ID = " + primitiveId;

        var pla = new MyPlane(this.scene, npartsU, npartsV);
        this.primitives[primitiveId] = pla;
      } else if (primitiveType == 'piece') {
        // npartsU
        var npartsU = this.reader.getFloat(grandChildren[0], 'npartsU');
        if (!(npartsU != null && !isNaN(npartsU)))
          return "unable to parse npartsU of the primitive coordinates for ID = " + primitiveId;

        // npartsV
        var npartsV = this.reader.getFloat(grandChildren[0], 'npartsV');
        if (!(npartsV != null && !isNaN(npartsV)))
          return "unable to parse npartsV of the primitive coordinates for ID = " + primitiveId;

        // color
        var color = this.reader.getString(grandChildren[0], 'color');
        if (!(color != null))
          return "unable to parse color of the primitive coordinates for ID = " + primitiveId;

        // size
        var size = this.reader.getString(grandChildren[0], 'size');
        if (!(size != null))
          return "unable to parse size of the primitive coordinates for ID = " + primitiveId;

        // type
        var type = this.reader.getString(grandChildren[0], 'type');
        if (!(type != null))
          return "unable to parse type of the primitive coordinates for ID = " + primitiveId;

        // boardPosX
        var boardPosX = this.reader.getInt(grandChildren[0], 'boardPosX');
        if (!(boardPosX != null && !isNaN(npartsV)))
          return "unable to parse boardPosX of the primitive coordinates for ID = " + primitiveId;

        // boardPosZ
        var boardPosZ = this.reader.getInt(grandChildren[0], 'boardPosZ');
        if (!(boardPosZ != null && !isNaN(npartsV)))
          return "unable to parse boardPosZ of the primitive coordinates for ID = " + primitiveId;




        var pla = new MyPlane(this.scene, npartsU, npartsV);
        this.primitives[primitiveId] = pla;
      } else if (primitiveType == 'patch') {
        // npointsU
        var npointsU = this.reader.getFloat(grandChildren[0], 'npointsU');
        if (!(npointsU != null && !isNaN(npointsU)))
          return "unable to parse npointsU of the primitive coordinates for ID = " + primitiveId;

        // npointsV
        var npointsV = this.reader.getFloat(grandChildren[0], 'npointsV');
        if (!(npointsV != null && !isNaN(npointsV)))
          return "unable to parse npointsV of the primitive coordinates for ID = " + primitiveId;

        // npartsU
        var npartsU = this.reader.getFloat(grandChildren[0], 'npartsU');
        if (!(npartsU != null && !isNaN(npartsU)))
          return "unable to parse npartsU of the primitive coordinates for ID = " + primitiveId;

        // npartsV
        var npartsV = this.reader.getFloat(grandChildren[0], 'npartsV');
        if (!(npartsV != null && !isNaN(npartsV)))
          return "unable to parse npartsV of the primitive coordinates for ID = " + primitiveId;

        // npartsV
        var children = grandChildren[0].children;
        var controlpoints = [];

        for (var t = 0; t < children.length; t++) {
          // x
          var x = this.reader.getFloat(children[t], 'xx');
          if (!(x != null && !isNaN(x)))
            return "unable to parse x of the patch controlpoint for primitive " + primitiveId;

          // y
          var y = this.reader.getFloat(children[t], 'yy');
          if (!(y != null && !isNaN(y)))
            return "unable to parse y of the patch controlpoint for primitive " + primitiveId;

          // z
          var z = this.reader.getFloat(children[t], 'zz');
          if (!(z != null && !isNaN(z)))
            return "unable to parse z of the patch controlpoint for primitive " + primitiveId;

          var vec = vec3.fromValues(x, y, z);

          controlpoints.push(vec);
        }

        var pat = new MyPatch(this.scene, npointsU, npointsV, npartsU, npartsV, controlpoints);
        this.primitives[primitiveId] = pat;
      } else if (primitiveType == 'cylinder2') {
        // base
        var base = this.reader.getFloat(grandChildren[0], 'base');
        if (!(base != null && !isNaN(base)))
          return "unable to parse base of the primitive coordinates for ID = " + primitiveId;

        // top
        var top = this.reader.getFloat(grandChildren[0], 'top');
        if (!(top != null && !isNaN(top)))
          return "unable to parse top of the primitive coordinates for ID = " + primitiveId;

        // height
        var height = this.reader.getFloat(grandChildren[0], 'height');
        if (!(height != null && !isNaN(height)))
          return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

        // slices
        var slices = this.reader.getFloat(grandChildren[0], 'slices');
        if (!(slices != null && !isNaN(slices)))
          return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

        // stacks
        var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
        if (!(stacks != null && !isNaN(stacks)))
          return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

        var cyl2 = new MyCylinder2(this.scene, height, base, top, slices, stacks);
        this.primitives[primitiveId] = cyl2;
      }

      this.numPrimitives++;
    }

    if (this.numPrimitives == 0)
      return "at least one primitive must be defined";

    this.log("Parsed primitives");
    return null;
  }

  /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
  parseComponents(componentsNode) {

    var children = componentsNode.children;

    this.components = [];

    var grandChildren = [];
    var grandgrandChildren = [];
    var nodeNames = [];

    // Any number of components.
    for (var i = 0; i < children.length; i++) {
      if (children[i].nodeName != "component") {
        this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
        continue;
      }

      // Get id of the current component.
      var componentID = this.reader.getString(children[i], 'id');

      if (componentID == null)
        return "no ID defined for componentID";

      // Checks for repeated IDs.
      if (this.components[componentID] != null)
        return "ID must be unique for each component (conflict: ID = " + componentID + ")";

      this.nodes[componentID] = new MyComponent(this, componentID);


      grandChildren = children[i].children;

      nodeNames = [];
      for (var j = 0; j < grandChildren.length; j++) {
        nodeNames.push(grandChildren[j].nodeName);
      }

      var transformationIndex = nodeNames.indexOf("transformation");
      if (transformationIndex == -1)
        return "transformations' block is required in the component " + componentID;

      var materialsIndex = nodeNames.indexOf("materials");
      if (materialsIndex == -1)
        return "materials' block is required in the component " + componentID;

      var textureIndex = nodeNames.indexOf("texture");
      if (textureIndex == -1)
        return "texture's block is required in the component " + componentID;

      var childrenIndex = nodeNames.indexOf("children");
      if (childrenIndex == -1)
        return "children's block is required in the component " + componentID;

      // Transformations
      var transfs = grandChildren[transformationIndex].children;

      for (var k = 0; k < transfs.length; k++) {
        if (transfs[k].nodeName == "transformationref") {
          if (transfs.length > 1)
            return "When using a reference to a transformation you can't use any other tranformarion.";
          else {
            var transformationId = this.reader.getString(transfs[k], 'id');
            if (this.transformations[transformationId] == null)
              return "Transformation with id " + transformationId + " in the component " + componentID + " not found";
            else
              this.nodes[componentID].transformation = this.transformations[transformationId];
          }
        } else {
          switch (transfs[k].nodeName) {
            case 'translate':
              var coordinates = this.parseCoordinates3D(transfs[k], "translate transformation for ID " + transformationId);
              if (!Array.isArray(coordinates))
                return coordinates;

              mat4.translate(this.nodes[componentID].transformation, this.nodes[componentID].transformation, coordinates);
              break;
            case 'scale':
              var coordinates = this.parseCoordinates3D(transfs[k], "scale transformation for ID " + transformationId);
              if (!Array.isArray(coordinates))
                return coordinates;

              mat4.scale(this.nodes[componentID].transformation, this.nodes[componentID].transformation, coordinates);
              break;
            case 'rotate':
              var angle = this.reader.getFloat(transfs[k], 'angle');
              if (!(angle != null && !isNaN(angle)))
                return "unable to parse angle of the rotation for component = " + componentID;

              var axis = this.reader.getString(transfs[k], 'axis');
              if (axis == null)
                return "null axis for the rotation for component = " + componentID;

              mat4.rotate(this.nodes[componentID].transformation, this.nodes[componentID].transformation, angle * DEGREE_TO_RAD, this.axisCoords[axis]);
              break;
          }
        }
      }

      // Animations
      var animationrefIndex = nodeNames.indexOf("animationref");
      var animationref;
      if (animationrefIndex != -1) {
        animationref = this.reader.getString(grandChildren[animationrefIndex], 'id');
        if (this.animations[animationref] == null)
          return "Animation with id " + animationref + " in the component " + componentID + " not found";
        this.nodes[componentID].animation = animationref;
      } else {
        this.nodes[componentID].animation = null;
      }


      // Materials
      var grandgrandChildren = grandChildren[materialsIndex].children;
      var comp_materials = [];
      for (var l = 0; l < grandgrandChildren.length; l++) {
        var materialId = this.reader.getString(grandgrandChildren[l], 'id');
        if (materialId != "inherit" && this.materials[materialId] == null)
          return "Material with id " + materialId + " in the component " + componentID + " not found";
        else
          comp_materials.push(materialId);
      }

      this.nodes[componentID].materials = comp_materials;

      // Texture
      var textureId = this.reader.getString(grandChildren[textureIndex], 'id');
      if (textureId != "inherit" && textureId != "none" && this.textures[textureId] == null)
        return "Texture with id " + textureId + " in the component " + componentID + " not found";
      else
        this.nodes[componentID].texture = textureId;

      if (textureId != "inherit" && textureId != "none") {
        var length_s = this.reader.getFloat(grandChildren[textureIndex], 'length_s');
        if (!(length_s != null && !isNaN(length_s) && length_s > 0))
          return "unable to parse length_s of the texture in component for ID = " + componentID;

        this.nodes[componentID].length_s = length_s;

        var length_t = this.reader.getFloat(grandChildren[textureIndex], 'length_t');
        if (!(length_t != null && !isNaN(length_t) && length_t > 0))
          return "unable to parse length_t of the texture in component for ID = " + componentID;

        this.nodes[componentID].length_t = length_t;
      }

      // Children
      var child = grandChildren[childrenIndex].children;

      if (child.length == 0)
        return "at least one component or primitive on the children's block is required in the component " + componentID;

      for (var j = 0; j < child.length; j++) {
        var childId = this.reader.getString(child[j], 'id');
        if (childId == null)
          return "no ID defined for child";

        // Child must be a component or a primitive
        if (child[j].nodeName != "primitiveref" && child[j].nodeName != "componentref") {
          this.onXMLMinorError("unknown tag <" + child[j].nodeName + ">");
          continue;
        }

        if (child[j].nodeName == "primitiveref") {
          if (this.primitives[childId] == null)
            return "Primitive with id " + childId + " in the component " + componentID + " not found";
          else
            this.nodes[componentID].addPrimitive(childId);
        } else if (child[j].nodeName == "componentref") {
          this.nodes[componentID].addChild(childId);
        }
      }
    }

    this.log("Parsed components");
    return null;
  }


  /**
   * Parse the coordinates from a node with ID = id
   * @param {block element} node
   * @param {message to be displayed in case of error} messageError
   */
  parseCoordinates3D(node, messageError) {
    var position = [];

    // x
    var x = this.reader.getFloat(node, 'x');
    if (!(x != null && !isNaN(x)))
      return "unable to parse x-coordinate of the " + messageError;

    // y
    var y = this.reader.getFloat(node, 'y');
    if (!(y != null && !isNaN(y)))
      return "unable to parse y-coordinate of the " + messageError;

    // z
    var z = this.reader.getFloat(node, 'z');
    if (!(z != null && !isNaN(z)))
      return "unable to parse z-coordinate of the " + messageError;

    position.push(...[x, y, z]);

    return position;
  }

  /**
   * Parse the coordinates from a node with ID = id
   * @param {block element} node
   * @param {message to be displayed in case of error} messageError
   */
  parseCoordinates4D(node, messageError) {
    var position = [];

    //Get x, y, z
    position = this.parseCoordinates3D(node, messageError);

    if (!Array.isArray(position))
      return position;


    // w
    var w = this.reader.getFloat(node, 'w');
    if (!(w != null && !isNaN(w)))
      return "unable to parse w-coordinate of the " + messageError;

    position.push(w);

    return position;
  }

  /**
   * Parse the color components from a node
   * @param {block element} node
   * @param {message to be displayed in case of error} messageError
   */
  parseColor(node, messageError) {
    var color = [];

    // R
    var r = this.reader.getFloat(node, 'r');
    if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
      return "unable to parse R component of the " + messageError;

    // G
    var g = this.reader.getFloat(node, 'g');
    if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
      return "unable to parse G component of the " + messageError;

    // B
    var b = this.reader.getFloat(node, 'b');
    if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
      return "unable to parse B component of the " + messageError;

    // A
    var a = this.reader.getFloat(node, 'a');
    if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
      return "unable to parse A component of the " + messageError;

    color.push(...[r, g, b, a]);

    return color;
  }

  /*
   * Callback to be executed on any read error, showing an error on the console.
   * @param {string} message
   */
  onXMLError(message) {
    console.error("XML Loading Error: " + message);
    this.loadedOk = false;
  }

  /**
   * Callback to be executed on any minor error, showing a warning on the console.
   * @param {string} message
   */
  onXMLMinorError(message) {
    console.warn("Warning: " + message);
  }

  /**
   * Callback to be executed on any message.
   * @param {string} message
   */
  log(message) {
    console.log("   " + message);
  }

  /**
 * Shuffles the pieces' array so that all games have pieces available in different order
 */
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i)
      const temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
  }

  /**
   * Displays the scene, processing each node, starting in the root node.
   */
  displayScene() {
    this.processNode(this.idRoot, this.nodes[this.idRoot].materials[0], this.nodes[this.idRoot].texture, this.nodes[this.idRoot].length_s, this.nodes[this.idRoot].length_t);

    /*******************************************************/
    this.game.display();
    /*******************************************************/

  }

  processNode(nodeID, materialP, textureP, length_sP, length_tP) {
    this.scene.pushMatrix();
    var component = this.nodes[nodeID];

    //TRANSFORMATION
    //apply component's transformation
    this.scene.multMatrix(component.transformation);
    //===================

    // ANIMATION
    if (component.animation != null) {
      this.animations[component.animation].apply();
    }
    //===================

    //MATERIALS
    var material;
    var arrayMat = [];
    var numMaterial = this.scene.numMaterial;
    var count = 0;

    //array to save component's materials
    for (var key in component.materials) {
      arrayMat[count] = component.materials[key];
      count++;
    }

    //process component's material
    if (arrayMat[numMaterial % count] == "inherit")
      material = materialP;
    else
      material = this.materials[arrayMat[numMaterial % count]];
    //===================

    //TEXTURES
    var texture;
    var length_s;
    var length_t;

    //process component's texture
    if (component.texture == "inherit") {
      length_s = length_sP;
      length_t = length_tP;
      texture = textureP;
    } else if (component.texture == "none")
      texture = "none";
    else {
      texture = component.texture;
      length_s = component.length_s;
      length_t = component.length_t;
    }

    //set component's texture
    if (texture != "none")
      material.setTexture(this.textures[texture]);
    else
      material.setTexture(null);

    //apply component's material
    material.apply();
    //===================      

    //CHILDREN
    //process component's children that are other components
    for (var i = 0; i < component.children.length; i++) {
      this.processNode(component.children[i], material, texture, length_s, length_t);
    }

    //display component's children that are primitives
    for (var j = 0; j < component.primitives.length; j++) {
      if ((this.primitives[component.primitives[j]] instanceof MyRectangle) || (this.primitives[component.primitives[j]] instanceof MyTriangle)) {
        this.primitives[component.primitives[j]].updateTexLength(length_s, length_t);
      }

      this.primitives[component.primitives[j]].display();
    }

    this.scene.popMatrix();
  }
}
