var main = {
	create: function() {
		this.lava = this.game.add.sprite(0, this.game.world.height - 40, 'lava');

		this.player = this.game.add.sprite(500, 99, 'player');
		this.player.anchor.setTo(0.5, 0.5);
		this.player.frame = 0;

		this.player.body.collideWorldBounds = true;
		this.player.body.gravity.y = 300;

		this.player.animations.add('right', [1, 2], 10, true);
		this.player.animations.add('left', [3, 4], 10, true);

		this.game.camera.follow(this.player, Phaser.Camera.FOLLOW);

		this.platforms = this.game.add.group();
		this.game_coins = this.game.add.group();

		this.platforms.createMultiple(50, 'layer');
		this.timer = this.game.time.events.loop(1800, this.add_platforms, this);

		this.add_one_platform(450, 110);
	
		this.cursors = this.game.input.keyboard.createCursorKeys();

		this.highScore = window.localStorage.getItem('platforms') || 0;
		this.higher = false;

		this.score = 0;
		this.score_text = this.game.add.text(400, 30, '0', {font: '40px "Righteous"', fill: '#FFFFFF'});
		this.score_text.anchor.setTo(0.5, 0.5);

		this.jump_sound = this.game.add.sound('jump');
		this.jump_sound.volume = 0.2;

		this.coin_sound = this.game.add.sound('coin');
		this.coin_sound.volume = 0.2;

		this.die_sound = this.game.add.sound('die');
		this.die_sound.volume = 0.2;

		this.counter = 0;

		this.emitter = new Array();
		for (var i = 0; i < 5; i++) {
			this.emitter[i] = this.game.add.emitter(140*i + 100, this.game.world.height-25, Math.random()*90 + 10);
			this.emitter[i].makeParticles('pixel');
			this.emitter[i].gravity = 0;
		}
	},

	add_one_platform: function(x, y) {

		this.counter += 1;

		var platform = this.platforms.getFirstDead();

		if (platform !== null) {
			platform.reset(x, y);
			platform.body.velocity.x = -(200 + (this.counter/5));
			platform.outOfBoundsKill = true;
			platform.body.immovable = true;
			
			platform.fall = true;

			if (Math.random()*100 > 50) {
		 		for (var i = 0; i < 4; i++) {
					var c = this.game_coins.create(x+10+30*i, y-26, 'coin');
					c.body.gravity.y = 100;
					c.outOfBoundsKill = true;
				}
				platform.fall = false;
			}
		}
	},

	add_platforms: function () {
		this.add_one_platform(740 + (Math.random()*50), (Math.random()*300)+100);
	},

	update: function() {
		this.game.physics.collide(this.player, this.platforms);
		this.game.physics.collide(this.game_coins, this.platforms);
		
		this.game.physics.overlap(this.player, this.game_coins, this.collectCoin, null, this);
		this.game.physics.overlap(this.player, this.lava, this.game_over, null, this);

		this.game.physics.overlap(this.player, this.platforms, this.fall_with_platform, null, this);

		this.platforms.forEachAlive(function (p) {
			p.body.velocity.x = -(200 + (this.counter/5));
		}, this);

		this.movePlayer();
		
		for (var i = 0; i < this.emitter.length; i++) {
			this.emitter[i].y -= Math.random()*10;
			if (this.emitter[i].y < this.game.world.height - 25) {
				this.emitter[i].y = this.game.world.height - 25;
			}
			this.emitter[i].start(true, 300, null, 1);
		}
	},

	fall_with_platform: function(player, platform) {
		if (!platform.fall) {
			return;
		}

		platform.body.velocity.y = 20;
	},

	collectCoin: function(player, coin) {
		if (!coin.alive) {
			return;
		}
		coin.alive = false;

		var t = this.game.add.tween(coin.scale).to({x:0, y:0}, 200).start();
		t.onComplete.add(function() {
			this.updateScore();
			coin.kill();
		}, this);

		this.coin_sound.play();
	},

	updateScore: function() {
		this.score += 1;

		if (this.score > this.highScore && !this.higher) {
			this.higher = true;
			this.highScore_text = this.game.add.text(400, 55, 'highscore!', {font: '15px "Righteous"', fill: '#FFFFFF'});
			this.highScore_text.anchor.setTo(0.5, 0.5)		
			this.game.add.tween(this.highScore_text).to({ angle:1 }, 200).to({ angle:-1 }, 200).loop().start();
		}

		this.score_text.content = this.score;
		this.score_text.anchor.setTo(0.5, 0.5);
	},

	game_over: function() {

		if (!this.player.alive) {
			return;
		}

		this.player.alive = false;

		this.game.time.events.remove(this.timer);
		this.die_sound.play();
		var t = this.game.add.tween(this.player.scale).to({x:0, y:0}, 250).start();
		t.onComplete.add(function() {

			/*------------------ kill 'em all ----------------*/
			this.game_coins.callAll("kill");
			this.platforms.callAll("kill");
			for (var i = 0; i < this.emitter.length; i++) {
				this.emitter[i].kill();
			}
			this.lava.kill();
			this.score_text.destroy();
			/-------------------------------------------------/
			score = this.score;
			this.game.state.start('end')
		}, this);
	},

	movePlayer: function() {

		if(this.cursors.left.isDown) {
			this.player.body.velocity.x = -(220 + (this.counter/5));
			this.player.animations.play('left');
		} else if (this.cursors.right.isDown) {
			this.player.body.velocity.x = 220 + (this.counter/5);
			this.player.animations.play('right');
		} else {
			var v = this.player.body.velocity.x;
			
			if (v > 0) {
				this.player.body.velocity.x = Math.max(0, v - 10);
			} else {
				this.player.body.velocity.x = Math.min(0, v + 10);
			}

			if (this.player.body.velocity.x == 0) {
				this.player.animations.stop();
				this.player.frame = 0;
			}
		}

		if (this.cursors.up.isDown && this.player.body.touching.down) {
			this.player.body.velocity.y = -300;
			this.jump_sound.play();
			
			if (this.player.body.velocity.x >= 0) { 
				this.game.add.tween(this.player).to({angle: -20}, 200).to({angle: 0}, 200).start();
			} else {
				this.game.add.tween(this.player).to({angle: 20}, 200).to({angle: 0}, 200).start();
			}
		}

	}

};

