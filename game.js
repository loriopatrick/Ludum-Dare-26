

(function () {

	// Generate the art
	var BLOCK_SIZE = 50;

	var CAN_solidBlock = (function () {
		var can = document.createElement('canvas');
		can.width = BLOCK_SIZE;
		can.height = BLOCK_SIZE;
		var ctx = can.getContext('2d');

		ctx.fillStyle = 'darkgray';
		ctx.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
		
		var grd=ctx.createRadialGradient(BLOCK_SIZE/2,BLOCK_SIZE/2,5,BLOCK_SIZE/2,BLOCK_SIZE/2,BLOCK_SIZE);
		grd.addColorStop(0,'gray');
		grd.addColorStop(1,'rgba(0, 0, 0, 0)');

		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);

		var borderFract = 15;
		ctx.fillStyle = '#595959';
		ctx.fillRect(0, 0, BLOCK_SIZE / borderFract, BLOCK_SIZE);
		ctx.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE / borderFract);
		ctx.fillRect(BLOCK_SIZE / borderFract * (borderFract - 1), 0, BLOCK_SIZE / borderFract, BLOCK_SIZE);
		ctx.fillRect(0, BLOCK_SIZE / borderFract * (borderFract - 1), BLOCK_SIZE, BLOCK_SIZE / borderFract);
		return can;
	})();

	var CAN_bullet = (function () {
		var can = document.createElement('canvas');
		can.width = BLOCK_SIZE / 5;
		can.height = BLOCK_SIZE / 5;
		var ctx = can.getContext('2d');

		ctx.fillStyle = '#FF6600';
		ctx.fillRect(0, 0, BLOCK_SIZE / 5, BLOCK_SIZE / 5);
		
		var grd=ctx.createRadialGradient(BLOCK_SIZE/10,BLOCK_SIZE/10,5,BLOCK_SIZE/10,BLOCK_SIZE/10,BLOCK_SIZE/5);
		grd.addColorStop(0,'#FF0000');
		grd.addColorStop(1,'rgba(0, 0, 0, 0)');

		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, BLOCK_SIZE/5, BLOCK_SIZE/5);

		var borderFract = 45;
		ctx.fillStyle = '#36261B';
		ctx.fillRect(0, 0, BLOCK_SIZE / borderFract, BLOCK_SIZE/5);
		ctx.fillRect(0, 0, BLOCK_SIZE / 5, BLOCK_SIZE / borderFract);
		ctx.fillRect(BLOCK_SIZE / borderFract * (borderFract - 1), 0, BLOCK_SIZE / borderFract, BLOCK_SIZE / 5);
		ctx.fillRect(0, BLOCK_SIZE / borderFract * (borderFract - 1), BLOCK_SIZE / 5, BLOCK_SIZE / borderFract);
		return can;
	})();

	var CAN_netBullet = (function () {
		var can = document.createElement('canvas');
		can.width = BLOCK_SIZE / 5;
		can.height = BLOCK_SIZE / 5;
		var ctx = can.getContext('2d');

		ctx.fillStyle = '#004CFF';
		ctx.fillRect(0, 0, BLOCK_SIZE / 5, BLOCK_SIZE / 5);
		
		var grd=ctx.createRadialGradient(BLOCK_SIZE/10,BLOCK_SIZE/10,5,BLOCK_SIZE/10,BLOCK_SIZE/10,BLOCK_SIZE/5);
		grd.addColorStop(0,'#00FFF2');
		grd.addColorStop(1,'rgba(0, 0, 0, 0)');

		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, BLOCK_SIZE/5, BLOCK_SIZE/5);

		var borderFract = 45;
		ctx.fillStyle = '#36261B';
		ctx.fillRect(0, 0, BLOCK_SIZE / borderFract, BLOCK_SIZE/5);
		ctx.fillRect(0, 0, BLOCK_SIZE / 5, BLOCK_SIZE / borderFract);
		ctx.fillRect(BLOCK_SIZE / borderFract * (borderFract - 1), 0, BLOCK_SIZE / borderFract, BLOCK_SIZE / 5);
		ctx.fillRect(0, BLOCK_SIZE / borderFract * (borderFract - 1), BLOCK_SIZE / 5, BLOCK_SIZE / borderFract);
		return can;
	})();

	var CAN_playerBuild = function (bodyColor, eyeColor, gunColor) {
		var size_iscale = 1.5;

		var leftStart = BLOCK_SIZE / 2 - BLOCK_SIZE / (size_iscale * 2);
		var topStart = 0;
		var width = BLOCK_SIZE / size_iscale;
		var height = BLOCK_SIZE * 1.5 / size_iscale;

		function renderBase() {
			var can = document.createElement('canvas');
			can.width = BLOCK_SIZE;
			can.height = BLOCK_SIZE;
			var ctx = can.getContext('2d');

			// draw the body
			ctx.fillStyle = bodyColor || '#FFC891';
			ctx.fillRect(leftStart, topStart, width, height);

			// remove chunk to get legs
			var dongWidth = BLOCK_SIZE / (size_iscale * 2);
			ctx.clearRect(leftStart + width / 2 - dongWidth / 2, BLOCK_SIZE / size_iscale, dongWidth, BLOCK_SIZE / size_iscale + 1);

			return [can, ctx];			
		}

		return {
			right:(function () {
				var base = renderBase();
				var ctx = base[1];

				// draw the face
				ctx.fillStyle = eyeColor || 'black';
				var eyeSize = BLOCK_SIZE / (size_iscale * 6);
				// eyes
				ctx.fillRect(leftStart + eyeSize, topStart + eyeSize, eyeSize, eyeSize);
				ctx.fillRect(leftStart + width - eyeSize * 2, topStart + eyeSize, eyeSize, eyeSize);
				// gun
				ctx.fillStyle = gunColor || 'black';
				ctx.fillRect(leftStart + eyeSize, topStart + eyeSize * 3, width, eyeSize / 2);

				return base[0];
			})(),
			left:(function () {
				var base = renderBase();
				var ctx = base[1];

				// draw the face
				ctx.fillStyle = eyeColor || 'black';
				var eyeSize = BLOCK_SIZE / (size_iscale * 6);
				// eyes
				ctx.fillRect(leftStart + eyeSize, topStart + eyeSize, eyeSize, eyeSize);
				ctx.fillRect(leftStart + width - eyeSize * 2, topStart + eyeSize, eyeSize, eyeSize);
				// gun
				ctx.fillStyle = gunColor || 'black';
				ctx.fillRect(leftStart - eyeSize, topStart + eyeSize * 3, width, eyeSize / 2);

				return base[0];
			})(),
			face:(function () {
				var base = renderBase();
				var ctx = base[1];

				// draw the face
				ctx.fillStyle = eyeColor || 'black';
				var eyeSize = BLOCK_SIZE / (size_iscale * 6);
				// eyes
				ctx.fillRect(leftStart + eyeSize, topStart + eyeSize, eyeSize, eyeSize);
				ctx.fillRect(leftStart + width - eyeSize * 2, topStart + eyeSize, eyeSize, eyeSize);
				// gun
				ctx.fillStyle = gunColor || 'black';
				ctx.fillRect(BLOCK_SIZE /2 - eyeSize / 2, topStart + eyeSize * 3, eyeSize, width);

				return base[0];
			})(),
			back:(function () {
				return renderBase()[0];
			})()
		}
	};

	var CAN_player = CAN_playerBuild();
	var CAN_net = CAN_playerBuild('blue');

	function drawBlock(ctx, type, x, y) {
		ctx.drawImage(type, x*BLOCK_SIZE, y*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
	}

	var input = new Crazed.Input();
	input.bind(Crazed.Keys.KEY_W, 'up');
	input.bind(Crazed.Keys.KEY_UP, 'up');

	input.bind(Crazed.Keys.KEY_A, 'left');
	input.bind(Crazed.Keys.KEY_LEFT, 'left');
	
	input.bind(Crazed.Keys.KEY_S, 'down');
	input.bind(Crazed.Keys.KEY_DOWN, 'down');
	
	input.bind(Crazed.Keys.KEY_D, 'right');
	input.bind(Crazed.Keys.KEY_RIGHT, 'right');

	input.bind(Crazed.Keys.KEY_SPACE, 'fire');

	var render = new Crazed.Renderer({frame: '#game'});
	window.onresize = function () {
		render.scale();
	};


	var floor = render.addLayer('floor', true);
	floor.fillStyle = '#5A854E';
	floor.fillRect(0,0,800,600);

	var obstacles = render.addLayer('obstacles', true);

	function loadLevel (levelData) {
		this.levelData = levelData;
		for (var y = 0; y < levelData.length; ++y) {
			for (var x = 0; x < levelData[y].length; ++x) {
				if (!levelData[y][x]) continue;
				drawBlock(obstacles, CAN_solidBlock, x, y);
			}
		}
	}

	var _levelData = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 2], [0, 0, 0, 2], [0, 0, 2, 2]];

	loadLevel(_levelData);

	function extend(plate, food) {
		for (var key in food) {
			var obj = food[key];
			if (plate[key] && typeof obj === 'object' && !Array.isArray(obj)) {
				extend(plate[key], food[key]);
				continue;
			}
			plate[key] = food[key];
		}
		return plate;
	}

	// left right up down
	var playerDirections = [CAN_player.left, CAN_player.right, CAN_player.back, CAN_player.face];
	var Player = Crazed.Base.extend({
		init: function (data) {
			this.data = extend({
				pos: {x:0, y:0},
				last: {x:0, y:0},
				dir: {x:0, y:1},
				level: null
			}, data || {});
		},
		render: function (ctx, x, y) {
			// todo draw different for direction
			var img = 0;
			var dir = this.data.dir;

			if (dir.y == -1) img = 2;
			else if (dir.x == 1) img = 1;
			else if (dir.x == -1) img = 0;
			else img = 3;

			var can = playerDirections[img];
			ctx.drawImage(can, x, y, can.width, can.height);
			this.update = false;
		},
		update: function (data) {
			extend(this.data, data);
			this.update = true;
		},
		move: function (trans) { // todo: collision detection
			trans.x = trans.x || 0;
			trans.y = trans.y || 0;
			if (trans.x == 0 && trans.y == 0) return;
			this.data.pos.x += trans.x;
			this.data.pos.y += trans.y;

			var buffer = 0.2;

			var tlx = Math.floor(this.data.pos.x + buffer);
			var tly = Math.floor(this.data.pos.y + buffer);

			var brx = Math.floor(this.data.pos.x + 1 - buffer);
			var bry = Math.floor(this.data.pos.y + 1 - buffer);

			// console.log(tlx + ' : ' + brx + ', ' + tly + ' : ' + bry);

			if (trans.x < 0) { // left
				this.data.dir.x = -1;
				if ((this.data.level[tly] && this.data.level[tly][tlx]) || (this.data.level[bry] && this.data.level[bry][tlx])) {
					this.data.pos.x = tlx + 1;
				}
			} else if (trans.x > 0) {
				this.data.dir.x = 1;
				if ((this.data.level[tly] && this.data.level[tly][brx]) || (this.data.level[bry] && this.data.level[bry][brx])) {
					this.data.pos.x = brx - 1;
				}
			} else {
				this.data.dir.x = 0;
			}

			if (trans.y < 0) { // up
				this.data.dir.y = -1;
				if (this.data.level[tly] && (this.data.level[tly][tlx] || this.data.level[tly][brx])) {
					this.data.pos.y = tly + 1;
				}
			} else if (trans.y > 0) { // down
				this.data.dir.y = 1;
				if (this.data.level[bry] && (this.data.level[bry][tlx] || this.data.level[bry][brx])) {
					this.data.pos.y = bry - 1;
					console.log('hit');
				}
			} else {
				this.data.dir.y = 0;
			}

			if (this.data.pos.x < 0) this.data.pos.x = 0;
			if (this.data.pos.y < 0) this.data.pos.y = 0;
			if (this.data.pos.y >= 600/BLOCK_SIZE - 1) this.data.pos.y = 600/BLOCK_SIZE - 1;
			if (this.data.pos.x >= 800/BLOCK_SIZE - 1) this.data.pos.x = 800/BLOCK_SIZE - 1;

			this.update = true;
			this.setOld();
		},
		setOld: function () {
			var dist = Math.sqrt(Math.pow(this.data.pos.x - this.data.last.x, 2) + Math.pow(this.data.pos.y - this.data.last.y, 2));
			if (dist >= .2)
				this.old = true;
			extend(this.data.last, this.data.pos);
		}
	});

	var me = new Player({level:this.levelData});

	var bulletLayer = render.addLayer('bullets', true);
	var playerLayer = render.addLayer('players', true);
	var statsLayer = render.addLayer('stats', true);

	statsLayer.font = '20px Arial';
	statsLayer.fillText("10 kills, 4 deaths, 12 players",10,30);

	var bullets = [];
	var netPlayers = {};

	var gameWin = this;

	var GameLoop = Crazed.GameLoop.extend({
		loop: function (delta) {

			var move = delta * 10;

			me.move({
				y:(input.isDown('down')? move : (input.isDown('up')? -move : 0)),
				x:(input.isDown('right')? move : (input.isDown('left')? -move : 0)),
			});

			if (me.update) {
				render.clear(playerLayer);
				me.render(playerLayer, BLOCK_SIZE * me.data.pos.x, BLOCK_SIZE * me.data.pos.y);
			}

			var new_bullets = [];
			render.clear(bulletLayer);
			for (var i = 0; i < bullets.length; ++i) {
				var b = bullets[i];
				b.x += b.vx * move;
				b.y += b.vy * move;

				var x = Math.floor(b.x), y = Math.floor(b.y);
				if (gameWin.levelData[y] && gameWin.levelData[y][x]) continue;
				if (x < 0) continue;
				if (y < 0) continue;
				if (x > 800/BLOCK_SIZE - 1) continue;
				if (y > 600/BLOCK_SIZE - 1) continue;

				new_bullets.push(b);
				bulletLayer.drawImage(CAN_bullet, BLOCK_SIZE * b.x, BLOCK_SIZE * b.y);
			}

			bullets = new_bullets;
		}
	});

	input.onDown('fire', function () {
		console.log('fire');
		var bullet = {x:me.data.pos.x + .5, y:me.data.pos.y + .5, vx:me.data.dir.x*2, vy:me.data.dir.y*2};
		bullets.push(bullet);
	});

	var loop = new GameLoop();
	loop.start();

	// var a = BLOCK_SIZE * 5;
	// var players = render.addLayer('players', true);
	// players.drawImage(CAN_player_face, BLOCK_SIZE * 0 + (a += 3), BLOCK_SIZE * 0, BLOCK_SIZE, BLOCK_SIZE * 2);
	// input.onDown('right', function () {
	// 	render.clear(players);
	// 	players.drawImage(CAN_player_face, BLOCK_SIZE * 0 + (a += 3), BLOCK_SIZE * 0, BLOCK_SIZE, BLOCK_SIZE * 2);
	// });


	

})();