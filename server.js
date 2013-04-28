var app = require('http').createServer(handler)
	, io = require('socket.io').listen(app, { log: false })
	, fs = require('fs')

app.listen(5050);

function handler (req, res) {
	console.log(req.url);

	var map = {
		'/':'/index.html',
	};

	var url;
	if (req.url in map)
		url = map[req.url];
	else url = req.url;

	fs.readFile(__dirname + url,
	function (err, data) {
		if (err) {
			res.writeHead(500);
			return res.end('Error loading index.html');
		}

		res.writeHead(200);
		res.end(data);
	});
}

var width = 16;
var height = 12;

var player_counter = 0;

var levelData = [];
var players = {};
var bullets = [];

function buildLevel() {
	var levelData = [];

	for (var y = 0; y < height; ++y) {
		var xb = [];
		for (var x = 0; x < width; ++x) {
			xb.push(1);
		}
		levelData.push(xb);
	}
	var x = Math.floor(width / 2), y = Math.floor(height / 2);
	var toDraw = 300;
	for (var i = 0; i < toDraw; ++i) {
		var dir = Math.random();

		if (dir < .25) {
			++x;
		} else if (dir < .5) {
			++y;
		} else if (dir < .75) {
			--x;
		} else {
			--y;
		}

		if (y >= height) y = height - 1;
		if (x >= width) x = width - 1;
		if (y <= 0) y = 0;
		if (x <= 0) x = 0;
		levelData[y][x] = 0;
	}

	return levelData;
}

levelData = buildLevel();

var playCounter = 0;

function newPlayer() {
	return {
		id: playCounter++,
		pos: (function () {
			while (1) {
				var x = Math.floor(Math.random() * width + width) % width;
				var y = Math.floor(Math.random() * height + height) % height;

				if (!levelData[y][x]) {
					return {x:x, y:y};
				}
			}
		})(),
		dir: {
			x:0,
			y:1
		}
	}
}

function updatePlayer(player, data) {
	if (!player) return;
	player.pos.x = data.pos.x;
	player.pos.y = data.pos.y;
	player.dir.x = data.dir.x;
	player.dir.y = data.dir.y;
}

io.sockets.on('connection', function (socket) {
	socket.emit('init', { players: players, bullets: bullets, level: levelData });
	
	var player = null;

	function checkCollision (delta) {
		if (!player) return;
		for (var i = 0; i < bullets.length; ++i) {
			var b = bullets[i];
			if (b.id == player.id) continue;
			var xdiff = b.x - player.pos.x;
			if (xdiff >= 0 && xdiff < 1) {
				var ydiff = b.y - player.pos.y;
				if (ydiff >= 0 && ydiff < 1) {
					console.log('kill!!');
					io.sockets.emit('kill', {victim:player.id, source:b.id, bid:b.bid});
					delete players[player.id];
					player = null;
					bullets.splice(i, 1);
					break;
				}
			}
		}
	}

	var last = new Date().getTime();
	function checkTimeout () {
		if (!player) return;
		var now = new Date().getTime();
		checkCollision((now - last) / 1000);
		last = now;
		setTimeout(checkTimeout, 10);
	}

	socket.on('spawn', function () {
		if (player) {
			delete players[player.id];
		}
		player = newPlayer();
		players[player.id] = player;
		socket.emit('setId', player.id);
		io.sockets.emit('spawn', player);
		checkTimeout();
	});

	socket.on('update', function (data) {
		if (!player) return;
		updatePlayer(player, data);
		io.sockets.emit('update', {id: player.id, data: data});
	});

	socket.on('shoot', function (bullet) {
		if (!player) return;
		console.log('shoot');
		bullet.id = player.id;
		console.log(bullet);
		io.sockets.emit('shoot', bullet);
		bullets.push(bullet);

		function updateBullet(delta) {
			bullet.x += bullet.vx * delta * 5;
			bullet.y += bullet.vy * delta * 5;
		}

		var last = new Date().getTime();
		function bulletUpdateTimeout() {
			if (!bullet) return;
			var now = new Date().getTime();
			updateBullet((now - last) / 1000);
			setTimeout(bulletUpdateTimeout, 10);
		}

		bulletUpdateTimeout();

		setTimeout(function () { // remove bullet after a second
			bullets.splice(bullets.indexOf(bullet), 1);
			bullet = null;
		}, 1000);
	});
});