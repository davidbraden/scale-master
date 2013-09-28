define(function() {

    var canvas1 = document.getElementById('visualizerCanvas1');
    var canvas2 = document.getElementById('visualizerCanvas2');

    function drawWave(wave) {
        draw(canvas1, 0.25, 4, wave);
    }

    function drawSpectrum(wave) {
        draw(canvas2, 4, 32, wave);
    }


    function draw(canvas, horizontalScaling, verticalScaling, wave) {
        var ctx  = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var grad= ctx.createLinearGradient(0, 256, 0, 0);
        grad.addColorStop(0, "yellow");
        grad.addColorStop(1, "red");
        ctx.strokeStyle = grad;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var time = 0;
        for (var i = 0; i < wave.length; i++) {
            ctx.beginPath();
            ctx.moveTo(time, 256);
            ctx.lineTo(time, 256 - (wave[i] * canvas.height*verticalScaling));
            ctx.stroke();
            ctx.closePath();
            time = time + horizontalScaling;
        }
    }

    return {
        drawWave : drawWave,
        drawSpectrum : drawSpectrum
    }
});
