title = "GRAVITAS";

description = `
Avoid asteroids.
Collect coins.
`;

characters = [
`
b   b
bbbbb
 bbb    
 bbb
bbbbb
b   b
`,`
  rr
  rr
rrrrrr
rrrrrr
  rr
  rr
`,`
 gg
gggg
gggg
 gg
`
];

const G = {
	WIDTH: 150,
	HEIGHT: 100,
	MAX_ENEMIES: 9,
	MAX_COINS: 3
}

options = {
	viewSize: {x: G.WIDTH, y: G.HEIGHT},
	theme: "crt",
	seed: 72362,
	isPlayingBgm: true,
	isReplayEnabled: true
};

/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} Star
 */

/**
 * @type { Star [] }
 */
let stars;

/**
 * @typedef {{
* pos: Vector,
* gravity: boolean,
* fallspeed: number,
* accel: number
* }} Player
*/

/**
* @type { Player }
*/
let player;

/**
* @typedef {{
* pos: Vector
* speed: number
* }} Enemy
*/

/**
* @type { Enemy [] }
*/
let enemies;

/**
* @typedef {{
* pos: Vector
* speed: number
* }} Coin
*/

/**
* @type { Coin [] }
*/
let coins;

function update() {
	if (!ticks) {
		init();
	}

	spawnEnemies();

	spawnCoins();

	updateStars();

	updateEnemies();

	updatePlayer();

	updateCoins();
}

function init() {
	stars = times(20, () => {
		const posX = rnd(0, G.WIDTH);
		const posY = rnd(0, G.HEIGHT);
		return {
			pos: vec(posX, posY),
			speed: rnd(0.5, 1.0)
		};
	});
	
	player = {
		pos: vec(G.WIDTH * 0.1, G.HEIGHT * 0.5),
		gravity: true,
		fallspeed: 0.5,
		accel: 1.0
	};

	enemies = [];
	coins = [];
}

function updateStars() {
	stars.forEach((s) => {
		s.pos.x -= s.speed;
		s.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);
		color("purple");
		box(s.pos, 1);
	});
}

function updatePlayer() {
	if (player.gravity && player.pos.y < G.HEIGHT - G.HEIGHT * 0.05) {
		player.pos.y += player.fallspeed * player.accel;
	} else if (!player.gravity && player.pos.y > G.HEIGHT * 0.07) {
		player.pos.y -= player.fallspeed * player.accel;
	}
	player.accel += 0.1;
	if (input.isJustPressed) {
		play("laser");
		player.gravity = player.gravity ? false : true;
		player.accel = 1.0;
		color("cyan");
		particle(
			player.pos.x,
			player.pos.y,
			6,
			1,
			player.gravity ? -PI/2 : PI/2,
			PI/4	
		);
	}

	color("black");
	if (char("a", player.pos).isColliding.char.b) {
		play("explosion");
		end();
	}

}

function updateEnemies() {
	remove(enemies, (e) => {
		e.pos.x -= e.speed;
		color("black");
		char("b", e.pos);

		return (e.pos.x < 0);
	})
}

function spawnEnemies() {
	if (enemies.length < G.MAX_ENEMIES) {
		let amount = G.MAX_ENEMIES - enemies.length;
		for (let i = 0; i < amount; i++) {
			const posX = G.WIDTH + i * G.WIDTH * 0.2;
			const posY = rnd(G.HEIGHT * 0.07, G.HEIGHT - G.HEIGHT * 0.05)
			enemies.push({
				pos: vec(posX, posY),
				speed: 0.5 * difficulty
			});
		}
	}
}

function updateCoins() {
	remove(coins, (c) => {
		c.pos.x -= c.speed;
		color("black");
		if (char("c", c.pos).isColliding.char.a) {
			play("coin");
			addScore(rndi((difficulty - 1) * 100, (difficulty - 1) * 100), c.pos);
			return true;
		}

		return (c.pos.x < 0);
	})
}

function spawnCoins() {
	if (coins.length < G.MAX_COINS) {
		let amount = G.MAX_COINS - coins.length;
		for (let i = 1; i <= amount; i++) {
			const posX = G.WIDTH + i * (G.WIDTH * 0.25);
			const posY = rnd(G.HEIGHT * 0.07, G.HEIGHT - G.HEIGHT * 0.05)
			coins.push({
				pos: vec(posX, posY),
				speed: 0.5 * difficulty
			});
		}
	}
}
