
class EventEmitter {
  constructor() {
    this.listeners = {};
  }
  on(message, listener) {
    if (!this.listeners[message]) {
      this.listeners[message] = [];
    }
  this.listeners[message].push(listener);
  }
  emit(message, payload = null) {
      if (this.listeners[message]) {
        this.listeners[message].forEach((l) => l(message, payload));
      }
    }
  }
 


class GameObject {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dead = false;     // 객체가 파괴되었는지 여부
        this.type = "";        // 객체 타입 (영웅/적)
        this.width = 0;        // 객체의 폭
        this.height = 0;       // 객체의 높이
        this.img = undefined;  // 객체의 이미지
    }
    rectFromGameObject() {
      return {
        top: this.y,
        left: this.x,
        bottom: this.y + this.height,
        right: this.x + this.width,
      };
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height); 
// 캔버스에 이미지 그리기
  }
 }

class Hero extends GameObject {
    constructor(x, y) {
      super(x,y);
      this.width = 99;
      this.height = 75;
      this.type = 'Hero';
      this.cooldown = 0; // 초기화
      }
    
    fire() {
      if (this.canFire()) {
        gameObjects.push(new Laser(this.x + 45, this.y - 10)); // 레이저 발사
        this.cooldown = 500; // 쿨다운 500ms
        let id = setInterval(() => {
          if (this.cooldown > 0) {
            this.cooldown -= 100;
          } else {
            clearInterval(id);
          }
        }, 100);
      }
    }
    canFire() {
      return this.cooldown === 0; // 쿨다운이 끝났는지 확인
    }
  }

class Enemy extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 98;
        this.height = 50;
        this.type = "Enemy";
      
  // 적 캐릭터의 자동 이동 (Y축 방향)
      let id = setInterval(() => {
        if (this.y < canvas.height - this.height) {
            this.y += 5;  // 아래로 이동
        } else {
            console.log('Stopped at', this.y);
            clearInterval(id); // 화면 끝에 도달하면 정지
        }
      }, 300);
    }
   }
  
 
class Laser extends GameObject {
    constructor(x, y) {
        super(x,y);
        (this.width = 9), (this.height = 33);
        this.type = 'Laser';
        this.img = laserImg;
        let id = setInterval(() => {
            if (this.y > 0) {
                this.y -= 15;
            } else {
                this.dead = true;
                clearInterval(id);
            }
        }, 100)
    }
}
  

class Explosion extends GameObject {
    constructor(x, y) {
      super(x, y);
      this.width = 100; // 충돌 이미지의 폭
      this.height = 100; // 충돌 이미지의 높이
      this.type = "Explosion";
      this.img = collisionImg; // 충돌 이미지
      this.lifeTime = 500; // 500ms 동안 유지
      setTimeout(() => (this.dead = true), this.lifeTime); // 일정 시간 후 제거
    }
}

class SidekickHero extends GameObject {
  constructor(x, y, type) {
      super(x, y);
      this.width = 60;
      this.height = 45;
      this.type = type;
      this.cooldown = 0; // 쿨다운 초기화
      this.img = heroImg; // 히어로 이미지 사용
      this.autoAttackInterval = 1000; // 자동 공격 간격 (ms)
      this.initAutoAttack();
      
  }

  canFire() {
      return this.cooldown === 0;
  }

  fire() {
      if (this.canFire()) {
          gameObjects.push(new Laser(this.x + 25, this.y - 10));
          this.cooldown = 500;
          let id = setInterval(() => {
              if (this.cooldown > 0) {
                  this.cooldown -= 100;
              } else {
                  clearInterval(id);
              }
          }, 100);
      }
  }

  initAutoAttack() {
      setInterval(() => {
          if (!this.dead) {
              this.fire();
          }
      }, this.autoAttackInterval);
  }
  // 주인공 비행선과 함께 움직이도록 설정
  followHeroRight(hero) {
    this.x = hero.x + 110;  // 주인공 비행선의 x 좌표 + 70 (왼쪽)
    this.y = hero.y + 30;  // 주인공 비행선의 y 좌표 + 30 (아래쪽)
}
  followHeroLeft(hero) {
    this.x = hero.x - 70;  // 주인공 비행선의 x 좌표 + 70 (왼쪽)
    this.y = hero.y + 30;  // 주인공 비행선의 y 좌표 + 30 (아래쪽)
}
}



function loadTexture(path) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
          resolve(img);
      };
    })
}

// function createEnemies(ctx, canvas, enemyImg) { week11 주차꺼
    // const MONSTER_TOTAL = 5;
    // const MONSTER_WIDTH = MONSTER_TOTAL * enemyImg.width;
    // const START_X = (canvas.width - MONSTER_WIDTH) / 2;
    // const STOP_X = START_X + MONSTER_WIDTH;
    // for (let x = START_X; x < STOP_X; x += enemyImg.width) {
    //   for (let y = 0; y < enemyImg.height * 5; y += enemyImg.height) {
    //     ctx.drawImage(enemyImg, x, y);
    //   }
    // }
    
// }

function createEnemies() { //week13주차꺼
  const MONSTER_TOTAL = 5;
  const MONSTER_WIDTH = MONSTER_TOTAL * 98;
  const START_X = (canvas.width - MONSTER_WIDTH) / 2;
  const STOP_X = START_X + MONSTER_WIDTH;
  for (let x = START_X; x < STOP_X; x += 98) {
    for (let y = 0; y < 50 * 5; y += 50) {
      const enemy = new Enemy(x, y);
      enemy.img = enemyImg;
      gameObjects.push(enemy);
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
function drawGameObjects(ctx) {
    gameObjects.forEach(go => go.draw(ctx));

}

function createHero() {
  hero = new Hero(
      canvas.width / 2 - 45,
      canvas.height - canvas.height / 4
  );
  hero.img = heroImg;
  gameObjects.push(hero);

  // 보조 히어로 생성
  const sidekick1 = new SidekickHero(
    hero.x - 70, // 왼쪽에 위치
    hero.y + 30,  // 약간 아래
    "sidekick1"
  );
  const sidekick2 = new SidekickHero(
      hero.x + 110, // 오른쪽에 위치
      hero.y + 30,
      "sidekick2"
  );

  gameObjects.push(sidekick1, sidekick2);
 }




function initGame() {
    gameObjects = [];
    createEnemies();
    createHero();
    
    eventEmitter.on(Messages.KEY_EVENT_UP, () => {
        hero.y -=5 ;
        
    })
    eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
        hero.y += 5;
        
    });
    eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
        hero.x -= 5;
        
    });
    eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
        hero.x += 5;
      
    });
    eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
      if (hero.canFire()) {
        hero.fire();
      }
     });
    eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
      first.dead = true;
      second.dead = true;

      const explosion = new Explosion(second.x, second.y);
      gameObjects.push(explosion);      
    });
    
 }

function updateGameObjects() {
  const enemies = gameObjects.filter(go => go.type === 'Enemy');
  const lasers = gameObjects.filter((go) => go.type === "Laser");

  gameObjects.forEach(go => {
    if (go.type === 'sidekick1') {
        go.followHeroRight(hero);  // 각 보조 비행선은 주인공을 따라가게 됩니다.
        
    }
});
gameObjects.forEach(go => {
  if (go.type === 'sidekick2') {
      go.followHeroLeft(hero);
  }
});

  lasers.forEach((l) => {
    enemies.forEach((m) => {
      if (intersectRect(l.rectFromGameObject(), m.rectFromGameObject())) {
        eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, {
          first: l,
          second: m,
        });
      }
    });
  });
  // 죽은 객체 제거
  gameObjects = gameObjects.filter(go => !go.dead);
  
 }

function intersectRect(r1, r2) {
  return !(
    r2.left > r1.right ||  // r2가 r1의 오른쪽에 있음
    r2.right < r1.left ||  // r2가 r1의 왼쪽에 있음
    r2.top > r1.bottom ||  // r2가 r1의 아래에 있음
    r2.bottom < r1.top     // r2가 r1의 위에 있음
  );
 }


let onKeyDown = function (e) {
  console.log(e.keyCode);
    switch (e.keyCode) {
        case 37: // 왼쪽 화살표
        case 39: // 오른쪽 화살표
        case 38: // 위쪽 화살표
        case 40: // 아래쪽 화살표
        case 32: // 스페이스바
            e.preventDefault();
            break;
        default:
            break;
  }
  };
window.addEventListener('keydown', onKeyDown);

window.addEventListener("keyup", (evt) => {
    if (evt.key === "ArrowUp") {
        eventEmitter.emit(Messages.KEY_EVENT_UP);
    } else if (evt.key === "ArrowDown") {
        eventEmitter.emit(Messages.KEY_EVENT_DOWN);
    } else if (evt.key === "ArrowLeft") {
        eventEmitter.emit(Messages.KEY_EVENT_LEFT);
    } else if (evt.key === "ArrowRight") {
        eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
    } else if(evt.keyCode === 32) {
      eventEmitter.emit(Messages.KEY_EVENT_SPACE);
    }
 });


const Messages = {
    KEY_EVENT_UP: "KEY_EVENT_UP",
    KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
    KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
    KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
    KEY_EVENT_SPACE: "KEY_EVENT_SPACE",
    COLLISION_ENEMY_LASER: "COLLISION_ENEMY_LASER",
    COLLISION_ENEMY_HERO: "COLLISION_ENEMY_HERO",
 };
let heroImg, 
  enemyImg, 
  laserImg,
  canvas, ctx, 
  gameObjects = [], 
  hero, 
  eventEmitter = new EventEmitter();


let gameLoopId = setInterval(() => {
    // 화면 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // 게임 객체 그리기
    drawHero();            // 플레이어 캐릭터
    drawEnemies();         // 적들
    drawStaticObjects();   // 배경과 같은 정적인 요소
}, 200); // 200ms마다 실행



  

window.onload = async() => {
  //   const canvas = document.getElementById("myCanvas");
  //   const ctx = canvas.getContext("2d");
  //   const heroImg = await loadTexture('assets/player.png')
  //   const enemyImg = await loadTexture('assets/enemyShip.png')
  //   const starImg = await loadTexture('assets/starBackground.png'); // 별 이미지 텍스처
  //   const pattern = ctx.createPattern(starImg, 'repeat');

  //   const smallWidth = heroImg.width * 0.6;
  //   const smallHeight = heroImg.height * 0.6;
  //   ctx.fillStyle = pattern;
    
    
  //   ctx.fillRect(0,0, canvas.width, canvas.height);
  //   ctx.drawImage(heroImg, canvas.width/2 - 45, canvas.height - (canvas.height 
  // /4));
  //   ctx.drawImage(heroImg, canvas.width/2 - 45-60, canvas.height - (canvas.height 
  //   /4)+30,smallWidth,smallHeight);
  //   ctx.drawImage(heroImg, canvas.width/2 - 45+100, canvas.height - (canvas.height 
  //       /4)+30,smallWidth,smallHeight);

  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext("2d");
  heroImg = await loadTexture("assets/player.png");
  enemyImg = await loadTexture("assets/enemyShip.png");
  laserImg = await loadTexture("assets/laserRed.png");
  collisionImg = await loadTexture("assets/laserGreenShot.png");
  

  initGame();

  let gameLoopId = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawGameObjects(ctx);
      updateGameObjects();
  }, 100)
  
  
  // setInterval(() => {
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   ctx.fillStyle = "black";
  //   ctx.fillRect(0, 0, canvas.width, canvas.height);
  //   drawGameObjects(ctx);
  //   updateGameObjects(); // 충돌 감지
  // }, 100);
  
    
    
     
    
    // createEnemies(ctx, canvas, enemyImg);
    // createEnemies2(ctx, canvas, enemyImg);
};



