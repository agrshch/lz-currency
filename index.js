const ANIMATION_SHIFT = 5;
let COUNT = ANIMATION_SHIFT, 
    INDEX = 0;
let LOADED, IMGS, SPEED;
let font;
const white = '#F2F2F2';

let X, Y;
let DRAGGED = false;
let W,H;


async function setup(){
  setupUI();
  W = select('#width').value();
  H = select('#height').value();

  const cnv = createCanvas(W, H);
  cnv.parent(select('body'))
  cnv.elt.addEventListener('mousedown', (e) => { DRAGGED = true; cnv.elt.style.cursor = 'grabbing' });
  cnv.elt.addEventListener('mousemove', (e) => { if(DRAGGED) moveXY(); });
  cnv.elt.addEventListener('dblclick', reset);
  document.body.addEventListener('mouseup', (e) => { DRAGGED = false; cnv.elt.style.cursor = 'grab'});

  X = width*0.5;
  Y = height*0.56;

  font = await loadFont('./styles/RobotoMono-VariableFont_wght.ttf');
  LOADED = true;

  let currencies = select('#currency_input').value().trim();
  IMGS = createCurrencyImages(currencies);
  frameRate(30)
}

function draw(){
  background('#0A0A0A')
  if(!LOADED)return;

  SPEED = PI*0.03*select('#animation_speed_input').value();

  let currencies = select('#currency_input').value().trim();
  if(!currencies || currencies === '') return;
  drawAscii(IMGS, currencies, INDEX);

  COUNT+= (cos(COUNT*SPEED)+1)/2+0.5;
  if(COUNT*SPEED >= PI) {
    COUNT = ANIMATION_SHIFT;
    INDEX++;
  }
}


function drawAscii(images, strings, index){
  
  const cellH = select('#pixel_size_input').value();
  textSize(cellH/1.2);
  textFont(font, { fontVariationSettings: `wght ${600}`});
  const cellW = cellH*0.5;
  const cols = floor(width/cellW);
  const rows = floor(height/cellH);
  fill(white);

  const img = images[index % images.length];
  const s = strings[index % strings.length];
  img.resize(cols,rows);
  for(let i = 0; i < cols; i++){
    for(let j = 0; j < rows; j++){
      const x = i*cellW;
      let shiftScale = abs(COUNT*SPEED-PI/2)/(PI/2);
      const shift = (noise(i,j)*PI/4) * shiftScale;
      const y = j*cellH + tan(PI/4 + COUNT*SPEED+shift)*20;
      if(brightness(img.get(i,j)) > 99) text(s, x, y);
    }
  }
}

function createCurrencyImages(strings){
  const imgs = [];
  const pg = createGraphics(width,height);
  pg.pixelDensity(1);
  pg.textFont(font, { fontVariationSettings: `wght ${600}`});
  pg.fill(255);
  const txtSize = select('#text_size_input').value();
  pg.textSize(txtSize);
  pg.textAlign(CENTER,CENTER);
  for(let s of strings){
    pg.clear();
    pg.text(s,X,Y);
    imgs.push(pg.get());
  }
  pg.remove();
  return imgs;
}


function keyPressed() {
  if (!cnvIsSelected()) return;
  if(key === 'h' || key === 'H') {
    selectAll('#settings *:not(h1)').forEach(element => {
      element.toggleClass('totally_hidden');
    });
  }
}

function moveXY(){
  X += mouseX-pmouseX;
  Y += mouseY-pmouseY;
  let currencies = select('#currency_input').value().trim();
  IMGS = createCurrencyImages(currencies);
}




function reset(){
  X = width*0.5;
  Y = height*0.56;
  let currencies = select('#currency_input').value().trim();
  IMGS = createCurrencyImages(currencies);
}


function cnvIsSelected(){
  return !document.activeElement || 
          document.activeElement === document.body || 
          document.activeElement.tagName === 'CANVAS'
          ;
}

