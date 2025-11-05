function setupUI(){
  select('#width').changed(resize);
  select('#height').changed(resize);

  const curInput = select('#currency_input');
  curInput.changed(()=>{
    IMGS = createCurrencyImages(curInput.value().trim());
  })



  select('#pixel_size_input').input(()=>{
    IMGS = createCurrencyImages(curInput.value().trim());
  })
  select('#text_size_input').input(()=>{
    IMGS = createCurrencyImages(curInput.value().trim());
  })

  select('#recordMp4Button').mousePressed(()=>{
    noLoop();
    redraw();
    recordMP4(30, 10);
  });

  select('#stopRecording').mousePressed( ()=> DURATION = 0 );
}

function resize(){
  W = select('#width').value();
  H = select('#height').value();
  resizeCanvas(W,H);
  reset();
}

function timestamp(){
  return new Date().toLocaleString('en-CA', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  }).replace(/[^\d]/g, '');
}