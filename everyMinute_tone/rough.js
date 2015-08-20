var kick = new Tone.DrumSynth({
"envelope" : {
	"sustain" : 0,
	"attack" : 0.02,
	"decay" : 0.8
},
"octaves" : 10
}).toMaster();
Tone.Note.route("Kick", function(time){
kick.triggerAttackRelease("C2", "8n", time);
});
/*
SNARE
*/
var snare = new Tone.NoiseSynth().toMaster();
Tone.Note.route("Snare", function(time){
snare.triggerAttackRelease("8n", time);
});
/**
*  PIANO
*/
var piano = new Tone.PolySynth(4, Tone.SimpleSynth).toMaster();
Tone.Note.route("Piano", function(time){
piano.triggerAttackRelease(["c4", "e4", "a4"], "8n", time);
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

Tone.Note.route("Bass", function(time, note, duration){
	bass.triggerAttackRelease(note, duration, time);
});
/**
*  SCORE
*/

function makeBeats () {
	var beatArray = [];
	for (var i = 0; i < 4; i++) {
		var firstNumber = i;
		for (var j = 0; j < 2; j++){
			var entry = firstNumber.toString() + ":" + j.toString();
			beatArray.push(entry);
			console.log(entry);
		}
	}

	return beatArray;
}

var kickTimes = makeBeats();
var Score = {
	"Kick" : [
		kickTimes[0], kickTimes[1],
		kickTimes[2], kickTimes[3],
		"2:0", "2:2" ,
		"3:0", "3:2" ,
	],
	"Snare" : [
		"0:1", "0:3",
		"1:1", "1:3",
		"2:1", "2:3",
		"3:1", "3:3"
	],
	"Piano" : [
		"0:0", "0:0:1",
		"1:0", "1:0:1",
		"2:0", "2:0:1",
		"3:0", "3:0:1"
	],
	//additional arguments to the array format are
	//passed back to the route's callback function
	"Bass" : [
		["0:0", "C2", "4n"], 
		["1:0", "A2", "2n"], 
		["2:0", "F2", "4n"], 
		["3:0", "C2", "2n"], 
	]
};
Tone.Note.parseScore(Score);
Tone.Transport.loop = true;
Tone.Transport.bpm.value = 90;
Tone.Transport.setLoopPoints(0, "4m");
Tone.Transport.start();