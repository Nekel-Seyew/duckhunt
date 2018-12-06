var cannonball = function(scene, direction, position) {
    var cb = {};
    cb['direction'] = normalize3(direction);
    cb['position'] = position;
    cb['fall'] = 0;

    cb['radius'] = 0.5;

    //create the model and stuff, and add it to scene.
    var geo = new THREE.SphereGeometry(cb['radius'], 128, 128);
    var mat = new THREE.MeshBasicMaterial({color: 0x000000, depthTest:true});
    var sph = new THREE.Mesh(geo, mat);
    sph.geometry.computeBoundingSphere();
    sph.castShadow = true;
    sph.receiveShadow = true;

    cb['geo'] = geo;
    cb['mat'] = mat;
    cb['sph'] = sph;


    sph.position.x = position[0];
    sph.position.y = position[1];
    sph.position.z = position[2];

    scene.add(sph);

    cb['update'] = function(ball,ducks){
        ball['sph'].position.z += ball['direction'][2];
        ball['sph'].position.y += ball['direction'][1] + ball['fall'];
        ball['sph'].position.x += ball['direction'][0];

        ball['fall'] -= 0.025; //simulates gravity by making amount we fall per second increase

        ball['position'][0] += ball['direction'][0];
        ball['position'][1] += ball['direction'][1];
        ball['position'][2] += ball['direction'][2];

        var remove = null;
        for(var i = 0; i<ducks.length; i++){
            var d = ducks[i];

            try {
                var dsphereRadius = d['bound'].radius * d['mscale'][0];
                var bRadius = ball['sph'].geometry.boundingSphere.radius;
                dlogoff +=1;

                var distSquared =  Math.pow((ball['position'][0] - d['mposition'][0]),2) +
                    Math.pow((ball['position'][1] - d['mposition'][1]),2) +
                    Math.pow((ball['position'][2] - d['mposition'][2]),2);

                // if(dlogoff % 10 === 0){
                //     console.log(Math.pow(dsphereRadius + bRadius,2));
                //     console.log(distSquared);
                //     console.log(d['mposition']);
                //     console.log(ball['sph'].position);
                // }

                if(distSquared <= Math.pow(dsphereRadius + cb['radius'],2)){
                    console.log("Heyo, collision!");
                    remove = i;
                    break;
                }


            }catch(exception){
                //do nothing
            }
        }
        if(remove !== null){
            console.log("Gonna remove: "+remove);
            var obj = ducks.splice(remove,1);
            obj[0].position.x=-100000;
            ducksound.play();
        }
    };


    return cb;
};