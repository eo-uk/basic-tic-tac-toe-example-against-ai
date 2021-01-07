var winner = '';
var ai_playing = false;

//Set Initial Display Text
$('#display').text('Your Turn');

//Cell Left Click Event
$('.col-xs-2').click(function(){
	var cells = $('#board .col-xs-2');
	//If there is no winner yet AND the AI is not playing AND the cell is not marked X or O
	if (!winner && !ai_playing && !$(this).text()){
		$(this).text('X');
		if (check_winner(get_cell_vals(cells))){
			game_over('X');
		} else if (blank_cell_exists()) {
			ai_start_play();
		} else {
			game_over();
		};
	};
});

//Reset Button
$('#b_reset').click(reset_board);

//Checks to see if any blank cells exist
function blank_cell_exists(){
	for (cell of $('#board .col-xs-2')){
		if (!$(cell).text()){
			return true;
		};
	};
};

//Initiates AI's Turn
function ai_start_play(){
	ai_playing = true;
	$('#display').text('AI Playing');
	var delay = Math.floor((Math.random() * 2000) + 500);
	setTimeout(ai_play, delay);
}

//AI Plays a Hand
function ai_play(){
	var cells = $('#board .col-xs-2');
	
	//Check if marking any cell would win the game for the AI
	for (var i=0; i<cells.length;i++){
		if (!$(cells[i]).text()){
			var cell_vals = get_cell_vals($(cells));
			var future = [...cell_vals];
			future[i] = 'O';
			if (check_winner(future)) {
				$(cells[i]).text('O');
				ai_playing = false;
				game_over('O');
				return true;
			};
		};
	};

	//Check if the player is about to win
	for (var i=0; i<cells.length;i++){
		if (!$(cells[i]).text()){
			var cell_vals = get_cell_vals($(cells));
			var future = [...cell_vals];
			future[i] = 'X';
			if (check_winner(future)) {
				$(cells[i]).text('O');
				ai_playing = false;
				$('#display').text('Your Turn');
				return true;
			};
		};
	};

	//Otherwise mark a random cell
	while (true) {
		var i = Math.floor((Math.random() * 7) + 1);
		if (!$(cells[i]).text()){
			$(cells[i]).text('O');
			ai_playing = false;
			$('#display').text('Your Turn');
			return true;
		};
	};
}

//Declare Game Over
function game_over(player){
	if (player) {
		//Set winner
		winner = player;
		//Get winner's score element
		switch(player){
			case 'X':
				var score = $('#score-player');
				break;
			case 'O':
				var score = $('#score-ai');
				break;
		}
		//Increment winner's score
		score.text(parseInt(score.text()) + 1);
		//Display winner
		$('#display').text('WINNER IS ' + winner + '!');
	} else {
		$('#display').text("It's a draw!");;
	};
};

//Reset Board
function reset_board(){
	$('.col-xs-2').each(function(){
		$(this).text('');
	});
	$('#display').text('Your Turn');
	winner = '';
};

//Get a List of All Cell Values
function get_cell_vals(cells){
	//get all cell values
	var vals = []
	$(cells).each(function(){
		vals.push($(this).text());
	});
	return vals;
};

//Check Win Condition
function check_winner(cells){
	//check rows
	for (let i = 0; i < 10; i += 3){ 
		for (let player of ['X','O']){
			//If joined cell values == 'XXX' or 'OOO'
			if (cells.slice(i,i+3).join('') == player.repeat(3)){
				return true;
			};
		};
	};
	//check columns
	for (let i = 0; i < 3; i ++){
		for (let player of ['X','O']){
			//If joined cell values == 'XXX' or 'OOO'
			if ([cells[i], cells[i+3], cells[i+6]].join('') == player.repeat(3)){
				return true;
			};
		};
	};
	//check diagonal - top left to bottom right
	for (let player of ['X','O']){
		//If joined cell values == 'XXX' or 'OOO'
		if ([cells[0], cells[4], cells[8]].join('') == player.repeat(3)){
			return true;
		};
	};
	//check diagonal - top right to bottom left
	for (let player of ['X','O']){
		//If joined cell values == 'XXX' or 'OOO'
		if ([cells[2], cells[4], cells[6]].join('') == player.repeat(3)){
			return true;
		};
	};
};