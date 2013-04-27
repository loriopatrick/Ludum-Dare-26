

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


	var CAN_breakBlock = (function () {
		var can = document.createElement('canvas');
		can.width = BLOCK_SIZE;
		can.height = BLOCK_SIZE;
		var ctx = can.getContext('2d');

		ctx.fillStyle = '#4F2C14';
		ctx.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
		
		var grd=ctx.createRadialGradient(BLOCK_SIZE/2,BLOCK_SIZE/2,5,BLOCK_SIZE/2,BLOCK_SIZE/2,BLOCK_SIZE);
		grd.addColorStop(0,'#753D15');
		grd.addColorStop(1,'rgba(0, 0, 0, 0)');

		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);

		var borderFract = 8;
		ctx.fillStyle = '#36261B';
		ctx.fillRect(0, 0, BLOCK_SIZE / borderFract, BLOCK_SIZE);
		ctx.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE / borderFract);
		ctx.fillRect(BLOCK_SIZE / borderFract * (borderFract - 1), 0, BLOCK_SIZE / borderFract, BLOCK_SIZE);
		ctx.fillRect(0, BLOCK_SIZE / borderFract * (borderFract - 1), BLOCK_SIZE, BLOCK_SIZE / borderFract);
		return can;
	})();

	var CAN_player_face = (function () {
		var can = document.createElement('canvas');
		can.width = BLOCK_SIZE;
		can.height = BLOCK_SIZE * 2;
		var ctx = can.getContext('2d');

		var size_iscale = 1.5;

		var leftStart = BLOCK_SIZE / 2 - BLOCK_SIZE / (size_iscale * 2);
		var topStart = BLOCK_SIZE - BLOCK_SIZE / size_iscale;
		var width = BLOCK_SIZE / size_iscale;
		var height = BLOCK_SIZE * 1.5 / size_iscale;

		// draw the body
		ctx.fillStyle = '#FFC891';
		ctx.fillRect(leftStart, topStart, width, height);

		// remove chunk to get legs
		ctx.fillStyle = '#32912D';
		var dongWidth = BLOCK_SIZE / (size_iscale * 2);
		ctx.clearRect(leftStart + width / 2 - dongWidth / 2, BLOCK_SIZE, dongWidth, BLOCK_SIZE / size_iscale + 1);

		// draw the face
		ctx.fillStyle = 'black';
		var eyeSize = BLOCK_SIZE / (size_iscale * 6);
		// eyes
		ctx.fillRect(leftStart + eyeSize, topStart + eyeSize, eyeSize, eyeSize);
		ctx.fillRect(leftStart + width - eyeSize * 2, topStart + eyeSize, eyeSize, eyeSize);
		// mouth
		ctx.fillRect(leftStart + eyeSize, topStart + eyeSize * 3, width, eyeSize / 2);

		return can;
	})();

	var CAN_sword_down = (function () {
		var can = document.createElement('canvas');
		can.width = BLOCK_SIZE;
		can.height = BLOCK_SIZE;
		var ctx = can.getContext('2d');

		var size_iscale = 5;
		var width = BLOCK_SIZE / size_iscale;
		ctx.fillStyle = '#FF7700';
		ctx.fillRect(BLOCK_SIZE / 2 - width / 2, 0, width, BLOCK_SIZE);
		ctx.fillStyle = '#474747';
		ctx.fillRect(BLOCK_SIZE / 2 - width / 8, 0, width / 4, BLOCK_SIZE);

		return can;
	})();

	function drawBlock(ctx, type, x, y) {
		ctx.drawImage(type, x*BLOCK_SIZE, y*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
	}

	var player = Crazed.Base({});

	var input = new Crazed.Input();
	input.bind(Crazed.Keys.KEY_W, 'up');
	input.bind(Crazed.Keys.KEY_UP, 'up');

	input.bind(Crazed.Keys.KEY_A, 'left');
	input.bind(Crazed.Keys.KEY_LEFT, 'left');
	
	input.bind(Crazed.Keys.KEY_S, 'down');
	input.bind(Crazed.Keys.KEY_DOWN, 'down');
	
	input.bind(Crazed.Keys.KEY_D, 'right');
	input.bind(Crazed.Keys.KEY_RIGHT, 'right');

	input.bind(Crazed.Keys.KEY_SPACE, 'fire1');
	// input.bind(Crazed.Keys.KEY_SPACE, 'fire2');

	var render = new Crazed.Renderer({frame: '#game'});
	window.onresize = function () {
		render.scale();
	};


	var floor = render.addLayer('floor', true);
	floor.fillStyle = '#5A854E';
	floor.fillRect(0,0,800,600);

	var obstacles = render.addLayer('obstacles', true);
	drawBlock(obstacles, CAN_solidBlock, 0, 0);
	drawBlock(obstacles, CAN_breakBlock, 1, 1);
	drawBlock(obstacles, CAN_solidBlock, 1, 0);
	drawBlock(obstacles, CAN_solidBlock, 0, 1);

	var pickups = render.addLayer('pickups', true);
	pickups.drawImage(CAN_sword_down, 0, 0);

	var a = BLOCK_SIZE * 5;
	var players = render.addLayer('players', true);
	players.drawImage(CAN_player_face, BLOCK_SIZE * 0 + (a += 3), BLOCK_SIZE * 0, BLOCK_SIZE, BLOCK_SIZE * 2);
	input.onDown('right', function () {
		render.clear(players);
		players.drawImage(CAN_player_face, BLOCK_SIZE * 0 + (a += 3), BLOCK_SIZE * 0, BLOCK_SIZE, BLOCK_SIZE * 2);
	});

})();