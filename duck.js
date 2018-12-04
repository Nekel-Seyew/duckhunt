var duckObj = null;

//var ducky = new THREE.Group();
function duck(scene, position, direction, scale, rotate){
    var ducky = new THREE.Group();
    var geometry = new THREE.Geometry();

    //much of the following code is adapted from https://github.com/mrdoob/three.js/blob/master/examples/webgl_loader_obj_mtl.html
    //the point of obj.position.XYZ is expanded upon by us. Creating a holder json object is our work.
    new THREE.MTLLoader().load('models/10602_Rubber_Duck_v1_L3.mtl',function(materials){
        materials.preload();
        new THREE.OBJLoader().setMaterials(materials).load('models/10602_Rubber_Duck_v1_L3.obj',function(obj){
// console.log(obj);
            obj.position.x=position[0];
            obj.position.y=position[1];
            obj.position.z=position[2];

            obj.scale.x = scale[0];
            obj.scale.y = scale[1];
            obj.scale.z = scale[2];

            obj.rotation.x = rotate[0];
            obj.rotation.y = rotate[1];
            obj.rotation.z = rotate[2];

            obj.children[0].geometry.computeBoundingSphere();
	        ducky['bound'] = obj.children[0].geometry.boundingSphere;

            ducky.add(obj);
	        scene.add(ducky);

        },onProgress,function(){});
    });

    ducky['direction'] = direction;

    ducky['update'] = function(mduck){
        duckObj = mduck.getObjectByName( "position", true );
        if (mduck.position.x < 15.0 && mduck.position.x <= -15.0){

        }
            mduck.position.x += direction[0];
            mduck.position.y += direction[1];
            mduck.position.z += direction[2];

        };

    return ducky;
}