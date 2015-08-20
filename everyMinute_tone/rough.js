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

/**
*  PIANO
*/

var piano = new Tone.PolySynth(4, Tone.DuoSynth).toMaster();
Tone.Note.route("Piano", function(time){
	piano.triggerAttackRelease(["c4", "e4", "a4"], "16n", time);
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

function wholeBeetsReturn (mul, len) {
	var scoreBeets = [], sum;
	
  	for (var i = 0; i < len; i ++){
  		//grab some beets
  		scoreBeets.push(beets[floor(random(1, beets.length))]);	
  	}
	//add contents of beets array
  	sum = scoreBeets.reduce(add, 0);
  	//if the sum is an odd number
  	if (sum %2 != 0) {
  	//sumRound is difference between sum and a whole set of measures
  		var sumRound;
  	// if sum will not round to 1, is short phrase
  		if (sum < .5){
  			sumRound = .5 - sum;
  			scoreBeets.push(sumRound);
  		}
  		else {
  	// if odd and >= 1,
  	//not just round but floor the amount to round up by by one for simplicity. 
			sumRound = Math.ceil(sum) - sum; 
  			if (Math.abs(sum + sumRound) % 2 == 1 && (sum + sumRound) >= 3) {
  				//if this new, larger sum to round plus sum 
  				//gonna add up to an odd number like 3, 5, etc add one more to it
  				sumRound = sumRound + 1;
 				}
  	//add the time to the array to make it a full even measure count
  			scoreBeets.push(sumRound);
  		}
  	//	return scoreBeets;
  	}
  	return scoreBeets;
};

function makeBeats () {
	var len = getRandomInt(1,6);
	var noteLen = notes.length -1;
	var durLen = durations.length -1 ;
	var beatLen = beats.length -1;
	var beatArray = [];

	for (var i = 0; i < 4; i++) {
		
		var firstNumber = i;
		var prevEntry = 0;
		var note = notes[ getRandomInt(0,noteLen) ];
		
		for (var j = 0; j < len; j++){
			var beat;
			//if first beat grab a single beat
			if (j == 0){ 
				beat = beats[ getRandomInt( 0,beatLen ) ]; 
			}
			//otherwise add the beats together until they get to 4
			else if (j > 0) {
				beat = beats[ getRandomInt( 0,beatLen ) ] + prevEntry;
					
			}

			if (beat >= 4) { break; }

			var beatEntry = [];
			
			
			
			
			var duration = durations[ getRandomInt(0, durLen) ];

			console.log(" " + note + " " + duration);
			prevEntry = beat;

			beatEntry.push( firstNumber.toString() + ":" + beat.toString() );
			beatEntry.push( note );
			beatEntry.push( duration );

			beatArray.push( beatEntry )
			console.log(beatEntry + " . beatEntry")
		}
	}

	return beatArray;
}

var kickTimes = makeBeats();
var Score = {
	"Kick" : [
		"0:0", "0:2", "1:0", "1:2",
		"2:0", "2:2", "3:0", "3:2"
	],
	// "Piano" : [
	// 	kickTimes[0][0], kickTimes[1][0],
	// 	"1:0", "1:2",
	// 	"2:0", "2:2",
	// 	"3:0", "3:2"
	// ],
	//additional arguments to the array format are
	//passed back to the route's callback function
	"Bass" : 
		kickTimes
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