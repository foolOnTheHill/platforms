(function() {
	var score = 0;

	var game = new Phaser.Game(900, 500, Phaser.AUTO, 'game_div', {
		preload: function() {
			this.game.stage.backgroundColor = '#eb87f2';
			this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
		}
	});

	WebFontConfig = {
		active: function() { game.time.events.add(Phaser.Timer.SECOND, function createGame() {game.state.start('boot');}, this); },
		google: {
			families: ['Righteous::latin']
		}
	};

	game.state.add('boot', boot);
	game.state.add('load', load);
	game.state.add('menu', menu);
	game.state.add('instructions', instructions);
	game.state.add('main', main);
	game.state.add('end', end);
})();