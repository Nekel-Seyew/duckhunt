"use strict";
function lanthern(scene, position, scale, rotate, color){
    var lant = {};
    new THREE.MTLLoader().load('models/lamppost/lamp_spot_IX.mtl',function(materials){
        materials.preload();
        new THREE.OBJLoader().setMaterials(materials).load('models/lamppost/lamp_spot_IX.obj',function(obj){
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
    var light = new THREE.PointLight(color,10,20);
    light.position.set(position[0]+2.5,position[1]+15,position[2]+1);
    light.castShadow = true;
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 1000;
    light.shadow.camera.lookAt(new THREE.Vector3(0,0,-10));
    scene.add(light);

    lant['light']=light;
    lant['on'] = true;

    lant['toggle']=function(lantern) {
        if(lantern['on']){
            scene.remove(lantern['light']);
            lantern['on']=false;
        }else{
            scene.add(lantern['light']);
            lantern['on']=true;
        }
    };

    return lant;
}