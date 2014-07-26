console.log("Starting!");

var camera, scene, renderer;
var geometry, material, mesh;

var upRot = 0;
var sideRot = 0;

var mouseDown = false;
var mouseX = 0;
var mouseY = 0;

var xPos = 0;
var zPos = 0;
var yPos = 0;

var keyStates = new Object();

var mouseDown = false;
var mouseX = 0;
var mouseY = 0;


// alert('About to hook pointer lock change events');
// Hook pointer lock state change events
document.addEventListener('pointerlockchange', this.changeCallback, false);
document.addEventListener('mozpointerlockchange', this.changeCallback, false);
document.addEventListener('webkitpointerlockchange', this.changeCallback, false);

document.body.addEventListener('click', function() {
    setPointerLock();
}, false);


init();
animate();
// setPointerLock();


// Lock mouse cursor to a "canvas" or other HTML element
function setPointerLock(e) {

    // 
    // Set the HTML Body to be the scope of pointer locking
    //alert('Let us try to lock the pointer the easy way ...');
    element1 = document.body;
    element1.requestPointerLock = element1.requestPointerLock ||
            element1.mozRequestPointerLock ||
            element1.webkitRequestPointerLock;
    // Ask the browser to lock the pointer
    element1.requestPointerLock();

    // alert('Pointer is locked - allegedly!');
}

function changeCallback(e) {
    // alert('In ChangeCallback');
    if (document.pointerLockElement === document.body ||
            document.mozPointerLockElement === document.body ||
            document.webkitPointerLockElement === document.body) {
        // Pointer was just locked
        // Enable the mousemove listener
        document.addEventListener('mousemove', function(e){ moveCallback(e);}, false);




    } else {
        // NOTE: THIS DOESN'T WORK! - THIS ELSE SECTION IS NEVER CALLED!

        // Pointer was just unlocked
        // Disable the mousemove listener
        document.removeEventListener("mousemove", function(e){ moveCallback(e);}, false);
        this.unlockHook(this.element);




    }
}

function moveCallback(e) {
    var movementX = e.movementX ||
            e.mozMovementX ||
            e.webkitMovementX ||
            0;

    var movementY = e.movementY ||
            e.mozMovementY ||
            e.webkitMovementY ||
            0;

    // alert('Mouse moved - x:' + movementX);


    rotateScene(movementX, movementY);
    
}



function onMouseMove(evt) {
    if (!mouseDown) {
        // Ignore this ...
        // return;
    }

    evt.preventDefault();

    var deltaX = evt.clientX - mouseX,
            deltaY = evt.clientY - mouseY;
    mouseX = evt.clientX;
    mouseY = evt.clientY;
    //rotateScene(deltaX, deltaY);
}

function onMouseDown(evt) {
    evt.preventDefault();

    mouseDown = true;
    mouseX = evt.clientX;
    mouseY = evt.clientY;
    // alert('x='+mouseX + ' y='+mouseY);
}

function onMouseUp(evt) {
    evt.preventDefault();
    mouseDown = false;

}

function addMouseHandler(canvas) {
    canvas.addEventListener('mousemove', function(e) {
        onMouseMove(e);
    }, false);
    canvas.addEventListener('mousedown', function(e) {
        onMouseDown(e);
    }, false);
    canvas.addEventListener('mouseup', function(e) {
        onMouseUp(e);
    }, false);

}

function rotateScene(deltaX, deltaY) {
    // using deg2Rad on delta* here limits your scope of up/down/let/right movement - could be handy

    camera.rotation.y -= deltaX / 120;
    camera.rotation.x -= deltaY / 120;
    //upRot = deltaX;
    //sideRot = deltaY;

}
/*
 ** General Rendering
 */

function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);

    // Set the order in which the camera should rotate: Y rotation, then X rotation, then Z rotation
    //camera.eulerOrder = "YXZ"; // It has been changed to .rotation.order!!
    camera.rotation.order = "YXZ";

    camera.position.z = 1000;

    camera.rotation.y = degToRad(0);

    scene = new THREE.Scene();

    geometry = new THREE.BoxGeometry(400, 200, 10);
    material = new THREE.MeshBasicMaterial({
        color: 0xff0099,
        wireframe: true
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    jgeometry = new THREE.BoxGeometry(500, 500, 500);
    jmaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
    });

    jmesh = new THREE.Mesh(jgeometry, jmaterial);

    jmesh.position.x = 700

    scene.add(jmesh);


    ageometry = new THREE.BoxGeometry(500, 500, 500);

    amesh = new THREE.Mesh(ageometry, jmaterial);

    amesh.position.x = -1000;
    amesh.position.z = 1000;

    scene.add(amesh);

    bgeometry = new THREE.BoxGeometry(500, 500, 500);

    bmesh = new THREE.Mesh(bgeometry, jmaterial);

    bmesh.position.x = 0;
    bmesh.position.z = 2000;

    bmesh.rotation.z = degToRad(30);

    scene.add(bmesh);


    meshes = []

    for (var i = 0; i < 50; i++) {

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
    // addMouseHandler(document);

    


    renderer = new THREE.WebGLRenderer({antialias:true});


    renderer.setSize(window.innerWidth, window.innerHeight);


    document.body.appendChild(renderer.domElement);

}

function animate() {

    requestAnimationFrame(animate);

    // Silly function name, basically checks to see what keys are pressed and then changes the xPos, yPos, zPos, ETC variables - this allows for multiple keys to be detected and removes the press, then delay, then spam press of a key
    calculateMovement();


    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    jmesh.rotation.x += 0.02;
    jmesh.rotation.y += 0.01;



    // pitch
    camera.rotation.x += degToRad(upRot);
    // yaw
    camera.rotation.y += degToRad(sideRot);


    // Normalise the rotation of the camera so that we have no values negative or above 360
    normaliseCameraRotation();

    // Make sure the camera can't look up or down to far
    if(radToDeg(camera.rotation.x) > 90 && radToDeg(camera.rotation.x) <= 180 ){
        camera.rotation.x = degToRad(90);
    }
    else if(radToDeg(camera.rotation.x) > 180 && radToDeg(camera.rotation.x) < 270 ){
        camera.rotation.x = degToRad(270);
    }

    console.log("camera.rotation.x is " + radToDeg(camera.rotation.x));


    upRot = 0;
    sideRot = 0;

    console.log("Math.cos(camera.rotation.y) * xPos: " + Math.cos(camera.rotation.y) * xPos + " Math.sin(camera.rotation.y) * xPos: " + Math.sin(camera.rotation.y) * xPos);

    camera.position.x += (Math.sin(camera.rotation.y) * zPos) + (Math.cos(camera.rotation.y) * xPos);
    camera.position.y += degToRad(yPos);
    camera.position.z += (Math.cos(camera.rotation.y) * zPos) - (Math.sin(camera.rotation.y) * xPos);


    xPos = 0;
    yPos = 0;
    zPos = 0;

    renderer.render(scene, camera);

}

/*
 ** Unit Processing
 */

// Converts from degrees to radians.
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}
;

// Converts from radians to degrees.
function radToDeg(radians) {
    return radians * 180 / Math.PI;
}
;

function normaliseCameraRotation(){
    // y rotation (yaw)
    if (radToDeg(camera.rotation.y) < 0) {
        camera.rotation.y += degToRad(360);
    } else if (radToDeg(camera.rotation.y) > 360) {
        camera.rotation.y -= degToRad(360);
    } 

    // x rotation (pitch)
    if (radToDeg(camera.rotation.x) < 0) {
        camera.rotation.x += degToRad(360);
    } else if (radToDeg(camera.rotation.x) > 360) {
        camera.rotation.x -= degToRad(360);
    } 

    // z rotation (roll)
    if (radToDeg(camera.rotation.z) < 0) {
        camera.rotation.z += degToRad(360);
    } else if (radToDeg(camera.rotation.z) > 360) {
        camera.rotation.z -= degToRad(360);
    } 
}

/*
 ** Input Detection
 */

document.onkeydown = checkKeyDown;

function checkKeyDown(e) {

    e = e || window.event;

    console.log("e is " + e.keyCode);

    if (!isNaN(e.keyCode)) {
        console.log("Key down");
        keyStates[parseInt(e.keyCode)] = true;
    }
}

document.onkeyup = checkKeyUp;

function checkKeyUp(e) {

    e = e || window.event;

    if (!isNaN(e.keyCode)) {
        keyStates[parseInt(e.keyCode)] = false;
    }
}




function calculateMovement() {

    // W
    if (keyStates[87] == true) {
        zPos -= 10
    }
    // S
    if (keyStates[83] == true) {
        zPos += 10;
    }
    // A
    if (keyStates[65] == true) {
        xPos -= 10;
    }
    // D
    if (keyStates[68] == true) {
        xPos += 10;
    }
    // Up Arrow
    if (keyStates[38] == true) {
        upRot += 1;
    }
    // Down Arrow
    if (keyStates[40] == true) {
        upRot -= 1;
    }
    // Left Arrow
    if (keyStates[37] == true) {
        sideRot += 1;
    }
    // Right Arrow
    if (keyStates[39] == true) {
        sideRot -= 1;
    }

}