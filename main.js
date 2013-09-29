require.config({
    paths: {
        jquery: '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min'
    }
});

require(['jquery', 'analysis', 'visualizer'], function(jquery, analysis, visualizer) {
    $(document).ready(function() {
        window.AudioContext = window.AudioContext||window.webkitAudioContext;

        var audioContext = new AudioContext(),
            javascriptNode = audioContext.createScriptProcessor(4096, 1, 1),
            highPassFilter = audioContext.createBiquadFilter(),
            lowPassFilter = audioContext.createBiquadFilter();
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
            javascriptNode.onaudioprocess = function (audioEvent) { analysis.processAudioEvent(audioEvent);};
            javascriptNode.connect(audioContext.destination);
        }

        function setUpFilters() {
            highPassFilter.type = "highpass";
            highPassFilter.gain = 20;
            highPassFilter.frequency = 20;
            lowPassFilter.type = "lowpass";
            lowPassFilter.gain = 20;
            lowPassFilter.frequency = 4000;
        }
    });
});