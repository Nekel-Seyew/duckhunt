"use strict";


//audio setup from https://threejs.org/docs/#api/en/audio/Audio
//Base setup from https://threejs.org

//cglobal variables
var scene;
var scene2;
var camera;
var renderer;
var listener;
var duckListener;
var controls;

var audioLoader;


var div; //if in the HTML the div's height or width change, update the values to here
var HEIGHT = 750;
var WIDTH = 750;


//Duck Variables
var ducks = [];
var ducksound;


//Cannon Variables
var cannonballs = [];
var cannonsound;

var dlogoff = 0;

var allStop = false;


var score = 0;
var cannonballNums = 30;

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
    duckListener = new THREE.AudioListener();
    camera.add(duckListener);

    renderer.setClearColor(0xb2b2b2, 1);

    //controlls from Professor's Object Model viewer in lecture 11
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    
//BOOTH----------------------------------
	//cube- Back wall
	var texture = new THREE.TextureLoader().load("wood.jpg");
	var material = new THREE.MeshLambertMaterial({
		map:texture,
		side: THREE.DoubleSide,
		depthTest:true});
	
	var geometry = new THREE.CubeGeometry(20,25,1);
	var meshBack = new THREE.Mesh(geometry,material);
	meshBack.rotation.z = Math.PI;
	meshBack.position.z = -13;
	//meshBack.castShadow = true;
	meshBack.receiveShadow = true;
	scene.add(meshBack);
	
	
	//cube- left wall
	var texture = new THREE.TextureLoader().load("wood.jpg");
	var material = new THREE.MeshBasicMaterial({
		map:texture,
		side: THREE.DoubleSide,
		depthTest:true});
	
	var geometry = new THREE.CubeGeometry(0.7,20,1);
	var meshBack = new THREE.Mesh(geometry,material);
	meshBack.rotation.z = -Math.PI;
	meshBack.position.z = -11;
	meshBack.position.x = -9;
	//meshBack.castShadow = true;
	meshBack.receiveShadow = true;
	scene.add(meshBack);
	
	//cube- right wall
	var texture = new THREE.TextureLoader().load("wood.jpg");
	var material = new THREE.MeshBasicMaterial({
		map:texture,
		side: THREE.DoubleSide,
		depthTest:true});
	
	var geometry = new THREE.CubeGeometry(0.7,20,1);
	var meshBack = new THREE.Mesh(geometry,material);
	meshBack.rotation.z = -Math.PI;
	meshBack.position.z = -11;
	meshBack.position.x = 9;
	//meshBack.castShadow = true;
	meshBack.receiveShadow = true;
	scene.add(meshBack);
	
	
	
//Creating the planks for the cannon, and for the ducks to go across.
	var row1 = plank(scene,[18,0.5,3],[0,4.5,-12.3],[1,1,1],"yellow-painted-wooden-wall.jpg");
	var row2 = plank(scene,[18,0.5,3],[0,-0.1,-12.3],[1,1,1],"yellow-painted-wooden-wall.jpg");
	
	var counter = plank(scene,[16,4,1],[0,-7,-1],[1,1,1],"red_wood.jpg");
	var counterTop = plank(scene,[16,1,3],[0,-5,-1],[1,1,1],"wood.jpg");
//creation of light source	
    var lantern = lanthern(scene,[5,-10,-5],[0.75,0.75,0.75],[0,0,0],0xFFFF00);
//Prizes on the top
	var teddy = prize(scene,[-5,-4.5,-.5],[0.1,0.1,0.1],[-90,0,0.0]);
	var prize_row = plank(scene,[18,0.5,5],[0,10,-12.3],[1,1,1],"wood.jpg");
	
	for(var i = 0; i < 7; i ++){
		var teddy = prize(scene,[(i+(i*.5)),10.3,-10],[0.1,0.1,0.1],[-90,0.0,0.0]);
	}
	for(var i = 1; i < 7; i ++){
		var teddy = prize(scene,[(-i+(-i*.5)),10.3,-10],[0.1,0.1,0.1],[-90,0.0,0.0]);
	}
//creation of cannon object
    var acannon = cannon(scene,[0,-5,-1],[Math.PI,0,-Math.PI/2],[0.025,0.025,0.025],[-Math.PI/2,0,Math.PI/2]);

 //initialization area for cannon balls
    var ball = cannonball(scene,[0,0.0,0], [0,0,-10]);
    cannonballs.push(ball);

//rows of ducks
	for (var i = 0; i<10; i++){
    		var aduck = duck(scene,[(i*(-2.5))-8.0,5.0,-11.7],[0.1,0,0],[0.25,0.25,0.25],[-Math.PI/2,0,Math.PI/2],7*2.5+0);
	    	ducks.push(aduck);
	}
	for (var i = 0; i<10; i++){
    		var aduck = duck(scene,[(i*(2.5))+8.0,0,-11.7],[-0.1,0,0],[0.25,0.25,0.25],[-Math.PI/2,0,-Math.PI/2],7*2.5+0);
	    	ducks.push(aduck);
	}
	
	
    
	//cannon Sound
	cannonsound = new THREE.Audio(listener);
    audioLoader.load('audio/91293__baefild__uncompressed-cannon_smaller.mp3',function(buffer){ //https://freesound.org/people/baefild/sounds/91293/
        cannonsound.setBuffer(buffer);
        cannonsound.setLoop(false);
        cannonsound.setVolume(0.5);
    });
//duck sound
    ducksound = new THREE.Audio(duckListener);
    audioLoader.load('audio/185550__crazyduckman__shocked-duck.mp3',function(buffer){ //https://freesound.org/people/crazyduckman/sounds/185550/
        ducksound.setBuffer(buffer);
        ducksound.setLoop(false);
        ducksound.setVolume(0.5);
    });
//BUTTON Controls
    document.getElementById("fire").onclick=function() {
        if(cannonballNums > 0) {
            cannonballNums -= 1;
            if(cannonsound.isPlaying){
                cannonsound.stop();
            }
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
    document.getElementById('light').onclick=function(){
        lantern['toggle'](lantern);
    };
	document.getElementById('decDif').onclick=function(){
		for(var i =0; i< ducks.length;i++){
			var d = ducks[i];
			
			if(d['direction'][0] < 0.0){
				document.getElementById('decDif').disabled=false;
				d['direction'][0] += 0.05;
			}else if(d['direction'][0] > 0.0){
				document.getElementById('decDif').disabled=false;
				d['direction'][0] -= 0.05;
			}//else if(d['direction'][0]==0){
			 else{	
				document.getElementById('decDif').disabled=true;
				document.getElementById('decDif').readonly=true;
				d['direction'][0] = 0.0;
			}
			
		}
	};
	
	document.getElementById('incDif').onclick=function(){
		document.getElementById('decDif').disabled=false;
		
		for(var i =0; i< ducks.length;i++){
			var d = ducks[i];
			
			if(d['mposition'][1] == 0){
				d['direction'][0] -= 0.05;
			}else if(d['mposition'][1] == 5){
				
				d['direction'][0] += 0.05;
			}
		}
	};
//adding ambient light
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
	//win condition
	if(ducks.length ==0 ){
		document.getElementById("win").innerHTML= "You Win! Take a Prize!";
		document.getElementById("score").innerHTML="";
		document.getElementById("shots").innerHTML="";
		
	}else if(cannonballNums == 0 ){
		document.getElementById("lose").innerHTML= "You lose! Try Again!";
		document.getElementById("score").innerHTML="";
		document.getElementById("shots").innerHTML="";
	}else{
		document.getElementById("score").innerHTML="Score: "+score;
		document.getElementById("shots").innerHTML="Shots left: "+cannonballNums;
	}
    setTimeout(function(){requestAnimationFrame(render);},1000.0/60);
}



//taken from the obj+mtl loader from three.js example : https://github.com/mrdoob/three.js/blob/master/examples/webgl_loader_obj_mtl.html
function onProgress(xhr){
    if ( xhr.lengthComputable ) {
        var percentComplete = xhr.loaded / xhr.total * 100;
       // console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
    }
}

function normalize3(a){
    var n = Math.sqrt(a[0]*a[0] + a[1]*a[1] + a[2]*a[2]);
    return [a[0]/n, a[1]/n, a[2]/n];
}


