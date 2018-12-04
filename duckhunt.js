"use strict";


//audio setup from https://threejs.org/docs/#api/en/audio/Audio
//Base setup from https://threejs.org

//cglobal variables
var scene;
var camera;
var renderer;
var listener;

var audioLoader;


var div; //if in the HTML the div's height or width change, update the values to here
var HEIGHT = 512;
var WIDTH = 512;


//Duck Variables
var ducky;
var ducks = [];
var ducksound;


//Cannon Variables
var cannonballs = [];
var cannonsound;


window.onload = function init(){
    //setup area
    div = document.getElementById("renderarea");
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, WIDTH/HEIGHT, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    div.appendChild(renderer.domElement);
    camera.position.set(0,0,5);
    scene.add(camera);
    listener = new THREE.AudioListener();
    camera.add(listener);
    audioLoader = new THREE.AudioLoader();

    renderer.setClearColor(0xb2b2b2, 1);

    // var geometry = new THREE.BoxGeometry(1,1,1);
    // var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    // var cube = new THREE.Mesh(geometry,material);
    // scene.add(cube);

    // var animate=function(){
    //     requestAnimationFrame(animate);
    //
    //     cube.rotation.x += 0.01;
    //     cube.rotation.y += 0.01;
    //
    //     renderer.render(scene,camera);
    // };

    //animate();


    //button control area



    //initialization area
    var ball = cannonball(scene,[0,-0.02,0.01], [0,0,10]);
    cannonballs.push(ball);

	for (var i = 0; i<10; i++){
    		var aduck = duck(scene,[(i*(-2.5))-15.0,5.0,-10],[0.1,0,0],[0.25,0.25,0.25],[-Math.PI/2,0,Math.PI/2]);
	    	ducks.push(aduck);
	}
	for (var i = 0; i<10; i++){
    		var aduck = duck(scene,[(i*(2.5))+15.0,0,-10],[-0.1,0,0],[0.25,0.25,0.25],[-Math.PI/2,0,-Math.PI/2]);
	    	ducks.push(aduck);
	}
    cannonsound = new THREE.Audio(listener);
    audioLoader.load('audio/91293__baefild__uncompressed-cannon_smaller.mp3',function(buffer){ //https://freesound.org/people/baefild/sounds/91293/
        cannonsound.setBuffer(buffer);
        cannonsound.setLoop(false);
        cannonsound.setVolume(0.5);
    });

    ducksound = new THREE.Audio(listener);
    audioLoader.load('audio/185550__crazyduckman__shocked-duck',function(buffer){ //https://freesound.org/people/crazyduckman/sounds/185550/
        ducksound.setBuffer(buffer);
        ducksound.setLoop(false);
        ducksound.setVolume(0.5);
    });

    document.getElementById("fire").onclick=function() {
        cannonsound.play();
    };

    scene.add(new THREE.AmbientLight(0xffffff,0.9));

    render();

};

function render(){

    for(var i=0; i<ducks.length; i++){
        var d = ducks[i];
        d['update'](d);
    }

    //console.log(cannonballs);
    for(var i = 0; i<cannonballs.length; i++){
        var b = cannonballs[i];
        //console.log(b);
        b['update'](b);
        //CannonballGameUpdate(b);//.GameUpdate();
    }

    renderer.render(scene,camera);
    setTimeout(function(){requestAnimationFrame(render);},1000.0/60);
}



var cannonball = function(scene, direction, position) {
    var cb = {};
    cb['direction'] = direction;
    cb['position'] = position;

    cb['radius'] = 1;

    //create the model and stuff, and add it to scene.
    var geo = new THREE.SphereGeometry(cb['radius'], 128, 128);
    var mat = new THREE.MeshBasicMaterial({color: 0x000000});
    var sph = new THREE.Mesh(geo, mat);

    cb['geo'] = geo;
    cb['mat'] = mat;
    cb['sph'] = sph;


    sph.positionX = position[0];
    sph.positionY = position[1];
    sph.positionZ = position[2];

    scene.add(sph);

    cb['update'] = function(ball){
        ball['sph'].position.z += ball['direction'][2];
        ball['sph'].position.y += ball['direction'][1];
        ball['sph'].position.x += ball['direction'][0];

        ball['position'][0] = ball['direction'][0];
        ball['position'][1] = ball['direction'][1];
        ball['position'][2] = ball['direction'][2];

        var remove = null;
        for(var i = 0; i<ducks.length; i++){
            var d = ducks[i];
            var dsphereRadius = d['bound'];
            //console.log(dsphereRadius);

            // if(Math.pow((ball['position'][0] - d['position'][0]),2) +
            //     Math.pow((ball['position'][1] - d['position'][1]),2) +
            //     Math.pow((ball['position'][2] - d['position'][2]),2)
            //     <= Math.pow(dsphereRadius,2) + Math.pow(cb['radius'],2)){
            //         remove = i;
            //         break;
            // }

        }
        if(remove !== null){
            ducks.splice(remove,1);
            ducksound.play();
        }
     };


    return cb;
};

//taken from the obj+mtl loader from three.js example : https://github.com/mrdoob/three.js/blob/master/examples/webgl_loader_obj_mtl.html
function onProgress(xhr){
    if ( xhr.lengthComputable ) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
    }
}


