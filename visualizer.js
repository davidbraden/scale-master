$(document).ready(function() {
	window.AudioContext = window.AudioContext||window.webkitAudioContext;	
	
	var canvas1 = document.getElementById('visualizerCanvas1')
	    canvas2 = document.getElementById('visualizerCanvas2'),
		audioContext = new AudioContext(),
		javascriptNode = audioContext.createScriptProcessor(4096, 1, 1),
		highPassFilter = audioContext.createBiquadFilter(),
		lowPassFilter = audioContext.createBiquadFilter();
	var fft = new FFT(4096, 44100);
	
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
		highPassFilter.connect(javascriptNode);
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

	function analyseData(audioEvent) {
		var timeData = audioEvent.inputBuffer.getChannelData(0);
		fft.forward(timeData);
		var frequencyData = fft.spectrum;
		drawWave(timeData);
		drawSpectrum(frequencyData);
		var parsedData = parseData(frequencyData);
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
       draw(canvas1, 0.2, 4, wave);
    };
    
    function drawSpectrum(wave) {
        draw(canvas2, 1, 32, wave);
    };
    
    
    function draw(canvas, horizontalScaling, verticalScaling, wave) {
        var ctx  = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var grad= ctx.createLinearGradient(0, 200, 0, 0);
        grad.addColorStop(0, "yellow");
        grad.addColorStop(1, "red");
        ctx.strokeStyle = grad;
    	ctx.clearRect(0, 0, canvas.width, canvas.height);
    	var time = 0;
    	for (var i = 0; i < wave.length; i++) {
    		ctx.beginPath();
    		ctx.moveTo(time, 200);
    		ctx.lineTo(time, 150 - (wave[i] * canvas.height*verticalScaling));
    		ctx.stroke();
	    	ctx.closePath();	
    		time = time + horizontalScaling;
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
