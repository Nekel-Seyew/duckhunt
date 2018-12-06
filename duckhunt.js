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
var ducks = [];
var ducksound;


//Cannon Variables
var cannonballs = [];
var cannonsound;

var dlogoff = 0;

var allStop = false;


var score = 0;
var cannonballNums = 20;

window.onload = function init(){
    //setup area
    div = document.getElementById("renderarea");
    scene = new THREE.Scene();
	scene2 = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, WIDTH/HEIGHT, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
		depthTest:true});
	
	var geometry = new THREE.CubeGeometry(20,20,1);
	var meshBack = new THREE.Mesh(geometry,material);
	meshBack.rotation.z = Math.PI;
	meshBack.position.z = -13;
	meshBack.castShadow = true;
	meshBack.receiveShadow = true;
	scene.add(meshBack);
	
	//Creating the planks for the cannon, and for the ducks to go across.
	var row1 = plank(scene,[16,0.5,0],[0,4.3,-12.3],[1,1,1],"yellow-painted-wooden-wall.jpg");
	var row2 = plank(scene,[16,0.5,0],[0,-0.1,-12.3],[1,1,1],"yellow-painted-wooden-wall.jpg");
	
	var counter = plank(scene,[16,4,1],[0,-7,-1],[1,1,1],"red_wood.jpg");
	var counterTop = plank(scene,[16,1,1],[0,-5,-1],[1,1,1],"wood.jpg");

    var lantern = lanthern(scene,[4,-4,-5],[0.04,0.04,0.04],[0,0,0],0xFFFF00);


    var light = new THREE.PointLight(0xFFFFFF,10,10);
    light.position.set(0,0,-5);
    light.castShadow = true;
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 1000;
    light.shadow.camera.lookAt(new THREE.Vector3(0,0,-10));
    scene.add(light);

    var helper = new THREE.CameraHelper(light.shadow.camera);
    scene.add(helper);

    var acannon = cannon(scene,[0,-5,-1],[Math.PI,0,-Math.PI/2],[0.025,0.025,0.025],[-Math.PI/2,0,Math.PI/2]);

    //initialization area
    var ball = cannonball(scene,[0,0.0,0], [0,0,-10]);
    cannonballs.push(ball);
	//rows of ducks
	for (var i = 0; i<10; i++){
    		var aduck = duck(scene,[(i*(-2.5))-15.0,5.0,-11.7],[0.1,0,0],[0.25,0.25,0.25],[-Math.PI/2,0,Math.PI/2]);
	    	ducks.push(aduck);
	}
	for (var i = 0; i<10; i++){
    		var aduck = duck(scene,[(i*(2.5))+15.0,0,-11.7],[-0.1,0,0],[0.25,0.25,0.25],[-Math.PI/2,0,-Math.PI/2]);
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
        if(cannonballNums > 0) {
            cannonballNums -= 1;
            cannonsound.play();
            var phi = acannon['direction'][0];
            var theta = acannon['direction'][2];
            var r = 1;
            var z = -r * Math.sin(theta) * Math.cos(phi);
            var y = r * Math.sin(theta) * Math.sin(phi);
            var x = -r * Math.cos(theta);

            var outpoint = new THREE.Vector3(0, 1.5, -2);
            var rot = new THREE.Euler(acannon.rotation.x, acannon.rotation.y, acannon.rotation.z, 'XYZ');
            outpoint.applyEuler(rot);
            var pos = [acannon['mposition'][0] + outpoint.x, acannon['mposition'][1] + outpoint.y, acannon['mposition'][2] + outpoint.z];

            //var pos = [acannon['mposition'][0],acannon['mposition'][1],acannon['mposition'][2]];

            var ball = cannonball(scene, [x, y, z], pos);

            for (var i = 0; i < cannonballs.length; i++) {
                var b = cannonballs[i];
                scene.remove(b['sph']);
            }

            cannonballs = [];
            cannonballs.push(ball);
        }

    };

    document.getElementById("move-right").onclick=function() {
        acannon['rotate-right'](acannon);
    };
    document.getElementById("move-left").onclick=function() {
        acannon['rotate-left'](acannon);
    };
    document.getElementById("move-up").onclick=function() {
        acannon['rotate-up'](acannon);
    };
    document.getElementById("move-down").onclick=function() {
        acannon['rotate-down'](acannon);
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

        for (var i = 0; i < cannonballs.length; i++) {
            var b = cannonballs[i];
            //console.log(b);
            b['update'](b,ducks,scene);
        }
    }
	//renderer.render(scene2,camera);
    renderer.render(scene,camera);
    //controlls from Professor's Object Model viewer in lecture 11
    controls.update();

    document.getElementById("score").innerHTML="Score: "+score;
    document.getElementById("shots").innerHTML="Shots left: "+cannonballNums;

    setTimeout(function(){requestAnimationFrame(render);},1000.0/60);
}



//taken from the obj+mtl loader from three.js example : https://github.com/mrdoob/three.js/blob/master/examples/webgl_loader_obj_mtl.html
function onProgress(xhr){
    if ( xhr.lengthComputable ) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
    }
}

function normalize3(a){
    var n = Math.sqrt(a[0]*a[0] + a[1]*a[1] + a[2]*a[2]);
    return [a[0]/n, a[1]/n, a[2]/n];
}


