"use strict";
function prize(scene, position, scale, rotate){
    new THREE.MTLLoader().load('models/11706_stuffed_animal_L2.mtl',function(materials){
        materials.preload();
        new THREE.OBJLoader().setMaterials(materials).load('models/11706_stuffed_animal_L2.obj',function(obj){
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