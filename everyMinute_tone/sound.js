// var hi, ranNotes = [12,11,9,7,5,4,2,0,-1], 
// beets = [1, 1/1.5, , , , 1/2, 1/2, 1/3, 1/3,1/6, 1/4, 1/4, 1/4,1/8, 1/8,1/8,1/16, 1/16, 1/32],
// ticker = 0, a, b, bus;
//var synth = new Tone.PolySynth(6, Tone.SimpleSynth).toMaster();
var x = null;
var y = null;

document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);

function onMouseUpdate(e) {
    x = e.pageX;
    y = e.pageY;
}

function getMouseX() {
    return x;
}

function getMouseY() {
    return y;
}

function RandomNotes () {
	for (var i = 0; i <6; i++){
			innerArray[i] = notes[getRandomInt(0,notes.length)];
			console.log(innerArray[i]);
		}
}

//the transport won't start firing events until it's started


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var dist = new Tone.FeedbackDelay("3n", .76).toMaster();
var synth = new Tone.SimpleSynth().connect(dist);
dist.wet.rampTo(1, 3);

var notes = ["C2", "D2", "E2","G2", "A2","B2","C3","E3","G3","A3","B3", "E4", "G4", "B4"];
var beets = ["4m", "2m", "1m", "6n", "4n", "4n", "4n", "3n", "8n", "16n", "16n"]
var innerArray = [];
var position = 0;

var feedbackDelay = new Tone.FeedbackDelay("8n", .75).toMaster();
var tom = new Tone.DrumSynth({
	"octaves" : 4,
	"pitchDecay" : 0.1
}).connect(feedbackDelay);


var synth = new Tone.SimpleSynth().toMaster();

var beet = beets[getRandomInt(0,beets.length)];

// Tone.Transport.setInterval(function(time){

// 	if (position == 0){
// 		RandomNotes();
// 	}
//     var note = innerArray[position++];
//     position = position % innerArray.length;
//     tom.triggerAttackRelease(note,"32n");

//     synth.triggerAttackRelease(note, .33, time);

// },beet);

Tone.Transport.setInterval(function(time){
	var noteIndex = Math.floor(getMouseX() * notes.length);
	var note = notes[noteIndex];
	synth.triggerAttackRelease(note, "8n", time);
	//noteIndex = noteIndex + 1 % notes.length;
}, "4n");


Tone.Transport.start();

Tone.Transport.bpm.rampTo(280, 8);





//Tone.Transport.start();
