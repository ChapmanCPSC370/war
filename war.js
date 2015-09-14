/* Nicholas Corder - corde116@mail.chapman.edu
 * A javascript project that runs a game of war simulation between two players
 *   and prints out statistics to the console.
 */
 
var card_value_arr = [ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ];
var suit_value_arr = [ "S", "D", "H", "C" ];
var player_one_wins = 0;
var player_two_wins = 0;

function Card(value, suit) {
	this.value = value;
	this.suit = suit;
	this.get_card = function() {
		return this.value + " " + this.suit;
	}
}

function Simulation() {
	this.num_simulations = 256;
	this.num_wars = 0;
	this.p_one_wins = 0;
	this.p_two_wins = 0;
	this.num_ties = 0;
	
	/* puts cards into a deck */
	this.init_deck = function() {
		var deck = [];
		for( var i = 0; i < card_value_arr.length; ++i ){
			for( var j = 0; j < 4; ++j ){
				deck.push(new Card(card_value_arr[i], suit_value_arr[j]));
			}
		}
		return deck;
	}
	
	/* shuffles cards by choosing two random numbers and swaping their places */
	this.shuffle_cards = function() {
		var tracker_values_arr = this.init_deck();
		var shuffle_amount = Math.floor(Math.random() * 500 + 1);
		while( shuffle_amount != 0 ){
			var i = Math.floor(Math.random() * tracker_values_arr.length);
			var j = Math.floor(Math.random() * tracker_values_arr.length);
			var tmp_card_holder = tracker_values_arr[i];
			tracker_values_arr[i] = tracker_values_arr[j];
			tracker_values_arr[j] = tmp_card_holder;
			shuffle_amount--;
		}
		return tracker_values_arr;
	}
	
	/* decides who won the war */
	this.play_war = function( p_one_card, p_two_card ) {
		if( p_one_card.value > p_two_card.value )
			return 1;
		else if( p_one_card.value < p_two_card.value )
			return 2;
		else
			return 0;
	}
	
	/* starts the simulation */
	this.play = function() {
		var num_games = this.num_simulations;
		while( num_games != 0 ){
			var deck = this.shuffle_cards();
			var p_one_deck = deck.slice(0, deck.length/2);
			var p_two_deck = deck.slice(deck.length/2, deck.length);
			var pile = [];
			while( true ) {
				pile.push( p_one_deck.pop() );
				pile.push( p_two_deck.pop() );
				switch( this.play_war(pile[ pile.length - 2 ], pile[ pile.length - 1]) ) {
					case 1:
						p_one_deck.splice(0, 0, pile);
						pile = [];
						break;
					case 2:
						p_two_deck.splice(0, 0, pile);
						pile = [];
						break;
					case 0:
					default:
						/* when a war occurs you put two cards down. This accounts for one, and when the loop
						 * re-runs, it will acount for the next. We need to check for a win condition (if the other player has 0
						 * cards for a war, then you automatically win, or if you both have less than 2 cards for a war, you tie
						 */
						if(p_one_deck.length > 1 && p_two_deck.length != 0)
							pile.push( p_one_deck.pop() );
						if(p_two_deck.length > 1 && p_one_deck.length != 0)
							pile.push( p_two_deck.pop() );
						this.num_wars++;
						break;
				}
				/* check for win condition */
				if( p_one_deck.length == 0 && p_two_deck.length != 0 ){
					this.p_two_wins++;
					break;                                  
				} else if( p_one_deck.length != 0 && p_two_deck.length == 0 ){
					this.p_one_wins++;
					break;
				} else if( p_one_deck.length == 0 && p_two_deck.length == 0 ){
					this.num_ties++;
					break;
				}
			}
			num_games--;
		}
	}
	
	this.print_statistics = function() {
		console.log( "player one win percentage: " + ((this.p_one_wins/this.num_simulations) * 100) + "%\n"
			+ "player two win percentage: " + ((this.p_two_wins/this.num_simulations) * 100) + "%\n"
			+ "perentage of ties: " + ((this.num_ties/this.num_simulations) * 100) + "%\n"
			+ "number of wars per game: " + (this.num_wars/this.num_simulations) );
	}
}
 	 
var game = new Simulation();
game.play();
game.print_statistics();