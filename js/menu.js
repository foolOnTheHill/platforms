var menu = {
	create: function() {
		this.name_text = this.game.add.text(400, 205, 'Platforms', {font: "140px 'Righteous'", fill: '#FFFFFF'});
		this.name_text.anchor.setTo(0.5, 0.5);

		this.start_text = this.game.add.text(400, 310, 'Press \'A\' to start!', {font: "40px 'Righteous'", fill: '#FFFFFF'});
		this.start_text.anchor.setTo(0.5, 0.5);

		this.game.add.tween(this.start_text).to({ angle:1 }, 200).to({ angle:-1 }, 200).loop().start();
		this.game.add.tween(this.name_text.scale).to({ x: 1.05, y: 1.05 }, 300).to({ x: 1, y: 1 }, 300).loop().start();

		this.trigger = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
	},
	update: function() {
		if (this.trigger.isDown) this.game.state.start('instructions');
	}
};