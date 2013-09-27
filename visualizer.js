$(document).ready(function() {
	window.AudioContext = window.AudioContext||window.webkitAudioContext;	
	
	var canvas = document.getElementById('visualizerCanvas'),
		audioContext = new AudioContext(),
		analyser = audioContext.createAnalyser(),
		javascriptNode = audioContext.createScriptProcessor(4096, 1, 1),
		highPassFilter = audioContext.createBiquadFilter(),
		lowPassFilter = audioContext.createBiquadFilter();
	var ctx  = canvas.getContext('2d');
	
	var previousAverage = 0;
	
	setUpFilters();
	navigator.getMedia = (navigator.getUserMedia||navigator.webkitGetUserMedia);	
	navigator.getMedia (
			   {audio: true},
			   linkAudioNodes,
			   function(err) {
			    console.log("The following error occured: " + err);
			   }
			);


	function linkAudioNodes(localMediaStream) {
		var source = audioContext.createMediaStreamSource(localMediaStream);
		source.connect(lowPassFilter);
		lowPassFilter.connect(highPassFilter);
		highPassFilter.connect(analyser);
		analyser.connect(javascriptNode);
		javascriptNode.onaudioprocess = analyseData;
		javascriptNode.connect(audioContext.destination);
	};
	
	function setUpFilters() {
		highPassFilter.type = "highpass";
		highPassFilter.gain = 20;
		highPassFilter.frequency = 20;
		lowPassFilter.type = "lowpass";
		lowPassFilter.gain = 20;
		lowPassFilter.frequency = 4000;
	}

	function getData() {
		var array = new Uint8Array(8192);
		analyser.smoothingTimeConstant = 0.1;
        analyser.fftSize = 2048;
        analyser.minDecibels = -70;
        analyser.maxDecibels = -30;
		analyser.getByteFrequencyData(array);
		return array;
	}
	
	function analyseData() {
		var data = getData();
		drawWave(data);
		var parsedData = parseData(data);
		parsedData.sort(function(a, b) { return b['amplitude'] - a['amplitude']; });
		
		var average = getAverage(parsedData);
		if (average >= previousAverage) {
			console.log("New core frequency : " + parsedData[0].frequency);
			previousAverage = average;
		}
		
		
		
	}
	
	function parseData(data) {
		var parsedData = [];
		for (var i = 0; i < data.length;  i++) {
			parsedData.push( { 'frequency' : i, 'amplitude' : data[i]});
		}
		return parsedData;
	}

    function drawWave(wave) {
    	ctx.clearRect(0, 0, canvas.width, canvas.height);
    	var time = 0;
    	for (var i = 0; i < wave.length; i++) {
    		ctx.beginPath();
    		ctx.moveTo(time, 0);
    		ctx.lineTo(time, wave[i] * canvas.height/255) ;
    		ctx.stroke();
	    	ctx.closePath();	
    		time = time + 10;
    	};
    };

    function getAverage(array) {
    	var sum = 0;
    	array.forEach(function(element) {
    		sum += element['amplitude'];
    	});   	
    	return sum / array.length;
    }
});
