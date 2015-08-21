


//////////// MUSIC TONE SECTION






function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var notes = [  ["C3", "D3", "E3", "G2", "A2", "B2", "C3"],
				["C3", "D3", "E3", "G3", "A3", "B3", "C4"],
				["C4", "D4", "E4", "G4", "A4", "B4", "C5"],
				["C5", "D5", "E5", "G5", "A5", "B5", "C6"] ]   ;

//to do: expand durations to multi-dim array for ....? short/fast? triplet? dotted?
var durations = ["8t", "4n", "8n", "16n"];
var valuesX = [], valuesY = [], valuesZ = [];
var beats = [.25, .5, .75, 1, .25, .25, .5, 1, .75, 2];

///FX

var lowPass = new Tone.Filter({
		    "frequency": 16000,
}).toMaster();

var freeverb = new Tone.Freeverb().toMaster();
freeverb.dampening.value = 1000;
valuesX[1] = (freeverb.wet);
valuesY[3] = (freeverb.dampening);

var dist = new Tone.Distortion(0.8).connect(freeverb);
valuesY[0] = (dist.wet);

var feedbackDelay = new Tone.FeedbackDelay("4t", 0.75).connect(lowPass);
feedbackDelay.wet.value = .01;
valuesY[1] = (feedbackDelay.wet);
valuesY[2] = (feedbackDelay.feedback);

var feedbackDelayClosed = new Tone.FeedbackDelay("2t", 0.25).connect(lowPass);
feedbackDelayClosed.wet.value = .25;
valuesX[0] = (feedbackDelayClosed.wet);
valuesX[2] = (feedbackDelayClosed.feedback);

var reverb = new Tone.JCReverb(1).connect(freeverb);

reverb.wet.value = .1;

console.log (reverb.wet.value + " reverb.wet, " + dist.wet.value + " dist wet, " + feedbackDelay.wet.value + " feedbackdelay wet" )



/*
SNARE
*/
var snare = new Tone.NoiseSynth().connect(dist);
Tone.Note.route("Snare", function(time){
	snare.triggerAttackRelease("8n", time);
});


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


// freeverb.roomSize.value = 


var piano = new Tone.PolySynth(4, Tone.DuoSynth).connect(reverb);

piano.set({
	"voice0": {
		"voice0" : {
			"filter" : {
				"type" : "highpass"
			},
			"envelope" : {
				"attack" : 2,
				"sustain" : 1,
				"release" : .95
			}
		}
	},
	"voice1": {
		"harmonicity" : 3.67,
			"filter" : {
			"type" : "lowpass"
		},
		"envelope" : {
			"attack" : 2,
			"sustain" : .25,
			"release" : .5
		}
	},
	"voice2" : {
			"harmonicity" : 2,
			"filter" : {
			"type" : "highpass"
		},
		"envelope" : {
			"attack" : 2,
			"sustain" : .25,
			"release" : .5
		}
	}
});

Tone.Note.route("piano", function(time, note, duration){
	piano.triggerAttackRelease(note, duration, time);
});
/*
BASS
*/

var bass = new Tone.MonoSynth({
	"volume" : -10,
	"envelope" : {
		"attack" : 0.25,
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
 // bass.start;

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
}).connect(feedbackDelayClosed);


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
		}).connect(feedbackDelay);



Tone.Note.route("openHiHat", function(time) {
		    openHiHat.triggerAttack(time);
		});

valuesX[3] = (reverb.roomSize);
valuesZ[0] = (reverb.wet);
valuesZ[1] = bass.filterEnvelope;
valuesZ[2] = piano.voices[0].voice0.filterEnvelope;
valuesZ[3] = piano.voices[1].voice0.filterEnvelope;


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
		var duration = durations[ getRandomInt(0, durLen) ];
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

for (var p = 0; p < pianoTimes.length; p++) {
	console.log(pianoTimes[p]);
}
var Score = {
	"kick" : [
		"0:0", "0:1", "0:2", "0:3",
		"1:0", "1:1", "1:2", "1:3",
		"2:0", "2:1", "2:2", "2:3",
		"3:0", "3:1", "3:2", "3:3"
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
		["0:0", ["C2", "E3", "G4"], "1m"],
		["1:0", ["D2", "A3", "C4"], "1m"],
		["2:0", ["G2", "D3", "A4"], "1m"],
		["3:0", ["D3", "A2", "E4"], "1m"]
	],
	"snare" : [
		 "0:1", "0:3",
		"1:1",  "1:3",
		"2:0", "2:1", "2:2", "2:3",
		"3:0", "3:1", "3:2", "3:3"
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


///////////// THREE VISUAL SECTION //////////////////////////////////////////////////
var container, stats;
var camera, 
//controls, 
scene, renderer;
var objects = [], plane;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(),
offset = new THREE.Vector3(),
INTERSECTED, SELECTED;

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;

    // controls = new THREE.TrackballControls( camera );
    // controls.rotateSpeed = 1.0;
    // controls.zoomSpeed = 1.2;
    // controls.panSpeed = 0.8;
    // controls.noZoom = false;
    // controls.noPan = false;
    // controls.staticMoving = true;
    // controls.dynamicDampingFactor = 0.3;

    scene = new THREE.Scene();

    scene.add( new THREE.AmbientLight( 0x505050 ) );

    var light = new THREE.SpotLight( 0xffffff, 1.5 );
    light.position.set( 0, 500, 2000 );
    light.castShadow = true;

    light.shadowCameraNear = 200;
    light.shadowCameraFar = camera.far;
    light.shadowCameraFov = 50;

    light.shadowBias = -0.00022;
    light.shadowDarkness = 0.5;

    light.shadowMapWidth = 2048;
    light.shadowMapHeight = 2048;

    scene.add( light );

    var geometry = new THREE.BoxGeometry( 40, 40, 40 );

    for ( var i = 0; i < 4; i ++ ) {

      var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

      object.position.x = Math.random() * 1000 - 500;
      object.position.y = Math.random() * 600 - 300;
      object.position.z = Math.random() * 800 - 400;

      object.rotation.x = Math.random() * 2 * Math.PI;
      object.rotation.y = Math.random() * 2 * Math.PI;
      object.rotation.z = Math.random() * 2 * Math.PI;

      object.scale.x = Math.random() * 2 + 1;
      object.scale.y = Math.random() * 2 + 1;
      object.scale.z = Math.random() * 2 + 1;

      object.castShadow = true;
      object.receiveShadow = true;

      scene.add( object );

      objects.push( object );

    }

    plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry( 2000, 2000, 8, 8 ),
      new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.25, transparent: true } )
    );
    plane.visible = false;
    scene.add( plane );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( 0xf0f0f0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    

    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFShadowMap;

    container.appendChild( renderer.domElement );

    var info = document.createElement( 'div' );
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.innerHTML = 'drag a cube to change the sound';
    container.appendChild( info );

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );

    renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
    renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
    renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    //

    raycaster.setFromCamera( mouse, camera );

    if ( SELECTED ) {

      var intersects = raycaster.intersectObject( plane );
      SELECTED.position.copy( intersects[ 0 ].point.sub( offset ) );
      return;

    }

    var intersects = raycaster.intersectObjects( objects );

    if ( intersects.length > 0 ) {

      if ( INTERSECTED != intersects[ 0 ].object ) {

        if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

        INTERSECTED = intersects[ 0 ].object;
        INTERSECTED.currentHex = INTERSECTED.material.color.getHex();

        plane.position.copy( INTERSECTED.position );
        plane.lookAt( camera.position );

      }

      container.style.cursor = 'pointer';

    } else {

      if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

      INTERSECTED = null;

      container.style.cursor = 'auto';

    }      

}

function onDocumentMouseDown( event ) {

    event.preventDefault();

    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 ).unproject( camera );

    var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

    var intersects = raycaster.intersectObjects( objects );

    if ( intersects.length > 0 ) {

      // controls.enabled = false;

      SELECTED = intersects[ 0 ].object;

      var intersects = raycaster.intersectObject( plane );
      offset.copy( intersects[ 0 ].point ).sub( plane.position );

      container.style.cursor = 'move';

    }

}

function onDocumentMouseUp( event ) {

    event.preventDefault();

    // controls.enabled = true;

    if ( INTERSECTED ) {

      plane.position.copy( INTERSECTED.position );

      SELECTED = null;

    }

    container.style.cursor = 'auto';

}

      //

function animate() {

    requestAnimationFrame( animate );

    render();
    stats.update();

}



var radius = 600;
var theta = 0;

function render() {
	// create array of values to log and then a for each to say if any positon
	// go below o, ceiling it to 0
	// value = value < 0 ? 0 : value;
	var valuesLen = valuesX.length;
	//console.log (reverb.wet.value + " reverb.wet, " + dist.wet.value + " dist wet, " + feedbackDelay.wet.value + " feedbackdelay wet" )

	for (var i = 0; i <  valuesLen; i++) {
		var val0 = (objects[i].position.x / 1000)
		val0 = val0 < 0 ? 0 : val0;
		valuesX[i].value = val0;
		// console.log(val0 + objects[i]);
		 valuesY[i].value = (objects[i].position.y / 1000);
		 console.log (valuesZ[i] + i);
		 valuesZ[i].value = (objects[i].position.z * 5);
		 
		//console.log(valuesX[i] + " . " + valuesX[i].value)
	}
	var kickValue = (kickEnvelope.value * 5) + 2;
	var bassValue = (bass.envelope.value *5 ) + 2;
	var hiHatValue = ((closedHiHat.envelope.value += openHiHat.envelope.value) ) + 2;
	var pianoValue = piano.volume.value;
	//var pianoValue = (piano.voices[0].voice0.envelope.value += piano.voices[1].voice0.envelope.value) + 2;
	
	theta += 0.1;
	//feedbackDelayClosed.wet.value = .25;
	// console.log(objects[0].position.x / 800);
	// console.log( kickValue );
	// console.log (bassValue);
	// console.log( hiHatValue);ff
	//position
	// delay.wet.value = (getMouseY() * .001);
 // 	reverb.wet.value=(getMouseX() * .001);

	// size
	objects[1].scale.z = kickValue;
	objects[2].scale.y = bassValue;
	objects[0].scale.x = hiHatValue;
	// camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
	// camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
	// camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
	camera.lookAt( scene.position );

	renderer.render( scene, camera );

}