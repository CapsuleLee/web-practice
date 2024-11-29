
function loadTexture(path) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        resolve(img);
      };
    })
}

function createEnemies(ctx, canvas, enemyImg) {
    const MONSTER_TOTAL = 5;
    const MONSTER_WIDTH = MONSTER_TOTAL * enemyImg.width;
    const START_X = (canvas.width - MONSTER_WIDTH) / 2;
    const STOP_X = START_X + MONSTER_WIDTH;
    for (let x = START_X; x < STOP_X; x += enemyImg.width) {
      for (let y = 0; y < enemyImg.height * 5; y += enemyImg.height) {
        ctx.drawImage(enemyImg, x, y);
      }
    }
}

function createEnemies2(ctx, canvas, enemyImg) {
    const MONSTER_ROWS = 5;
    const MONSTER_START_Y = 50;

    for (let row = 0; row < MONSTER_ROWS; row++) {
        const MONSTERS_IN_ROW = MONSTER_ROWS - row; // 줄마다 적군 수 감소
        const MONSTER_WIDTH = MONSTERS_IN_ROW * enemyImg.width;
        const START_X = (canvas.width - MONSTER_WIDTH) / 2; // 줄마다 중앙 정렬

        for (let col = 0; col < MONSTERS_IN_ROW; col++) {
            const x = START_X + col * enemyImg.width;
            const y = MONSTER_START_Y + row * enemyImg.height;
            ctx.drawImage(enemyImg, x, y);
        }
    }
}

window.onload = async() => {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    const heroImg = await loadTexture('assets/player.png')
    const enemyImg = await loadTexture('assets/enemyShip.png')
    const starImg = await loadTexture('assets/starBackground.png'); // 별 이미지 텍스처
    const pattern = ctx.createPattern(starImg, 'repeat');

    const smallWidth = heroImg.width * 0.6;
    const smallHeight = heroImg.height * 0.6;
    ctx.fillStyle = pattern;
    
    
    ctx.fillRect(0,0, canvas.width, canvas.height);
    ctx.drawImage(heroImg, canvas.width/2 - 45, canvas.height - (canvas.height 
  /4));
    ctx.drawImage(heroImg, canvas.width/2 - 45-60, canvas.height - (canvas.height 
    /4)+30,smallWidth,smallHeight);
    ctx.drawImage(heroImg, canvas.width/2 - 45+100, canvas.height - (canvas.height 
        /4)+30,smallWidth,smallHeight);

    createEnemies2(ctx, canvas, enemyImg);
};



