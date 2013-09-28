define(['visualizer', 'dsp'], function(visualizer) {
    var fft = new FFT(4096, 44100);

    var previousAverage = 0;

    function analyseData(audioEvent) {
        var timeData = audioEvent.inputBuffer.getChannelData(0);
        fft.forward(timeData);
        var frequencyData = fft.spectrum;
        visualizer.drawWave(timeData);
        visualizer.drawSpectrum(frequencyData);
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

    function getAverage(array) {
        var sum = 0;
        array.forEach(function(element) {
            sum += element['amplitude'];
        });
        return sum / array.length;
    }

    return {
        analyseData : analyseData
    }
});