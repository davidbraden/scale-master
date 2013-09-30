define(function() {

    var canvas1 = document.getElementById('visualizerCanvas1');
    var canvas2 = document.getElementById('visualizerCanvas2');
    var canvas3 = document.getElementById('visualizerCanvas3');
    var noteFrequency = document.getElementById('noteFrequency');

    function drawWave(wave) {
        var ctx = setUpCanvas(canvas1);
        draw(ctx, 1, 1024, wave);
    }

    function drawSpectrum(wave) {
        var ctx = setUpCanvas(canvas2);
        var time = 0;
        for (var i = 0; i < wave.length; i++) {
            ctx.beginPath();
            ctx.moveTo(time, 256);
            ctx.lineTo(time, 256 - (wave[i] * 1024*32));
            ctx.stroke();
            ctx.closePath();
            time = time + 4;
        }
    }

    function drawNote(note) {
        while( noteFrequency.firstChild ) {
            noteFrequency.removeChild( noteFrequency.firstChild );
        }
        noteFrequency.appendChild( document.createTextNode(note.pitch.frequency + ' Hz'));

        var wave = note.getWave();

        var ctx = setUpCanvas(canvas3);
        var x = 1024/wave.length;
        var y = 256;
        var time = 0;
        draw(ctx, x, y, wave);
    }

    function draw(ctx, x, y, wave) {
        var time = 0;
        for (var i = 0; i < wave.length; i++) {
            ctx.beginPath();
            ctx.moveTo(time, 128 + (y * wave[i]));
            ctx.lineTo(time, 128 -  (y * wave[i]));
            ctx.stroke();
            ctx.closePath();
            time = time + x;
        }
    }

    function setUpCanvas(canvas) {
        var ctx  = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var grad= ctx.createLinearGradient(0, 256, 0, 0);
        grad.addColorStop(0, "yellow");
        grad.addColorStop(1, "red");
        ctx.strokeStyle = grad;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return ctx;
    }

    return {
        drawWave : drawWave,
        drawSpectrum : drawSpectrum,
        drawNote : drawNote
    }
});
