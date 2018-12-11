"use strict";
function cannon(scene, position, direction, scale, rotate) {
    var cannon = new THREE.Group();
    var geometry = new THREE.Geometry();


    //much of the following code is adapted from https://github.com/mrdoob/three.js/blob/master/examples/webgl_loader_obj_mtl.html
    //the point of obj.position.XYZ is expanded upon by us. Creating a holder json object is our work.
    new THREE.MTLLoader().load('models/14054_Pirate_Ship_Cannon_on_Cart_v1_l3.mtl', function (materials) {
        materials.preload();
        new THREE.OBJLoader().setMaterials(materials).load('models/14054_Pirate_Ship_Cannon_on_Cart_v1_l3.obj', function (obj) {
            obj.position.x = 0;
            obj.position.y = 0;
            obj.position.z = 0;

            obj.scale.x = scale[0];
            obj.scale.y = scale[1];
            obj.scale.z = scale[2];

            obj.rotation.x = rotate[0];
            obj.rotation.y = rotate[1];
            obj.rotation.z = rotate[2];

            obj.children[0].castShadow = true;
            obj.children[0].receiveShadow = true;

            cannon.add(obj);
            scene.add(cannon);

        }, onProgress, function () {
        });
    });

    cannon.position.x = position[0];
    cannon.position.y = position[1];
    cannon.position.z = position[2];

    cannon['direction'] = direction;
    cannon['mposition'] = position;
    cannon['mscale'] = scale;

    cannon['rotate-right'] = function(mcannon){
        var ammount = (5 * Math.PI/180.0);
        mcannon.rotation.y = mcannon.rotation.y - ammount >= -Math.PI/4 ? mcannon.rotation.y - ammount : -Math.PI/4;
        mcannon['direction'][2] -= ammount;
    };
    cannon['rotate-left'] = function(mcannon){
        var ammount = (5 * Math.PI/180.0);
        mcannon.rotation.y = mcannon.rotation.y + ammount <= Math.PI/4 ? mcannon.rotation.y + ammount : Math.PI/4;
        mcannon['direction'][2] += ammount;
    };
    cannon['rotate-up'] = function(mcannon){
        var ammount = (5 * Math.PI/180.0);
        mcannon.rotation.x = mcannon.rotation.x + ammount <= Math.PI/4 ? mcannon.rotation.x + ammount : Math.PI/4;
        mcannon['direction'][0] += ammount;
    };
    cannon['rotate-down'] = function(mcannon){
        var ammount = (5 * Math.PI/180.0);
        mcannon.rotation.x = mcannon.rotation.x - ammount >= -Math.PI/4 ? mcannon.rotation.x - ammount : -Math.PI/4;
        mcannon['direction'][0] -= ammount;
    };

    return cannon;
}