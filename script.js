// JavaScript Document
$(document).ready(function(){
		initBoard();		// function initializes and creates the board
		resetBoard();		// function "resets" the board -- places checker piece
		resetScores();		// function resets the scores to 0
		
		//*************************************************************************
		// This button resets the game
		//*************************************************************************
		$('button').click(function(){
			resetBoard();
			resetScores();
		})
		
		//*************************************************************************
		// Live function waits for clicks on checkers
		// Upon click, we make sure it's this players turn,
		// if so, we unselect any previously selected pieces and select this one
		//*************************************************************************		
		$('.checker').live('click',function(){
			if ($(this).hasClass($turn)){
				$('.selected').removeClass('selected');
				$(this).addClass('selected');
			}
		});
		
		//*************************************************************************
		// This function waits for a click on a square
		// Add more documentation
		//*************************************************************************
		$('.square').live('click',function(){
			square_coords = parseCoords($(this));

			if ($('.selected')[0]){
				$el = $('.selected')[0];
				checker_coords = parseCoords($('.selected').parent());
				$class = $('.selected').attr('class').split(' ')[1];

				if (!elementAt(square_coords))
					if (valid_move(checker_coords, square_coords)){
						$el2 = $el;
						board[checker_coords[0]][checker_coords[1]] = null;
						board[square_coords[0]][square_coords[1]] = $class;
						$("#"+square_coords[0]+"_"+square_coords[1]).append($el2);
						
					}
			}
				
				
		})
	})

	//*************************************************************************
	// Checks to see if the move being attempted is valid
	//*************************************************************************
	valid_move = function(checker_coords, square_coords) {
		x1 = Math.abs(checker_coords[0]);y1 = Math.abs(checker_coords[1]);x2 = Math.abs(square_coords[0]);y2 = Math.abs(square_coords[1]);
		c = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
		
		x_mid = (x1+x2)/2;
		y_mid = Math.floor((y1+y2)/2);
		
		possible_move = ( (c < 2 && c > 1) );
		possible_move = possible_move || isJumping(x_mid,y_mid,c);
		
		right_dir = false;
		
		if ($turn == 'red')
			right_dir = (x2 < x1);
		else
			right_dir = (x2 > x1);
				
		if ( possible_move && right_dir){
			successfulTurn();
			return true;
		}
		else return false;
	}
	
	//*************************************************************************
	// Checks to see if user is trying a jump move
	//*************************************************************************
	isJumping = function(x_mid, y_mid, c) {
		if (c > 2 && c < 3)
			if ( board[x_mid][y_mid] == 'red' || board[x_mid][y_mid] == 'black') {
				//also check to make sure not jumping self
				
				if ($turn == 'red'){
					$p1score++;
					$('#p1 span').html($p1score)
				} else {
					$p2score++;	
					$('#p2 span').html($p2score)
				}
	
				board[x_mid][y_mid] = null;
				$('#'+x_mid+"_"+y_mid).html('');
				return true;
			}
		return false;
	}

	//*************************************************************************
	// Checks the board to see if a checker is there
	//*************************************************************************
	
	elementAt = function(coords) {
		return board[coords[0]][coords[1]];
	}

	//*************************************************************************
	// Parses an id into coordinates (eg: "3_4")
	//*************************************************************************
	
	parseCoords = function(el) {
		return el.attr('id').split('_');
	}

	//*************************************************************************
	// Registers a successful turn
	// Switches to the next player
	//*************************************************************************
	
	successfulTurn = function() {
		if ($turn == 'red') $turn = 'black';
		else $turn = 'red';
		$('#turn p').html($turn);
		$('.selected').removeClass('selected');
	}

	//*************************************************************************
	// Resets scores to 0
	//*************************************************************************
	resetScores = function() {
		$('.score span').html('0');	
		$p1score = $p2score = 0;
	}
	
	//*************************************************************************
	//  Initializes the board
	//  Build the checker board
	//*************************************************************************
	initBoard = function(){
		for (i = 0; i < 8; i ++){
			for (j = 0; j < 8; j++) {
				$el = $('<div class="square"></div>');
				if (i%2 == j%2) $el.addClass('red');
				$id = i.toString()+"_"+j.toString();
				$el.attr('id',$id);
				$('#board').append($el);	
			}
		}
	}
	
	//*************************************************************************
	// Resets the board
	// Clears the board, replaces pieces
	//*************************************************************************
	resetBoard = function() {
		board = new Array(8);
		$('.square').html('');
		$turn = 'red';
		$('#turn p').html($turn);
		for (i = 0; i < 8; i++)
			board[i] = new Array(8);
						
		for (i = 0; i < 8; i++){
			for (j = 0; j < 3; j++){
				
				$id = j.toString()+"_"+i.toString();
				$el = $('<div class="checker black"></div>');
				$('#'+$id+'.square').append($el);
				board[j][i] = 'black';
				
				$id = (7-j).toString()+"_"+i.toString();
				$el2 = $('<div class="checker red"></div>');
				$('#'+$id+'.square').append($el2);
				board[7-j][i] = "red";
			}
		}	
	}