var notes = [["C2", "D#3", "D3", "C2", "G3", "A#3"], ["D#2", "D3", "F2", "G#3", "D3", "F3"]];
var position = 0;
var ticker = 0;


var crusher = new Tone.BitCrusher(8).toMaster();
// var delay = new Tone.FeedbackDelay(0.5); 
// delay.wet.value = .5;
var reverb = new Tone.FeedbackDelay("6t", .25).connect(crusher);
reverb.set("feedback", .5);





var synth = new Tone.PolySynth(10,Tone.Monosynth).chain(reverb);

// synth.set({
// 		"vibratoAmount" : 0.5,
// 		"vibratoRate" : .4,
// 		"portamento" : .1,
// 		"harmonicity" : 2,
// 		"volume" : 2,
// 		"envelope" : {
// 			"attack" : 0.26,
// 			"decay" : .25
// 		}
// 	});

synth.set({
					"portamento": 0.086,
					
					"envelope": {
						"attack": 0.13,
						"decay": 0.12,
						"sustain": 0.35,
						"release": 0.098
					},
					"filterEnvelope": {
						"attack": 0.58,
						"decay": 0.122,
						"sustain": 0.151,
						"release": 0.49,
						"min": 3500,
						"max": 960
					},
					"filter": {
						"Q": 1.6
					}
				}
			);

Tone.Transport.setInterval(function(time){
	

    var note = notes[1][position++];
    position = position % notes[0].length;
    synth.triggerAttackRelease(note, 0.25, time);
}, 0.25);
Tone.Transport.bpm.value = 57;
Tone.Transport.swing.value = 1;
Tone.Transport.swingSubdivision.value = "8n";
Tone.Transport.timeSignature = 4;
//the transport won't start firing events until it's started
Tone.Transport.start();