var end = {
	create: function() {
		this.start_btn = this.game.input.keyboard.addKey(Phaser.Keyboard.A);

		this.highScore = window.localStorage.getItem('platforms') || 0;
		
		if (score > this.highScore) {
			window.localStorage.setItem('platforms', score);
			this.dead_text = this.game.add.text(400, 145, 'Congratulations!\nYou made a new high score!\n ', {font: '40px "Righteous"', fill: '#FFFFFF', align:'center'});
			this.dead_text.anchor.setTo(0.5, 0.5);
			this.score_text = this.game.add.text(400, 275, 'Score: '+score+' points', {font: '60px "Righteous"', fill: '#FFFFFF', align: 'center'});
		} else {
			this.dead_text = this.game.add.text(400, 105, 'Oh no! You died!', {font: '50px "Righteous"', fill: '#FFFFFF'});
			this.dead_text.anchor.setTo(0.5, 0.5);

			this.score_text = this.game.add.text(400, 260, 'Score: '+score+' points', {font: '60px "Righteous"', fill: '#FFFFFF'});
		}
		this.score_text.anchor.setTo(0.5, 0.5);

		this.game.add.tween(this.score_text.scale).to({x:1.02, y:1.02}, 500).to({x:1, y:1}, 500).loop().start();

		this.again_text = this.game.add.text(400, 405, 'Press \'A\' to play again!', {font: '40px "Righteous"', fill: '#FFFFFF'});
		this.again_text.anchor.setTo(0.5, 0.5);

		this.game.add.tween(this.again_text).delay(500).to({ alpha: 1}, 500).start();		
		this.game.add.tween(this.again_text).to({ angle:1 }, 100).to({ angle:-1 }, 100).loop().start();

		this.time = this.game.time.now + 500;
	},
	update: function() {
		if (this.start_btn.isDown && this.time < this.game.time.now) this.game.state.start('main');
	}
};
