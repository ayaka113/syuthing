// ===============================
//  初期設定
// ===============================
const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");

let bullets = [];   // 弾の配列
let enemies = [];   // 敵の配列

let score = 0;
let timeLeft = 60;
let timerInterval;
let enemyInterval;
let gameRunning = false;
let lives = 3;
let keys = {};


// プレイヤー初期位置
player.style.left = "220px";
player.style.top = "560px";


// ===============================
//  プレイヤー移動（左右キー）
// ===============================
document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;

  keys[e.key] = true;

  if (e.key === " ") {
    createBullet();
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});



// ===============================
//  弾の生成
// ===============================
function createBullet() {
  const bullet = document.createElement("div");
  bullet.className = "bullet";

  const px = parseInt(player.style.left);
  const py = parseInt(player.style.top);

  bullet.style.left = px + 18 + "px";
  bullet.style.top = py - 10 + "px";

  gameArea.appendChild(bullet);
  bullets.push(bullet);
}


// ===============================
//  弾の移動
// ===============================
function moveBullets() {
  bullets.forEach((bullet, index) => {
    const y = parseInt(bullet.style.top);
    bullet.style.top = y - 8 + "px";

    // 画面外に出たら削除
    if (y < 0) {
      bullet.remove();
      bullets.splice(index, 1);
    }
  });
}


// ===============================
//  敵の生成
// ===============================
function createEnemy() {
  const enemy = document.createElement("div");
  enemy.className = "enemy";

  const img = document.createElement("img");
  img.src = "images/enemy.png";
  img.className = "enemy-img";

  enemy.appendChild(img);

  enemy.style.left = Math.random() * 440 + "px";
  enemy.style.top = "0px";

  gameArea.appendChild(enemy);
  enemies.push(enemy);
}


// ===============================
//  敵の移動
// ===============================
function moveEnemies() {
  enemies.forEach((enemy, index) => {
    const y = parseInt(enemy.style.top);
    enemy.style.top = y + 3 + "px";

    // 画面外に出たら削除
    if (y > 640) {
      enemy.remove();
      enemies.splice(index, 1);
    }
  });
}


// ===============================
//  衝突判定（弾 × 敵）
// ===============================
function checkBulletCollision() {
  bullets.forEach((bullet, bi) => {
    const bx = parseInt(bullet.style.left);
    const by = parseInt(bullet.style.top);

    enemies.forEach((enemy, ei) => {
      const ex = parseInt(enemy.style.left);
      const ey = parseInt(enemy.style.top);

      if (
        bx < ex + 30 &&
        bx + 5 > ex &&
        by < ey + 30 &&
        by + 10 > ey
      ) {
        // 衝突したら削除
        bullet.remove();
        enemy.remove();

        bullets.splice(bi, 1);
        enemies.splice(ei, 1);

        updateScore();
      }
    });
  });
}
// ===============================
//プレイヤーと敵の衝突判定
// ===============================
function checkPlayerCollision() {
  const px = parseInt(player.style.left);
  const py = parseInt(player.style.top);

  enemies.forEach((enemy, ei) => {
    const ex = parseInt(enemy.style.left);
    const ey = parseInt(enemy.style.top);

    if (
      px < ex + 30 &&
      px + 40 > ex &&
      py < ey + 30 &&
      py + 40 > ey
    ) {
      // 衝突した敵を削除
      enemy.remove();
      enemies.splice(ei, 1);

      reduceLife();
    }
  });
}

// ===============================
//  LIFE を減らす
// ===============================
function reduceLife() {
  lives--;
  document.getElementById("lives").textContent = `ライフ: ${lives}`;

  if (lives <= 0) {
    endGame();
  }
}



// ===============================
//  スコア更新
// ===============================
function updateScore() {
  score += 10;
  document.getElementById("score").textContent = `スコア: ${score}`;
}


// ===============================
//  タイマー
// ===============================
function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = `残り時間: ${timeLeft}s`;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}


// ===============================
//  ゲーム開始
// ===============================
function startGame() {
  if (gameRunning) return;

  gameRunning = true;
  score = 0;
  timeLeft = 60;
  lives = 3;

  //プレイヤー位置を初期化
  player.style.left = "220px";
  player.style.top = "560px";

  document.getElementById("score").textContent = "スコア: 0";
  document.getElementById("timer").textContent = "残り時間: 60s";
  document.getElementById("lives").textContent = "ライフ: 3";

  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameOverScreen").style.display = "none";

  // 配列を初期化
  bullets = [];
  enemies = [];

  //画面上に残っている敵や弾を削除
  document.querySelectorAll(".bullet").forEach(b => b.remove());
  document.querySelectorAll(".enemy").forEach(e => e.remove());

  startTimer();
  enemyInterval = setInterval(createEnemy, 1000);

  gameLoop();
}


// ===============================
//  ゲームループ
// ===============================
function gameLoop() {
  if (!gameRunning) return;
  
  movePlayer();
  moveBullets();
  moveEnemies();
  checkBulletCollision();
  checkPlayerCollision();

  function movePlayer() {
  const left = parseInt(player.style.left);

  if (keys["ArrowLeft"] && left > 0) {
    player.style.left = left - 8 + "px";
  }
  if (keys["ArrowRight"] && left < 440) {
    player.style.left = left + 8 + "px";
  }
}

  requestAnimationFrame(gameLoop);
}


// ===============================
//  ゲーム終了
// ===============================
function endGame() {
  gameRunning = false;

  clearInterval(timerInterval);
  clearInterval(enemyInterval);

  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameOverScreen").style.display = "block";
}

