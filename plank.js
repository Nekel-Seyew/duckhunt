function plank(scene, size, position, scale, texture){
	var aplank;
	
	var texture = new THREE.TextureLoader().load(texture);

	var material = new THREE.MeshBasicMaterial({
		map:texture,
		side: THREE.DoubleSide,
		depthTest:true});
	
	var geometry = new THREE.BoxGeometry(size[0],size[1], size[2]);
	
	var aplank = new THREE.Mesh(geometry,material);
	aplank.position.set(position[0],position[1],position[2]);
	aplank.scale.set(scale[0],scale[1],scale[2]);

	aplank.castShadow = true;
	aplank.receiveShadow = true;
	
	scene.add(aplank);
	
return aplank;}