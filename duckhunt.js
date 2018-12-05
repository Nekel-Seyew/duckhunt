"use strict";


//audio setup from https://threejs.org/docs/#api/en/audio/Audio
//Base setup from https://threejs.org

//cglobal variables
var scene;
var scene2;
var camera;
var renderer;
var listener;
var controls;

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

var dlogoff = 0;

var allStop = false;

window.onload = function init(){
    //setup area
    div = document.getElementById("renderarea");
    scene = new THREE.Scene();
	scene2 = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, WIDTH/HEIGHT, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    div.appendChild(renderer.domElement);
    camera.position.set(0,0,10);
    //camera.rotation.set(-Math.PI/12,0,0);
    scene.add(camera);
    listener = new THREE.AudioListener();
    camera.add(listener);
    audioLoader = new THREE.AudioLoader();

    renderer.setClearColor(0xb2b2b2, 1);

    //controlls from Professor's Object Model viewer in lecture 11
    controls = new THREE.OrbitControls(camera, renderer.domElement);


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

	//cube- Background Box or building?
	var texture = new THREE.TextureLoader().load("wood.jpg");
	var material = new THREE.MeshBasicMaterial({
		map:texture,
		side: THREE.DoubleSide,
		depthTest:false});
	
	var geometry = new THREE.CubeGeometry(20,20,1);
	var meshBack = new THREE.Mesh(geometry,material);
	meshBack.rotation.z = Math.PI;
	meshBack.position.z = -13;
	scene.add(meshBack);
	
	//Creating the planks for the cannon, and for the ducks to go across.
	var row1 = plank(scene,[16,0.5,0],[0,3.8,-8],[1,1,1],"yellow-painted-wooden-wall.jpg");
	var row2 = plank(scene,[16,0.5,0],[0,-0.3,-8],[1,1,1],"yellow-painted-wooden-wall.jpg");
	
	var counter = plank(scene,[16,4,1],[0,-7,-5],[1,1,1],"red_wood.jpg");
	var counterTop = plank(scene,[16,1,1],[0,-5,-5],[1,1,1],"wood.jpg");

    //initialization area
    var ball = cannonball(scene,[0,0.0,0], [0,0,-10]);
    cannonballs.push(ball);
	//rows of ducks
	for (var i = 0; i<10; i++){
    		var aduck = duck(scene,[(i*(-2.5))-15.0,5.0,-10],[0.1,0,0],[0.25,0.25,0.25],[-Math.PI/2,0,Math.PI/2]);
	    	ducks.push(aduck);
	}
	for (var i = 0; i<10; i++){
    		var aduck = duck(scene,[(i*(2.5))+15.0,0,-10],[-0.1,0,0],[0.25,0.25,0.25],[-Math.PI/2,0,-Math.PI/2]);
	    	ducks.push(aduck);
	}
	
	
    
	//cannon Sound
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
        allStop = !allStop;
    };

    scene.add(new THREE.AmbientLight(0xffffff,0.9));

    render();

};

function render(){

    if(!allStop) {
        for (var i = 0; i < ducks.length; i++) {
            var d = ducks[i];
            d['update'](d);
        }

        //console.log(cannonballs);
        for (var i = 0; i < cannonballs.length; i++) {
            var b = cannonballs[i];
            //console.log(b);
            b['update'](b);
            //CannonballGameUpdate(b);//.GameUpdate();
        }
    }
	//renderer.render(scene2,camera);
    renderer.render(scene,camera);
    //controlls from Professor's Object Model viewer in lecture 11
    controls.update();
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
    sph.geometry.computeBoundingSphere();

    cb['geo'] = geo;
    cb['mat'] = mat;
    cb['sph'] = sph;


    sph.position.x = position[0];
    sph.position.y = position[1];
    sph.position.z = position[2];

    scene.add(sph);

    cb['update'] = function(ball){
        ball['sph'].position.z += ball['direction'][2];
        ball['sph'].position.y += ball['direction'][1];
        ball['sph'].position.x += ball['direction'][0];

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

//taken from the obj+mtl loader from three.js example : https://github.com/mrdoob/three.js/blob/master/examples/webgl_loader_obj_mtl.html
function onProgress(xhr){
    if ( xhr.lengthComputable ) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
    }
}


