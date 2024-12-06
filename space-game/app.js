
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
  clear() {
      this.listeners = {};
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
      this.life = 3;
      this.points = 0;

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

    decrementLife() {
      this.life--;
      if (this.life === 0) {
        this.dead = true;
      }
     }
    
    incrementPoints() {
      this.points += 100;
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
      hero.incrementPoints();
      const explosion = new Explosion(second.x, second.y);
      gameObjects.push(explosion);      
    });

    eventEmitter.on(Messages.KEY_EVENT_ENTER, () => {
      resetGame();
     });

    eventEmitter.on(Messages.COLLISION_ENEMY_HERO, (_, { enemy }) => {
      enemy.dead = true;
      hero.decrementLife();
      if (isHeroDead())  {
        eventEmitter.emit(Messages.GAME_END_LOSS);
        return; // loss before victory
      }
      if (isEnemiesDead()) {
        eventEmitter.emit(Messages.GAME_END_WIN);
      }
   });
    eventEmitter.on(Messages.GAME_END_WIN, () => {
      endGame(true);
   });
    eventEmitter.on(Messages.GAME_END_LOSS, () => {
      endGame(false);
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
  enemies.forEach(enemy => {
    const heroRect = hero.rectFromGameObject();
    if (intersectRect(heroRect, enemy.rectFromGameObject())) {
      eventEmitter.emit(Messages.COLLISION_ENEMY_HERO, { enemy });
    }
  })
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

function drawLife() {
  const START_POS = canvas.width - 180;
  for(let i=0; i < hero.life; i++ ) {
    ctx.drawImage(
      lifeImg, 
      START_POS + (45 * (i+1) ), 
      canvas.height - 37);
  }
 }
function drawPoints() {
  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "left";
  drawText("Points: " + hero.points, 10, canvas.height-20);
 }
function drawText(message, x, y) {
  ctx.fillText(message, x, y);
 }

 function isHeroDead() {
  return hero.life <= 0;
 }
function isEnemiesDead() {
  const enemies = gameObjects.filter((go) => go.type === "Enemy" && 
                        !go.dead);
  return enemies.length === 0;
 }

function displayMessage(message, color = "red") {
  ctx.font = "30px Arial";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);
  }

function endGame(win) {
    clearInterval(gameLoopId);
    // 게임 화면이 겹칠 수 있으니, 200ms 지연
    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (win) {
        displayMessage(
          "Victory!!! Pew Pew... - Press [Enter] to start a new game Captain Pew Pew",
          "green"
        );
      } else {
        displayMessage(
          "You died !!! Press [Enter] to start a new game Captain Pew Pew"
        );
      }
    }, 200)  
   }
function resetGame() {
    if (gameLoopId) {
      clearInterval(gameLoopId); // 게임 루프 중지, 중복 실행 방지
      eventEmitter.clear();  // 모든 이벤트 리스너 제거, 이전 게임 세션 충돌 방지
      initGame();  // 게임 초기 상태 실행
      gameLoopId = setInterval(() => {  // 100ms 간격으로 새로운 게임 루프 시작
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawPoints();
        drawLife();
        updateGameObjects();
        drawGameObjects(ctx);
      }, 100);
    }
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
    } else if(evt.key === "Enter") {
      eventEmitter.emit(Messages.KEY_EVENT_ENTER);
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
    GAME_END_LOSS: "GAME_END_LOSS",
    GAME_END_WIN: "GAME_END_WIN",
    KEY_EVENT_ENTER: "KEY_EVENT_ENTER",
 };

let heroImg, 
  enemyImg, 
  laserImg,
  canvas, ctx, 
  gameObjects = [], 
  hero, 
  lifeImg,
  eventEmitter = new EventEmitter();

  let gameLoopId = setInterval(() => {
    // 화면 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // 게임 객체 그리기
    drawGameObjects(ctx);
    updateGameObjects();   // 배경과 같은 정적인 요소
    drawPoints();
    drawLife();
}, 200)


window.onload = async() => {

  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext("2d");
  heroImg = await loadTexture("assets/player.png");
  enemyImg = await loadTexture("assets/enemyShip.png");
  laserImg = await loadTexture("assets/laserRed.png");
  collisionImg = await loadTexture("assets/laserGreenShot.png");
  lifeImg = await loadTexture("assets/life.png");
  
  initGame();
 
};

