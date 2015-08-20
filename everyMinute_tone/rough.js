


//////////// MUSIC TONE SECTION


// /*
// SNARE
// */
// var snare = new Tone.NoiseSynth().toMaster();
// Tone.Note.route("Snare", function(time){
// snare.triggerAttackRelease("8n", time);
// });

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var notes = [  ["C2", "D2", "E2", "G2", "A2", "B2", "C3"],
				["C3", "D3", "E3", "G3", "A3", "B3", "C4"],
				["C4", "D4", "E4", "G4", "A4", "B4", "C5"],
				["C5", "D5", "E5", "G5", "A5", "B5", "C6"] ]   ;

//to do: expand durations to multi-dim array for ....? short/fast? triplet? dotted?
var durations = ["8t", "4n", "8n", "16n"];

var beats = [.25, .125, .5, .75, 1, .25, .25, .5, 1, .75, 2];

///FX

var lowPass = new Tone.Filter({
		    "frequency": 14000,
}).toMaster();

//// kick

var kickEnvelope = new Tone.AmplitudeEnvelope({
    "attack": 0.01,
    "decay": 0.25,
    "sustain": 0,
    "release": 0
}).toMaster();

var kick = new Tone.Oscillator("C1").connect(kickEnvelope);
kick.start();

kickSnapEnv = new Tone.ScaledEnvelope({
    "attack": 0.00125,
    "decay": 0.005,
    "sustain": 0,
    "release": 0,
    "min": "110",
    "max": 400
}).connect(kick.frequency);

Tone.Note.route("kick", function(time) {
    kickEnvelope.triggerAttack(time);
    kickSnapEnv.triggerAttack(time);
});

/**
*  PIANO
*/

var piano = new Tone.PolySynth(4, Tone.DuoSynth).toMaster();

Tone.Note.route("piano", function(time, note, duration){
	piano.triggerAttackRelease(note, duration, time);
});
/*
BASS
*/

var bass = new Tone.MonoSynth({
	"volume" : -10,
	"envelope" : {
		"attack" : 0.1,
		"decay" : 0.3,
		"release" : 2,
	},
	"filterEnvelope" : {
		"attack" : 0.01,
		"decay" : 0.1,
		"sustain" : 0.5,
		"min" : 200,
		"max" : 1200
	}
}).toMaster();
 bass.start;

Tone.Note.route("bass", function(time, note, duration){
	bass.triggerAttackRelease(note, duration, time);
});
/*
HI HATS HI-HATS
*/

var closedHiHat = new Tone.NoiseSynth({
	"volume" : -10,
    "filter": {
        "Q": 1
    },
    "envelope": {
        "attack": 0.01,
        "decay": 0.15
    },
    "filterEnvelope": {
        "attack": 0.01,
        "decay": 0.03,
        "min": 4000,
        "max": 700,
        "exponent": 4,

    }
}).connect(lowPass);


Tone.Note.route("closedHiHat", function(time) {
		    closedHiHat.triggerAttack(time);
		});

var openHiHat = new Tone.NoiseSynth({
			"volume" : -10,
		    "filter": {
		        "Q": 1
		    },
		    "envelope": {
		        "attack": 0.01,
		        "decay": 0.3
		    },
		    "filterEnvelope": {
		        "attack": 0.01,
		        "decay": 0.03,
		        "min": 4000,
		        "max": 700,
		        "exponent": 4,
		    }
		}).connect(lowPass);

Tone.Note.route("openHiHat", function(time) {
		    openHiHat.triggerAttack(time);
		});


/**
*  SCORE
*/

var melodyReturn = function (oct, numberOfNotes) {
	var noteLen = notes.length -1;
	var scoreNotes = [];
	var lastNumber;
	for (var i = 0; i < numberOfNotes; i++) {
		lastPos = 0;
		var coin = Math.round(Math.random()*2);
		if (coin == 1) {
			var uOrD = [-1,0,1];
			if (notes[oct][lastPos + uOrD]){
				scoreNotes[i] = notes[oct][lastPos + uOrD];
			}
			else {
				scoreNotes[i] = notes[oct][ getRandomInt(0,noteLen) ];
			}
			lastPos = i;
		}
		else {
  			scoreNotes[i] = notes[oct][ getRandomInt(0,noteLen) ];
  			lastPos = i;
  		}
	}
	return scoreNotes;
};

var chordsReturn = function (c, cLength) {
	//c is amount of chords to create
	var chords = [], oct = [-12,-12,-12,0,0,0,12,12], 
	notesLen = notes[2].length - 1,
	pedalPoint = notes[1][ getRandomInt( 0,notesLen ) ];
	for (var i = 0; i < c; i++){
		var innerChord= [];
		if (i == 0){
			for (var j = 0; j < cLength; j++) {
				//first note is pedal point
				if (j==0){
					innerChord.push(pedalPoint)
				}
				else if (j >= 1){
					var n = notes[2][ getRandomInt( 0,notesLen ) ];
					innerChord.push(n);
				}
			}
		}
		// create additional chords
		else if( i >= 1) {
			for (var j = 0; j < cLength; j++) {
				// first note is pedal point
				if (j==0){
					innerChord.push(pedalPoint)
				}
				else if (j >= 1) {
					var noteInt = getRandomInt (0, notesLen) ;
					var n = notes[2][ noteInt ];
					//if this note is the same as the note in the same spot of the last chord
					if (n == chords[(i - 1)][j]) {
						if (noteInt != 0){
							n = notes[2][noteInt - 1];
						}
						else if (noteInt == 0) {
							n = notes[2][noteInt + 1];
						}
						//else if new note o is not in key, move it down one more step
						innerChord.push(n);
					}
					else if (n != chords[(i-1)] [j]) {
						innerChord.push(n);
					}
				}
			}
		}
		
		chords.push(innerChord);
	//	console.log(innerChord + "innerchord")
	}
	return chords;
};

function makeMelody () {

}

function makeScore (kind) {
	
	var noteLen = notes.length -1;
	var durLen = durations.length -1 ;
	var beatLen = beats.length -1;
	var beatArray = [];
	
	for (var i = 0; i < 4; i++) {
		var len = getRandomInt(1,6);
		var scoreNotes = [];
		if (kind == 'bass'){
			scoreNotes = melodyReturn(i, len);
		}
		if (kind == 'piano'){
			scoreNotes = chordsReturn(len, 3);
		}
		
		

		// for (var k = 0; k < len; k ++){
	 //  		//grab some beats
	 //  		scoreBeets.push(beets[getRandomInt( 0, beatLen ))]);	
	 //  	}
		
		var firstNumber = i;
		var prevEntry = 0;
		//var note = notes[i][ getRandomInt(0,noteLen) ];
		
		for (var j = 0; j < len; j++){
			var beat;
			if (kind == 'bass'){
				var note = scoreNotes[j];
			}
			if (kind == 'piano') {
				var note = [];
				note = scoreNotes[j];
				console.log(note + " kind [[ piano")
			}
			
			

			//if first beat grab a single beat
			if (j == 0){ 
				var coin = Math.round(Math.random()*2);
				var b;
				if (coin==1){
					b = beats[ getRandomInt( 0,beatLen ) ]; 
					if (b % .25 === 0 ) {
						prevEntry = prevEntry + .25;
					}
				}
				else {
					b = 0;
				}
				
				// if (b )
				beat = b;
			}

			else if (j > 0) {
				if (prevEntry % .125 === 0 ) {
					prevEntry = prevEntry + .25;
				}
				var b = beats[ getRandomInt( 0,beatLen ) ] + prevEntry;
				
				beat = b;
					
			}

			if (beat >= 4) { break; }

			var beatEntry = [];
			
			
			
			
			var duration = durations[ getRandomInt(0, durLen) ];

			prevEntry = beat;

			beatEntry.push( firstNumber.toString() + ":" + beat.toString() );
			beatEntry.push( note );
			beatEntry.push( duration );

			beatArray.push( beatEntry )
			console.log(beatEntry + " . beatEntry" + note)
		}
	}

	return beatArray;
}

var bassTimes = makeScore('bass');
var pianoTimes = makeScore('piano');
var Score = {
	"kick" : [
		"0:0", "0:2", "1:0", "1:2",
		"2:0", "2:2", "3:0", "3:2"
	],
	"closedHiHat": [
		"0*8n", "1*8n", "3*8n", 
		"4*8n", "5*8n", "8*8n",
		"9*8n", "10*8n", "11*8n", 
		"12*8n", "13*8n", "15*8n", "15*8n",
		"16*8n", "17*16n", "17*8n", "19*8n", 
		"20*8n", "21*8n", "21*8n", "22*8n",
		"24*8n", "25*16n", "25*8n", "27*8n", 
		"28*8n", "29*8n", "29*8n", "30*8n",
	],
	"openHiHat": [
		"2*8n", "6*8n",
		"10*8n", "14*8n",
		"18*8n", "22*8n",
		"26*8n", "30*8n",
	],
	"piano" : [
		pianoTimes[0], pianoTimes[1], pianoTimes[2], pianoTimes[3],
		pianoTimes[4], pianoTimes[5], pianoTimes[6], pianoTimes[7]
	],
	//additional arguments to the array format are
	//passed back to the route's callback function
	"bass" : 


		bassTimes
		// kickTimes[4], kickTimes[5],
		// kickTimes[0], kickTimes[1],
		// kickTimes[2], kickTimes[3],
		// kickTimes[4], kickTimes[5],
	
};


Tone.Note.parseScore(Score);
Tone.Transport.loop = true;
Tone.Transport.bpm.value = 67;
Tone.Transport.setLoopPoints(0, "4m");
Tone.Transport.start();


///////////// THREE VISUAL SECTION
var colors = [];
//var container, stats;
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

	for ( var i = 0; i < 3; i ++ ) {
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
	//	var n = synthNotes[intersects[0].object.uniqueNote];
		console.log(intersects[0].object.uniqueNote);


		//intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );
		if (intersects[ 0 ].object.claim == turnedOn) {
			
			console.log("turned off");
			//synth.triggerRelease(n);
			intersects[ 0 ].object.claim = turnedOff;
			intersects[0].object.material.color.setHex(colors[intersects[0].object.uniqueNote]);

		}
		else if (intersects[ 0 ].object.claim == turnedOff) {
			
			console.log("turned on");
			//synth.triggerAttack(n);
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
	var kickValue = (kickEnvelope.value * 5) + 2;
	var bassValue = (bass.envelope.value *5 ) + 2;
	var hiHatValue = ((closedHiHat.envelope.value += openHiHat.envelope.value) ) + 2;
	theta += 0.1;
	// console.log( kickValue );
	// console.log (bassValue);
	// console.log( hiHatValue);
	objects[1].scale.z = kickValue;
	objects[2].scale.y = bassValue;
	objects[0].scale.x = hiHatValue;
	camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
	camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
	camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
	camera.lookAt( scene.position );

	renderer.render( scene, camera );

}