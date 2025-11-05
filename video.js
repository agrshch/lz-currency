let DURATION = 0;

function recordMP4(fps,duration) {

  const beginRecord = select('#recordMp4Button');
  const recording = select('#recording');
  const endRecord = select('#stopRecording');
  const progressbar = select('#progress')

  const ctx = select('#defaultCanvas0').elt.getContext("2d", { willReadFrequently: true });
  let prevPixDens = pixelDensity();
  pixelDensity(1);
  

  beginRecord.addClass('hidden');
  recording.removeClass('hidden');
  endRecord.removeClass('hidden');

  DURATION = fps*duration;
  COUNT = ANIMATION_SHIFT;
  INDEX = 0;
  redraw();
  
  HME.createH264MP4Encoder().then(async encoder => {
    encoder.outputFilename = `better_money_technology_${timestamp()}`;
    encoder.width = parseInt(width);
    encoder.height = parseInt(height);
    encoder.frameRate = fps;
    encoder.kbps = 50000; // video quality
    encoder.groupOfPictures = 2; // lower if you have fast actions.
    encoder.initialize()


    for (let i = 0; i < DURATION; i++) {
      progressbar.style('width', `${i / DURATION *100}%`);
      redraw();
      await new Promise(requestAnimationFrame);
      const imageData = ctx.getImageData(0, 0, encoder.width, encoder.height).data;
      encoder.addFrameRgba(imageData);
    }


    encoder.finalize()
    
    const uint8Array = encoder.FS.readFile(encoder.outputFilename);
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(new Blob([uint8Array], { type: 'video/mp4' }));
    anchor.download = encoder.outputFilename;
    anchor.click();
    
    encoder.delete();
    pixelDensity(prevPixDens);
    DURATION = 0;

    selectAll('.hide_during_record').forEach(element => {
      element.style('display', 'flex');
    });

    loop();

    beginRecord.removeClass('hidden');
    recording.addClass('hidden');
    endRecord.addClass('hidden');
  })
}