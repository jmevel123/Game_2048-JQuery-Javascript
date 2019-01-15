var grid;
var score = 0;
var size;
var keepgoing= false;
var score = 0;
var bestScore = 0;
var audio = new Audio('schwifty.mp3');
audio.loop = true;
audio.muted=false;


///___________Creation du tableau_____________///

function createGrid(size)
{
;    
    var bigtab = [];
    for (var i =0; i<size ;i++){
		var smalltab= [];
        for (var j =0; j<size ;j++){
            smalltab.push(0);
		}
		bigtab.push(smalltab);

	}
;    return bigtab;
}
///___________Ajouter les chiffres dans les cells vides_____________///

function addNumber(grid)
{
    var options = [];
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			if (grid[i][j] === 0) {
				options.push({
					x: i,
					y: j
				});
			}
		}
	}
	/// Ajout du 4 et 2 random
	if (options.length > 0) {
		var spot = options[Math.floor(Math.random() * options.length)];
		var r = Math.random(1);
		grid[spot.x][spot.y] = r > 0.1 ? 2 : 4;
	}
}
///___________Print du tableau_____________///

function print_tab(grid) {
	$('#board').empty();
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			if (grid[i][j] != 0) {
				var divToAppend = "<div class='cell'>"+grid[i][j]+"</div>";
				$("#board").append(divToAppend).show('slow');
				applyBackground($('#board div:last-child'));
			}
			else
				$("#board").append("<div class='cell'></div>");
		}
	}
	$("#score").empty().append(score);
}
///___________Lancement du jeu_____________///

function init()
{
	audio.play();

	if (bestScore > readCookie('cookieScore'))
		bestScore = bestScore;
	else if (readCookie('cookieScore') > 0)
		bestScore = readCookie('cookieScore');
	

	createCookie('cookieScore',bestScore,30*60*60);

	size=$("#size").val();
	if(size ==8){
		$("#board").removeClass();		
		$("#board").addClass("board_8x8");
	}
	else if(size ==6){
		$("#board").removeClass();		
		$("#board").addClass("board_6x6");
	}
	else{
		$("#board").removeClass();		
		$("#board").addClass("board_4x4");
	}

	score = 0;
	$("#best_score").empty().append(bestScore);
    grid = createGrid(size);
    addNumber(grid);
    addNumber(grid);
    print_tab(grid);
	keepgoing= false;

}
// gestion des cookies
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}
///___________Classes pour changer le css des cells_____________///

function applyBackground(cell) {
	var value = $(cell).html();
	switch (value) {
		case "2":
			$(cell).addClass("val2");
			break;
		case "4":
			$(cell).addClass('val4');
			break;
		case "8":
			$(cell).addClass('val8');
			break;
		case "16":
			$(cell).addClass('val16');
			break;
		case "32":
			$(cell).addClass('val32');
			break;
		case "64":
			$(cell).addClass('val64');
			break;
		case "128":
			$(cell).addClass('val128');
			break;
		case "256":
			$(cell).addClass('val256');
			break;
		case "512":
			$(cell).addClass('val512');
			break;
		case "1024":
			$(cell).addClass('val1024');
			break;
		case "2048":
			$(cell).addClass('val2048');
			break;
		default:
			$(cell).addClass("occupied");
	}
}

function slide(row)
{
	// Renvoi d'un nouveau tableau où les zéros se placent à gauche
	var arr = row.filter(val => val);
	var missing = size - arr.length;
	var zeros = Array(missing).fill(0);
	arr = zeros.concat(arr);
	return arr;

}
// copie d'un tableau
function duplicate(grid) {
	var mirror = createGrid(size);
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			mirror[i][j] = grid[i][j];
		}
	}

	return mirror;
}

function compare(a, b) {
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			if (a[i][j] != b[i][j])
				return true;
		}
	}
	return false;
}

// Renvoi du tableau ou 2 chiffres de même valeur sont additionnés
function merge(row) {
	for (var i = size-1; i >= 1; i--) {
		var a = row[i];
		var b = row[i - 1];
		if (a == b) {
			row[i] = a + b;
			score += row[i];
			if (score > bestScore) {
				bestScore = score;
			}
			row[i-1] = 0;
		}
	}
	return row;
}

// Inversion du tableau [w, x, y, z] devient [z,y,x,w]
function flip(grid) {
	for (var i = 0; i < size; i++) {
		grid[i].reverse();
	}

	return grid;
}

// Rotation du tableau clockwise
function rotate(grid) {
	var newGrid = createGrid(size);

	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			newGrid[i][j] = grid[j][i];
		}
	}
	return newGrid;
}

// Déplacer puis additionner puis redéplacer
function slideAndMerge(row) {
	row = slide(row);
	row = merge(row);
	row = slide(row);
	return row;
}

function hasWon() {
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			if (grid[i][j] == 2048) {
				return true;
			}
		}
	}
	return false;
}

// Check s'il n'y a plus de 0 ou qu'il n'y a plus de possibilité d'additionner
function isGameOver() {
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			if (grid[i][j] == 0)
				return false;
			if (i !== size-1 && grid[i][j] === grid[i + 1][j])
				return false;
			if (j !== size-1 && grid[i][j] === grid[i][j + 1])
				return false;	
		}
	}
	return true;
}


function keypress(e) {
	var flipped = false;
	var rotated = false;
	var played = true;
	if (e.keyCode == 39) {
	}
	else if (e.keyCode == 37) {
		grid = flip(grid);

		flipped = true;
	}
	else if (e.keyCode == 40) {
		grid = rotate(grid);
		rotated = true;
	}
	else if (e.keyCode == 38) {
		grid = rotate(grid);
		grid = flip(grid);
		flipped = true;
		rotated = true;
	}
	else {
		played = false;
	}
		
	if (played) {
		var past = duplicate(grid);
		for (var i = 0; i < size; i++) {
			grid[i] = slideAndMerge(grid[i]);
		}

		var changed = compare(past, grid);
		if (flipped) {
			grid = flip(grid);
		}

		if (rotated) {
			grid = rotate(grid);
			grid = rotate(grid);
			grid = rotate(grid);
		}

		if (changed) {
			addNumber(grid);
			// bruit.play();
		}
		
		print_tab(grid);
		var gameover = isGameOver();
		var won = hasWon();
		if (gameover) {
			swal({
 				title: "Game Over!",
  				text: "You lost!",
  				icon: "warning",
  				button: "Keep it goin'!",
			});
		}
		if (won) {
			if(keepgoing ==false)
			{
			swal({
 				title: "Victory!",
  				text: "You won!",
  				icon: "success",
  				button: "Keep it goin'!",
			});
			keepgoing=true;
			}
		}

	}
}

function mute()
{
	if(audio.muted== false)
	{
		$(".mute").on("click",function(){
		audio.muted=true;
		})
	}
	else
		audio.muted=false;
	
}
$(document).ready(function() {
	init();
	$(document).keydown(function(e) {
		keypress(e);
	});


})

