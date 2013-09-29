define(['visualizer', 'dsp', 'streamHistory'], function(visualizer,dsp, streamHistory) {
    var fft = new FFT(4096, 44100);

    function processAudioEvent(audioEvent) {
        var timeData = audioEvent.inputBuffer.getChannelData(0);
        fft.forward(timeData);
        var frequencyData = fft.spectrum;

        streamHistory.updateHistory(timeData);
        updateNote(timeData, frequencyData);
        if (streamHistory.note.timeSamples.length  > 0) {
            visualizer.drawNote(streamHistory.note.getWave());
        }

        visualizer.drawWave(timeData);
        visualizer.drawSpectrum(frequencyData);
    }

    function updateNote(timeData, frequencyData) {
        var average = getAverage(timeData);
        var previousAverage = getAverage(streamHistory.previousBuffer);
        if (average < 0.002) {
            streamHistory.note.timeSamples = [];

        } else if (average > previousAverage) {
            console.log('note data added');
            streamHistory.note.timeSamples = [timeData];
        } else {
            console.log('note data added');
            streamHistory.note.timeSamples.push(timeData);
        }
    }

    function getAverage(array) {
        var sum = 0;
        for (var i=0; i < array.length; i++) {
            sum += Math.abs(array[i]);
        }
        return sum / array.length;
    }

    return {
        processAudioEvent : processAudioEvent
    }
});