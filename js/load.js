var boot = {
	preload: function() {
		//this.game.stage.backgroundColor = '#39CCCC';
		this.game.load.image('loading', 'assets/loading.png');
		this.game.load.image('loading2', 'assets/loading2.png');
	},
	create: function() {
		this.game.state.start('load');
	}
};

var load = {
	preload: function() {
		preloading2 = this.game.add.sprite(this.game.world.width/2-50, this.game.world.height/2, 'loading2');
		preloading2.x -= preloading2.width/2;
		preloading = this.game.add.sprite(this.game.world.width/2-50, this.game.world.height/2+4, 'loading');
		preloading.x -= preloading.width/2;
		this.game.load.setPreloadSprite(preloading);

		this.game.load.spritesheet('player', 'assets/player.png', 20, 20);
		this.game.load.image('layer', 'assets/platform.png');
		this.game.load.image('coin', 'assets/coin.png');
		this.game.load.image('lava', 'assets/lava.png');
		this.game.load.image('pixel', 'assets/pixel.png');

		this.game.load.audio('coin', 'assets/coin.mp3');
		this.game.load.audio('jump', 'assets/jump.mp3');
		this.game.load.audio('die', 'assets/dead.wav');
	},
	create: function() {
		this.game.state.start('menu');
	}
};