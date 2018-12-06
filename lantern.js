"use strict";
function lanthern(scene, position, scale, rotate, color){
    new THREE.MTLLoader().load('models/lantern_obj.mtl',function(materials){
        materials.preload();
        new THREE.OBJLoader().setMaterials(materials).load('models/lantern_obj.obj',function(obj){
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


            scene.add(obj);




        },onProgress,function(){});
    });
}