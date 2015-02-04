var instructions = {
	create: function() {

		this.inst1_text = this.game.add.text(400, 50, 'Press \'left\' and \'right\' to move', {font: '40px "Righteous"', fill: '#FFFFFF'});
		this.inst1_text.anchor.setTo(0.5, 0.5);

		this.inst2_text = this.game.add.text(400, 105, 'and press \'up\' to jump.', {font: '40px "Righteous"', fill: '#FFFFFF'});
		this.inst2_text.anchor.setTo(0.5, 0.5);

		this.inst3_text = this.game.add.text(400, 180, 'Collect coins to earn points.', {font: '40px "Righteous"', fill: '#FFFFFF'});
		this.inst3_text.anchor.setTo(0.5, 0.5);

		this.inst4_text = this.game.add.text(400, 290, 'Press \'A\' when you think you\'re ready to play.', {font: '30px "Righteous"', fill: '#FFFFFF'});
		this.inst4_text.anchor.setTo(0.5, 0.5);

		this.game.add.tween(this.inst4_text.scale).to({ x: 1.05, y: 1.05 }, 300).to({ x: 1, y: 1 }, 300).loop().start();

		this.trigger = this.game.input.keyboard.addKey(Phaser.Keyboard.A);

		this.player = this.game.add.sprite(500, 99, 'player');
		this.player.anchor.setTo(0.5, 0.5);
		this.player.frame = 0;

		this.player.body.collideWorldBounds = true;
		this.player.body.gravity.y = 300;

		this.player.animations.add('right', [1, 2], 10, true);
		this.player.animations.add('left', [3, 4], 10, true);

		this.jump_sound = this.game.add.sound('jump');
		this.jump_sound.volume = 0.2;

		this.coin_sound = this.game.add.sound('coin');
		this.coin_sound.volume = 0.2;

		this.cursors = this.game.input.keyboard.createCursorKeys();

		this.platforms = this.game.add.group();
		this.game_coins = this.game.add.group();

		this.platforms.createMultiple(50, 'layer');
		this.timer = this.game.time.events.loop(1500, this.add_platforms, this);

		this.floor = this.game.add.group();
		this.floor.createMultiple(20, 'layer');

		for (var x = 0; x <= 900; x += 200) {
			var p = this.floor.getFirstDead();
			p.reset(x, 490);
			p.anchor.setTo(0.5, 0.5);
			p.body.immovable = true;
		}

	},
	add_platforms: function() {
		var x = 740 + (Math.random()*50);
		var y = Math.min(350, (Math.random()*300)+100);
		var platform = this.platforms.getFirstDead();
		if (platform !== null) {
 			platform.reset(x, y);
			platform.body.velocity.x = -200;
			platform.outOfBoundsKill = true;
			platform.body.immovable = true;
		}
	},
	update: function() {
		this.game.physics.collide(this.player, this.floor);
		this.game.physics.collide(this.player, this.platforms);

		if(this.cursors.left.isDown) {
			this.player.body.velocity.x = -220;
			this.player.animations.play('left');
		} else if (this.cursors.right.isDown) {
			this.player.body.velocity.x = 220;
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

		this.platforms.forEachAlive(function (p) {
			p.body.velocity.x = -200;
		}, this);

		if (this.trigger.isDown) this.game.state.start('main');
	}
}