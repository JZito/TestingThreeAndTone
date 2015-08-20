// var x = null;
// var y = null;

// document.addEventListener('mousemove', onMouseUpdate, false);
// document.addEventListener('mouseenter', onMouseUpdate, false);

// function onMouseUpdate(e) {
//     x = e.pageX;
//     y = e.pageY;
// }

// function getMouseX() {
//     return x;
// }

// function getMouseY() {
//     return y;
// }
var synthNotes = ["C2", "E2", "G2", "B2", 
					  "E3", "G3", "B3", "D4", "A4", "E5"];
var colors = [];
var container, stats;
var camera, scene, renderer;
var particleMaterial;
var turnedOff = 0;
var turnedOn = 1;

var raycaster;
var mouse;

var objects = [];
var ticker = 0;

init();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	var info = document.createElement( 'div' );
	info.style.position = 'absolute';
	info.style.top = '10px';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	info.innerHTML = 'click to turn each cube on and off';
	container.appendChild( info );

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 0, 300, 500 );

	scene = new THREE.Scene();

	var geometry = new THREE.BoxGeometry( 100, 100, 100 );

	for ( var i = 0; i < 10; i ++ ) {
		var col = Math.random() * 0xffffff;
		colors[i] = col;
		var object = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: col, opacity: 0.5 } ) );
		object.position.x = Math.random() * 800 - 400;
		object.position.y = Math.random() * 800 - 400;
		object.position.z = Math.random() * 800 - 400;

		object.scale.x = Math.random() * 2 + 1;
		object.scale.y = Math.random() * 2 + 1;
		object.scale.z = Math.random() * 2 + 1;

		object.rotation.x = Math.random() * 2 * Math.PI;
		object.rotation.y = Math.random() * 2 * Math.PI;
		object.rotation.z = Math.random() * 2 * Math.PI;
		object.uniqueNote = i;
		console.log(object.uniqueNote);
		object.claim = turnedOff;
		object.originalColor = object.material.color;

		scene.add( object );

		objects.push( object );

	}

	var PI2 = Math.PI * 2;
	particleMaterial = new THREE.SpriteCanvasMaterial( {

		color: 0x000000,
		program: function ( context ) {

			context.beginPath();
			context.arc( 0, 0, 0.5, 0, PI2, true );
			context.fill();

		}

	} );
				
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	renderer = new THREE.CanvasRenderer();
	renderer.setClearColor( 0xf0f0f0 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	// stats = new Stats();
	// stats.domElement.style.position = 'absolute';
	// stats.domElement.style.top = '0px';
	// container.appendChild( stats.domElement );

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );

	//

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentTouchStart( event ) {
	
	event.preventDefault();
	
	event.clientX = event.touches[0].clientX;
	event.clientY = event.touches[0].clientY;
	onDocumentMouseDown( event );

}	

function onDocumentMouseDown( event ) {

	event.preventDefault();

	mouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
	mouse.y = - ( event.clientY / renderer.domElement.height ) * 2 + 1;

	raycaster.setFromCamera( mouse, camera );

	var intersects = raycaster.intersectObjects( objects );

	if ( intersects.length > 0 ) {
		var n = synthNotes[intersects[0].object.uniqueNote];
		console.log(intersects[0].object.uniqueNote);


		//intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );
		if (intersects[ 0 ].object.claim == turnedOn) {
			
			console.log("turned off");
			synth.triggerRelease(n);
			intersects[ 0 ].object.claim = turnedOff;
			intersects[0].object.material.color.setHex(colors[intersects[0].object.uniqueNote]);

		}
		else if (intersects[ 0 ].object.claim == turnedOff) {
			
			console.log("turned on");
			synth.triggerAttack(n);
			intersects[ 0 ].object.claim = turnedOn;
			intersects[0].object.material.color.setHex(666699)
		}
		

		var particle = new THREE.Sprite( particleMaterial );
		particle.position.copy( intersects[ 0 ].point );
		particle.scale.x = particle.scale.y = 16;
		scene.add( particle );

	}

	/*
	// Parse all the faces
	for ( var i in intersects ) {

		intersects[ i ].face.material[ 0 ].color.setHex( Math.random() * 0xffffff | 0x80000000 );

	}
	*/
}

			//

function animate() {

	requestAnimationFrame( animate );

	render();
	// stats.update();

}

var radius = 600;
var theta = 0;

function render() {

	theta += 0.1;

	camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
	camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
	camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
	camera.lookAt( scene.position );

	renderer.render( scene, camera );

}

var reverb = new Tone.FeedbackDelay("16t", .85).toMaster();
// var delay = new Tone.FeedbackDelay(0.5); 
// delay.wet.value = .5;
reverb.set("feedback", .5);





var synth = new Tone.PolySynth(10,Tone.Monosynth).chain(reverb);

synth.set({
		"vibratoAmount" : 1,
		"vibratoRate" : 2,
		"portamento" : 0.1,
		"harmonicity" : 5,
		"volume" : 5,
		"voice0" : {
			"volume" : -2,
			"oscillator" : {
				"type" : "sawtooth"
			},
			"filter" : {
				"Q" : 1,
				"type" : "lowpass",
				"rolloff" : -24
			},
			"envelope" : {
				"attack" : 0.01,
				"decay" : 0.25,
				"sustain" : 0.4,
				"release" : 1.2
			},
			"filterEnvelope" : {
				"attack" : 0.001,
				"decay" : 0.05,
				"sustain" : 0.3,
				"release" : 2,
				"min" : 100,
				"max" : 10000
			}
		},
		"voice1" : {
			"volume" : -10,
			"oscillator" : {
				"type" : "sawtooth"
			},
			"filter" : {
				"Q" : 2,
				"type" : "bandpass",
				"rolloff" : -12
			},
			"envelope" : {
				"attack" : 0.25,
				"decay" : 4,
				"sustain" : 0.1,
				"release" : 0.8
			},
			"filterEnvelope" : {
				"attack" : 0.05,
				"decay" : 0.05,
				"sustain" : 0.7,
				"release" : 2,
				"min" : 5000,
				"max" : 2000
			}
		}
	});



var kick = new Tone.MonoSynth({
	"portamento" : 0.00,
	"oscillator" : {
		"type" : "square"
	},
	"filter" : {
		"Q" : 2,
		"type" : "bandpass",
		"rolloff" : -12
	},
	"envelope" : {
		"attack" : 0.01,
		"decay" : 0.2,
		"sustain" : 0.0,
		"release" : 0.2
	},
	"filterEnvelope" : {
		"attack" : 0.01,
		"decay" : 0.2,
		"sustain" : 1,
		"release" : 0.4,
		"min" : 3000,
		"max" : 30
	}
}).toMaster();

	//randomly generate a highhat score on each refresh
// var highHatNotes = [];
	
// for (var i = 0; i < 16*4; i++){
// 		var probability = (i % 2) === 0 ? 1 : 0.2;
// 		highHatNotes.push([i+"*16n", probability]);
// }

// Tone.Note.route("synth", function(time, note, duration, probability){
// 	//	if (Math.random() < probability + globalProbability){
// 			synth.triggerAttackRelease(note, time);
// 	//	}
// 	});

Tone.Note.route("kick", function(time, probability){
	//	if (Math.random() < probability + globalProbability){
			kick.triggerAttack("C2", time);
	//	}
	});

// var Score = {
// 	"hats" : highHatNotes,
// 	"kick" : [["0", 1],["0:2", 1], 
// 			  ["1:0", 1],["1:2", 1], ["1:3:2", 0.3], 
// 			  ["2:0", 1],["2:2", 1], 
// 			  ["3:0", 1],["3:2", 1], ["3:3:2", 0.5]],
// 	"snare" : ["0:1", "0:3", 
// 			   "1:1", "1:3", 
// 			   "2:1", "2:3", 
// 			   "3:1", "3:3"],
// 	"synth" : [["0:0", ["A2","E4","C3"], "4n + 8n", 1], 
// 	//["0:2", "C2", "8n", 0.5], 
// 			  ["0:2 + 4t", ["G2","E3","B3"], "8n", 0.2], 
// 			  //["0:2 + 4t*2", "C2", "8n", 0.7],
// 			  ["1:0", ["C2","E4","B3"], "4n + 8n", 1], 
// 			  //["1:2", "C2", "8n", 0.5], 
// 			  ["1:2 + 4t", ["E2","G3","D4"], "8n", 0.2], 
// 			  //["1:2 + 4t*2", "E2", "8n", 0.7],
// 			  ["2:0", "F2", "4n + 8n", 1], ["2:2", "F2", "8n", 0.5], 
// 			  ["2:2 + 4t", "F2", "8n", 0.2], ["2:2 + 4t*2", "F2", "8n", 0.7],
// 			  ["3:0", "F2", "4n + 8n", 1], ["3:2", "F2", "8n", 0.5], 
// 			  ["3:2 + 4t", "E2", "8n", 0.2], ["3:2 + 4t*2", "B1", "8n", 0.7]]
// };

// Tone.Transport.setInterval(function(time){
// 	delay.wet.value = (getMouseY() * .001);
// 	reverb.wet.value=(getMouseX() * .001);
// 	console.log("bing");
	
// 	//noteIndex = noteIndex + 1 % notes.length;
// }, "16n");

// Tone.Note.parseScore(Score);

Tone.Transport.setLoopPoints(0, "4m");
	Tone.Transport.loop = true;

Tone.Transport.start();

