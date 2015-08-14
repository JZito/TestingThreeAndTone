var hi, ranNotes = [12,11,9,7,5,4,2,0,-1], 
beets = [1, 1/1.5, , , , 1/2, 1/2, 1/3, 1/3,1/6, 1/4, 1/4, 1/4,1/8, 1/8,1/8,1/16, 1/16, 1/32],
ticker = 0, a, b, bus;

function setup () {
	createCanvas(windowWidth, windowHeight);
	Clock.bpm(67);
	PlaySomeNotes();
}

function draw () {
	ellipse(width/2, height/2, 50, 50);
}

setInterval(function() {
    // your code goes here...
    PlaySomeNotes();
    ticker++;
    console.log(ticker);
}, 30 * 1000);

 function WholeBeetsReturn (mul, len) {
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

function MelodyReturn (oct, lowRange, highRange) {
		var scoreNotes = [], lastNumber;
	for (var i = 0; i < floor(random(lowRange,highRange)); i++) {
		lastPos = 0;
		var coin = Math.round(Math.random()*2);
		if (coin == 1) {
			var uOrD = [-1,0,1];
			if (ranNotes[lastPos + uOrD]){
				scoreNotes[i] = ranNotes[lastPos + uOrD];
			}
			else {
				scoreNotes[i] = ranNotes[floor(random(ranNotes.length))] + oct;
			}
			lastPos = i;
		}
		else {
  			scoreNotes[i] = ranNotes[floor(random(0,ranNotes.length))] + oct;
  			lastPos = i;
  		}
	}
	return scoreNotes;
};

function PlaySomeNotes() {
	var ranLength = floor(random(1,3));
	a = Synth('cascade');
	b = FM('glockenspiel');
	bus = Bus().fx.add (Delay(1/6,.95 ), Reverb('large'))
	a._;
	b._;
	a.connect(bus);
	b.connect(bus);


	// aSong = Seq( function() { 
	// 	//have a count to determine how many synth gets switched and 
	// 	//which doesn't, not just length of array
	// 	//
	// 	// array of objects to change, objects to stop and objcts to leave alone?
		
	// 	//ticker++;
	// //console.log( count + " count " + randomCount) 
	// }, 32 ) // every one measures

	score = Score([0,
		function(){
			bR = WholeBeetsReturn(1, floor(random(3,12)));
			nR = MelodyReturn(12, bR.length, bR.length);
			bR2 = WholeBeetsReturn(1, floor(random(3,12)));
			nR2 = MelodyReturn(12, bR.length, bR.length);
			a.note.seq(nR2, bR2)
			b.note.seq(nR, bR)
		}, measures(ranLength),
		function (){
			a.note.seq.stop();
			b.note.seq.stop();
			q = LPF();
		}, measures (48)]).start();
}

function add(a, b) {
 	return a + b;
}

//PlaySomeNotes();