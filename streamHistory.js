define(function() {
    var currentSample = 0;
    var note = {
        timeSamples : [],
        frequency : null,
        getWave : function() {
            var wave = new Float32Array(4096 * this.timeSamples.length);
            for (var i = 0; i < this.timeSamples.length; i ++) {
                wave.set(this.timeSamples[i], i * 4096);
            }
            return wave;
        }
    };
    var previousBuffer = new Float32Array(4096);

    return {
        updateHistory : function(buffer) {
            currentSample++;
            previousBuffer = buffer} ,
        getSampleCount : currentSample,
        getTime : currentSample * 4096 / 48,
        note : note,
        previousBuffer : previousBuffer
    }
});
