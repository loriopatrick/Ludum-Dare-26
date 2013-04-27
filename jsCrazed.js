(function(window){
	var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
	window.Class = function(){};
	Class.extend = function(prop) {
		var _super = this.prototype;
		initializing = true;
		var prototype = new this();
		initializing = false;
		for (var name in prop) {
			prototype[name] = typeof prop[name] === "function" &&
				typeof _super[name] == "function" && fnTest.test(prop[name]) ?
				(function(name, fn){
					return function() {
						var tmp = this._super;
						this._super = _super[name];
						var ret = fn.apply(this, arguments);				
						this._super = tmp;
						return ret;
					};
				})(name, prop[name]) :
				prop[name];
		}
		function Class() {
			if ( !initializing && this.init )
				this.init.apply(this, arguments);
		}
		Class.prototype = prototype;
		Class.prototype.constructor = Class;
		Class.extend = arguments.callee;
		return Class;
	};
})(window);

(function (window) {
	window.requestAnimFrame = (function(){
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function( callback ){
				window.setTimeout(callback, 1000 / 60);
			};
	})();
})(window);


var Crazed = Crazed || {};
(function () {
	var Base = Crazed.Base = Class.extend({
		_events:{},
		on: function (event, callback, context) {
			if (!(event in this._events)) this._events[event] = [];
			this._events[event].push({m:callback, c:context});
		},
		trigger: function (name, opt) {
			var calls = this._events[name];
			if (!calls) return;
			for (var i = 0; i < calls.length; ++i) {
				calls[i].m.call(calls[i].c, opt);
			}
		}
	});

	var GameLoop = Crazed.GameLoop = Base.extend({
		_running: false,
		_stopRequest: false,
		_lastLoop: 0,
		isRunning: function () {
			return this._running;
		},
		start: function () {
			this._running = true;
			this._stopRequest = false;
			this._lastLoop = new Date().getTime();
			this.trigger('start');
			this._loop();
		},
		stop: function () {
			this._stopRequest = true;
			this.trigger('stop');
		},
		_loop: function () {
			if (this._stopRequest) {
				this._running = false;
				return;
			}
			var now = new Date().getTime();
			this.loop((now - this._lastLoop) / 1000);
			var self = this;
			frame.requestAnimFrame(function () {
				self._loop();
			});
			this._lastLoop = now;
		},
		loop: function (delta) {
			throw 'loop function is not implemented';
		}
	});

	var Keys = Crazed.Keys = {
		KEY_W:87,
		KEY_S:83,
		KEY_A:65,
		KEY_D:68,
		KEY_Q:81,
		KEY_E:69,
		KEY_F:70,
		KEY_R:82,
		KEY_T:84,
		KEY_UP:38,
		KEY_RIGHT:39,
		KEY_DOWN:40,
		KEY_LEFT:37
	};

	var Input = Crazed.Input = Base.extend({
		_keys:{},
		_isDown:{},
		init: function () {
			var self = this;
			window.addEventListener("keydown", function (evt) {
				self._keyDown(evt.keyCode);
			}, false);
			window.addEventListener("keyup", function (evt) {
				self._keyUp(evt.keyCode);
			}, false);
		},
		bind: function (keyCode, name) {
			this._keys[keyCode] = name;
		},
		isDown: function (name) {
			return this._keys[name];
		},
		onDown: function (name, callback, context) {
			this.on('down ' + name, callback, context);
		},
		onUp: function (name, callback, context) {
			this.on('up ' + name, callback, context);
		},
		_keyDown: function (keyCode) {
			console.log(keyCode);
			if (!(keyCode in this._keys)) return;
			
			this._isDown[this._keys[keyCode]] = true;
			if (typeof this._keys[keyCode] === 'string') {
				this.trigger('down ' + this._keys[keyCode]);
				return;
			}
			this._keys[keyCode]();
		},
		_keyUp: function (keyCode) {
			if (!(keyCode in this._keys)) return;
			this.trigger('up ' + this._keys[keyCode]);
			this._isDown[this._keys[keyCode]] = false;
		}
	});

	var browserPrefixes = ['', '-ms-', '-webkit-'];
	function cssBrowsers(el, name, value) {
		for (var i = 0; i < browserPrefixes.length; ++i) {
			el.style[browserPrefixes[i] + name] = value;
		}
	}

	function applyCss(el, css) {
		for (var key in css) {
			el.style[key] = css[key];
		}
	}

	/*
		scaleMode: zoom, render, fixed
	*/
	var Renderer = Crazed.Renderer = Base.extend({
		layers:{},
		init: function (options) {
			options = options || {};
			
			this.width = options.width || 800;
			this.height = options.height || 600;

			this.scaleMode = options.scaleMode || 'zoom';
			if (this.scaleMode == 'fixed' && (options.width <= 0 || options.height <= 0)) {
				throw 'Fixed scaleMode requires a definate width and height';
			}

			this.viewport = options.viewport || [0, 0, 800, -600]; // TLx, TLy, BRx, BRy

			this.frame = options.frame;
			if (!this.frame) throw 'frame is required';

			if (typeof this.frame === 'string')
				this.frame = document.querySelector(this.frame);

			if (!this.frame) throw 'could not find frame';

			this.frame.innerHTML = '';

			this.center = document.createElement('div');
			applyCss(this.center, {
				width:'1px',
				height:'1px',
				float:'left'
			});
			this.frame.appendChild(this.center);

			this.container = document.createElement('div');
			applyCss(this.container, {
				position:'relative'
			});
			this.center.appendChild(this.container);

			this.scale();
		},
		getWidth: function () {
			return this.width >= 0? this.width : this.frame.offsetWidth;
		},
		getHeight: function () {
			return this.height >= 0? this.height : this.frame.offsetHeight;
		},
		addLayer: function (name, append) {
			if (name in this.layers) throw 'Layer already exists';
			var canvas = document.createElement('canvas');
			applyCss(canvas, {
				position: 'absolute',
				top: 0, left: 0
			});
			canvas.width = this.getWidth();
			canvas.height = this.getHeight();
			this.layers[name] = canvas;

			if (append) this.appendLayer(canvas);

			return this.getCtx(canvas);
		},
		getLayer: function (name) {
			if (typeof name !== 'string') return name;
			return this.layers[name];
		},
		getCtx: function (name) {
			if (typeof name.fillRect === 'function') return name;
			return this.getLayer(name).getContext('2d');
		},
		clear: function (name) {
			if (name) this.getCtx(name).clearRect(0, 0, this.width, this.height);
			else {
				for (var layerName in this.layers) {
					this.clear(layerName);
				}
			}
		},
		appendLayer: function (name) {
			if (typeof name === 'string')
				this.container.appendChild(this.layers[name]);
			else
				this.container.appendChild(name);
		},
		scale: function () {
			var fwidth = this.frame.offsetWidth, fheight = this.frame.offsetHeight;

			if (this.cachedFwidth && this.cachedFwidth == fwidth
				&& this.cachedFheight && this.cachedFheight == fwidth) return;

			this.cachedFwidth = fwidth;
			this.cachedFheight = fheight;

			applyCss(this.center, {
				'margin-left':(fwidth / 2) + 'px',
				'margin-top':(fheight / 2) + 'px'
			});
			
			var width = this.getWidth(), height = this.getHeight();
			var scale = Math.min(fwidth / width, fheight / height);

			if (this.scaleMode === 'zoom') {
				cssBrowsers(this.container, 'transform', 'scale(' + scale + ',' + scale + ')');
			} else if (this.scaleMode === 'render') {
				// this.width *= scale;
				// this.height *= scale;

				for (var layerName in this.layers) {
					this.layers[layerName].width = this.width;
					this.layers[layerName].height = this.height;
				}
			}

			console.log(width + ' :: ' + height);

			applyCss(this.container, {
				background:'cornflowerblue',
				width:width + 'px',
				height:height + 'px',
				'margin-left':(-width / 2) + 'px',
				'margin-top':(-height / 2) + 'px'
			});

			this.trigger('scaled');
		}
	});
})();