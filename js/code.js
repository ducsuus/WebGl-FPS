var camera, scene, renderer;
var geometry, material, mesh;

var upRot = 0;
var sideRot = 0;


init();
animate();

/*
** General Rendering
*/

function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);

    // Set the order in which the camera should rotate: Y rotation, then X rotation, then Z rotation
    camera.eulerOrder = "YXZ";
    
    camera.position.z = 1000;

    camera.rotation.y = 0;

    scene = new THREE.Scene();

    geometry = new THREE.BoxGeometry(400, 200, 10);
    material = new THREE.MeshBasicMaterial({
        color: 0xff0099,
        wireframe: true
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    // STARTOF Joe Code
    
    jgeometry = new THREE.BoxGeometry(500, 500, 500);
    jmaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
    });

    jmesh = new THREE.Mesh(jgeometry, jmaterial);
    
    jmesh.position.x = 700
    
    scene.add(jmesh);

    //*********************************
    ageometry = new THREE.BoxGeometry(500, 500, 500);

    amesh = new THREE.Mesh(ageometry, jmaterial);
    
    amesh.position.x = -1000;
    amesh.position.z = 1000;
    
    scene.add(amesh);
    //*********************************
    
    // ENDOF Joe Code

    // STARTOF Bad Joe Code

    meshes = []

    for(var i = 0; i < 50; i++){

        jgeometry = new THREE.BoxGeometry(i + 1 * 100, i + 1 * 50, i + 1 * 20);
        jmaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000 + (i * 50),
            wireframe: true
        });

        meshes.push(new THREE.Mesh(jgeometry, jmaterial));
        
        meshes[i].position.x = Math.floor((Math.random() * window.innerWidth) + 1) - (window.innerWidth / 2);
        meshes[i].position.y = Math.floor((Math.random() * window.innerHeight) + 1) - (window.innerHeight / 2);

        meshes[i].rotation.x += Math.random();
        meshes[i].rotation.y += Math.random();
        
        scene.add(meshes[i]);


    }

    /*for(var i = 0; i < 1; i++){
        console.log("Random number is " + Math.random());
    }*/

    // ENDOF Bad Joe Code

    renderer = new THREE.CanvasRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

}

function animate() {

    requestAnimationFrame(animate);

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
    
    jmesh.rotation.x += 0.02;
    jmesh.rotation.y += 0.01;


    var pitchPercent = 0;
    var rollPercent = 0;

    console.log("radToDeg(camera.rotation.y) % 90 is " + radToDeg(camera.rotation.y) % 90);

    var camSideRot = radToDeg(camera.rotation.y);

    var quarterPercent = (camSideRot % 90) / 90 * 100;


    if(camSideRot >= 0 && camSideRot < 90){
        pitchPercent = 100 - quarterPercent;
        rollPercent = quarterPercent;
    }
    else if(camSideRot >= 90 && camSideRot < 180){
        pitchPercent = quarterPercent;
        rollPercent = 100 - quarterPercent;
    }
    else if(camSideRot >= 180 && camSideRot < 270){
        pitchPercent = 100 - quarterPercent;
        rollPercent = quarterPercent;
    }
    else if(camSideRot >= 270){
        pitchPercent = quarterPercent;
        rollPercent = 100 - quarterPercent;
    }

    // pitch
    camera.rotation.x += degToRad(upRot);
    // yaw
    camera.rotation.y += degToRad(sideRot);

    //console.log("rot x is " + radToDeg(camera.rotation.x));
    //console.log("rot z is " + radToDeg(camera.rotation.z));

    console.log("pitchPercent: " + pitchPercent + " rollPercent: " + rollPercent + " quarterPercent: " + quarterPercent + " camera.rotation.x: " + radToDeg(camera.rotation.x) + " camera.rotation.z: " + radToDeg(camera.rotation.z) + " camera.rotation.y: " + radToDeg(camera.rotation.y));

    

    if(radToDeg(camera.rotation.y) + sideRot < 0){
        camera.rotation.y = degToRad(sideRot + 360);
    }else if(radToDeg(camera.rotation.y) + sideRot > 360){
        camera.rotation.y += degToRad(sideRot - 360);
    }else{
        camera.rotation.y += degToRad(sideRot);
    }

    upRot = 0;
    sideRot = 0;



    renderer.render(scene, camera);

}

/*
** Unit Processing
*/

// Converts from degrees to radians.
function degToRad(degrees) {
  return degrees * Math.PI / 180;
};
 
// Converts from radians to degrees.
function radToDeg(radians) {
  return radians * 180 / Math.PI;
};

/*
** Movement
*/

document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    // W
    if (e.keyCode == '87') {
        camera.position.z -= 10;
    }
    // S
    else if (e.keyCode == '83') {
        camera.position.z += 10;
    }
    // A
    else if (e.keyCode == '65') {
        camera.position.x -= 10;
    }
    // D
    else if (e.keyCode == '68') {
        camera.position.x += 10;
    }
    // Up Arrow
    else if (e.keyCode == '38') {
        upRot += 1;
    }
    // Down Arrow
    else if (e.keyCode == '40') {
        upRot -= 1;
    }
    // Left Arrow
    else if (e.keyCode == '37') {
        sideRot += 1;
    }
    // Right Arrow
    else if (e.keyCode == '39') {
        sideRot -= 1;
    }
}