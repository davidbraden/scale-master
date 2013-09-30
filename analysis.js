define(['visualizer', 'dsp', 'streamHistory'], function(visualizer,dsp, streamHistory) {
    var fft = new FFT(4096, 44100);

    function processAudioEvent(audioEvent) {
        var timeData = audioEvent.inputBuffer.getChannelData(0);
        fft.forward(timeData);
        var frequencyData = fft.spectrum;

        streamHistory.updateHistory(timeData);
        updateNote(timeData, frequencyData);
        if (streamHistory.note.timeSamples.length  > 0) {
            visualizer.drawNote(streamHistory.note);
        }

        visualizer.drawWave(timeData);
        visualizer.drawSpectrum(frequencyData);
    }

    function updateNote(timeData, frequencyData) {
        var average = getAverage(timeData);
        var previousAverage = getAverage(streamHistory.previousBuffer);


        if (average < 0.003) {
            streamHistory.note.timeSamples = [];

        } else if (average > previousAverage) {
            streamHistory.note.timeSamples = [timeData];
            setPitch(frequencyData);
        } else {
            streamHistory.note.timeSamples.push(timeData);
            updatePitch(frequencyData);
        }
    }

    function setPitch(frequencyData) {
        var peakFrequency = getPeak(frequencyData);
        streamHistory.note.pitch = peakFrequency;
    }

    function updatePitch(frequencyData) {
        var peakFrequency = getPeak(frequencyData);
        if (!streamHistory.note.pitch
            || (streamHistory.note.pitch && peakFrequency.amplitude > streamHistory.note.pitch.amplitude)) {
            streamHistory.note.pitch = peakFrequency;
        }
    }

    function getAverage(array) {
        var sum = 0;
        for (var i=0; i < array.length; i++) {
            sum += Math.abs(array[i]);
        }
        return sum / array.length;
    }

    function getPeak(array) {
        var max = 0;
        var index;
        for (var i=0; i < array.length; i++) {
            if (array[i] > max) {
                max = array[i];
                index = i;
            }
        }
        return {frequency : index * 48000 / 4096, amplitude :max};
    }

    return {
        processAudioEvent : processAudioEvent
    }
});