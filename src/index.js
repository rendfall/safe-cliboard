let $test = document.getElementById('test');
let $sample = document.getElementById('sample');

function compare(c1, c2) {
    let img1 = c1.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let img2 = c2.toDataURL("image/png").replace("image/png", "image/octet-stream");

    return new Rembrandt({
        imageA: img1,
        imageB: img2,
        thresholdType: Rembrandt.THRESHOLD_PERCENT,

        // The maximum threshold (0...1 for THRESHOLD_PERCENT, pixel count for THRESHOLD_PIXELS
        maxThreshold: 0.20,

        // Maximum color delta (0...255):
        maxDelta: 255,

        // Maximum surrounding pixel offset
        maxOffset: 0
    }).compare();
}

document.addEventListener('copy', (evt) => {
    let content = window.getSelection().toString();
    $test.innerHTML = content;

    Promise.all([
        html2canvas($sample),
        html2canvas($test)
    ]).then(all => {
        let [c1, c2] = all;

        document.body.innerHTML = '';
        document.body.appendChild(c1);
        document.body.appendChild(c2);

        compare(c1, c2)
            .then(result => {
                console.log('Passed:', result.passed);
                console.log('Difference:', (result.threshold * 100).toFixed(2), '%');
                
                if (!result.passed) {
                    alert(' Watch out! Suspicous content!');
                }
            })
            .catch(e => {
                console.error(e)
            });
    });
});
