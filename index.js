
const CUR = ['$', '€', '£', '¥']
const grey = '#575757';
let font;
let COUNT = 0;
let activeAnimationFrame = null;
let tagline
const themes = {};

async function setup(){
  const cnv = createCanvas(1920, 1080);
  tagline = await loadImage('./styles/bmt-2.png')
  font = await loadFont('./styles/RobotoMono-VariableFont_wght.ttf');

  applyCurrentTheme();
  initSwitcher();
  cnv.mousePressed(applyCurrentTheme);
}


themes.drawCurrency = function (){
  background(0);
  
  const imgs = createCurrencyImages(CUR);
  activeAnimationFrame = requestAnimationFrame(()=>drawAscii(imgs, CUR, 0));
}

function drawAscii(images, strings, index){
  background(0)
  const cellH = 30;
  textSize(cellH/1.2);
  textFont(font, { fontVariationSettings: `wght ${600}`});
  const cellW = textWidth("W");
  const cols = floor(width/cellW);
  const rows = floor(height/cellH);
  fill(255);

  const img = images[index % images.length];
  const s = strings[index % strings.length];
  img.resize(cols,rows);
  for(let i = 0; i < cols; i++){
    for(let j = 0; j < rows; j++){
      const x = i*cellW;
      let val = abs(COUNT*0.05-PI/2)/(PI/2);
      val = pow(val,1.2);
      const y = j*cellH + tan(PI/4 + COUNT*0.05+noise(i,j)*val)*20;
      if(brightness(img.get(i,j)) > 99) text(s, x, y);
    }
  }
  // image(tagline,0,0,width,height)

  COUNT+= (cos(COUNT*0.5)+1)/2+0.5;
  if(COUNT*0.05 > PI) {
    COUNT = 0;
    index++;
  }
  activeAnimationFrame = requestAnimationFrame(()=>drawAscii(images, strings, index))
}

function createCurrencyImages(strings){
  const imgs = [];
  const pg = createGraphics(width,height);
  pg.pixelDensity(1);
  pg.textFont(font, { fontVariationSettings: `wght ${600}`});
  pg.fill(255);
  pg.textSize(880);
  pg.textAlign(CENTER,CENTER);
  for(let s of strings){
    pg.clear();
    pg.text(s,width*0.28,height*0.56);
    imgs.push(pg.get());
  }
  pg.remove();
  return imgs;
}

themes.drawCoins = function (){
  

  const cols = floor(random(5,12));
  const colW = (width - (cols+1)*10) / cols;
  let h = constrain(100 - 9 * cols, 20, 50);
  const maxRows = floor(height / (h*1.2));
  fill("#F2F2F2");
  textSize(h);
  textFont(font, { fontVariationSettings: `wght ${800}`});
  const lettersNum = colW / (textWidth("W"));

  const rows = []
  const txt = []
  const pos = []
  for(let i = 0; i < cols; i++){
    const rowN = floor(random(5,maxRows))
    rows.push(rowN);
    txt.push(random(CUR))
    const posCol = []
    for(let j = 0; j < rowN; j++){
      const posRow = []
      for(let k = 0; k < lettersNum; k++){
        posRow.push(random(-height*2, -height*100))
      }
      posCol.push(posRow)
    }
    pos.push(posCol)
  }

  const params = { rows, txt, pos }
  let v = 0;
  render(COUNT);
  
  function render(){
    const speed = 0.01;
    background(0);
    for (let col = 0; col < cols; col++) {
      
      let y = height-10;//+ tan(PI/4 + COUNT*0.05+noise(i,j)*2)*20
      const rows = params.rows[col];
      const txt = params.txt[col];
  
      for(let j=0; j < rows; j++){
        const xStart = 10*(col+1) + colW*col;
        let x = xStart;
        const step = TWO_PI / lettersNum;
  
        for (let i = 0; i < lettersNum; i++) {
          if(x+textWidth("W") >= xStart + colW) break;
          const wght = 100 + floor((sin(i*step+PI/4)+1)*0.5*800);
          textFont(font, { fontVariationSettings: `wght ${wght}`});
          params.pos[col][j][i] = lerp(params.pos[col][j][i], y, 0.1)
          text(txt, x,params.pos[col][j][i]);
          x += textWidth("W");
        }
        y -= h*1.2;
      }
    }
    COUNT ++;
    if(COUNT*speed <= 1) {
      requestAnimationFrame(()=>render(COUNT))
    }
  }
  
}

















// Theme handling
function applyTheme(themeKey){
  // Stop any active animations
  if(activeAnimationFrame !== null){
    cancelAnimationFrame(activeAnimationFrame);
    activeAnimationFrame = null;
  }
  const theme = themes[themeKey];
  theme();
  return theme;
}

function getActiveThemeKey(){
  const checked = document.querySelector('input[name="theme"]:checked');
  return checked ? checked.value : 'drawCoins';
}

function applyCurrentTheme(){
  applyTheme(getActiveThemeKey());
}

function initSwitcher() {
  document.getElementById('switch_container').addEventListener('change', (e) => {
    const target = e && e.target ? e.target : null;
    if (target && target.matches && target.matches('input[name="theme"]')) {
      applyTheme(target.value);
    }
  });
}