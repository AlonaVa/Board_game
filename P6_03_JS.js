const container = $('#container');
let unit = ('<div/>');
let availability = 'availability';
let player1 = $('.player1');
let player2 = $('.player2');
let header = $('#player-turn');
let turnColor = 'blue';
let turn2Color = 'orange';
let arrayOfgridsBetween = [];
let turn = player1;
let turn2 = player2;
let text = ' Player 1 it is your turn!';
let turnClass = 'player1';
let turn2Class = 'player2';
turn.power = 0;
turn2.power = 0;
turn.lifePoints = 100;
turn2.lifePoints = 100;
player1.protect = false;
player2.protect = false;
turn.protect = player1.protect;
turn2.protect = player2.protect;

//create empty grid-map
function makeGrid(rows, cols) {
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      unit = $("<div class='grid-item'></div>");
      //unit.text(x * 10 + y); -- add numbers to grids
      unit.attr('id', x * 10 + y);
      unit.prop(availability, 'empty');
      unit.appendTo(container);
    }
  }
};

//
function getRandomCell(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//
function locateObject(object) {
  let idRandomCell = getRandomCell(0, 99);
  let idLeftCell = idRandomCell - 1;
  let idRightCell = idRandomCell + 1;
  let idUpCell = idRandomCell + 10;
  let idDownCell = idRandomCell - 10;
  if ($('#' + idRandomCell).prop(availability) !== 'unavailable' &&
    $('#' + idLeftCell).prop(availability) !== 'unavailable' &&
    $('#' + idRightCell).prop(availability) !== 'unavailable' &&
    $('#' + idUpCell).prop(availability) !== 'unavailable' &&
    $('#' + idDownCell).prop(availability) !== 'unavailable') {
    $('#' + idRandomCell).addClass(object);
    $('#' + idRandomCell).prop(availability, 'unavailable');
  }
  else {
    locateObject(object);
  }
}

//create map with objects
function createMap() {
  locateObject('player1');
  locateObject('player2');
  locateObject('tomato');
  locateObject('corn');
  locateObject('onion');
  locateObject('cabbage');
}

//chek if all grids if array are available
const gridIsEmpty = (gridId) => $('#' + gridId).prop(availability) !== 'unavailable';
//chek if numbers of IDes of grids in array do not end with 9
const gridDoesntEnd9 = (gridId) => Number(gridId) % 10 !== 9;

// click functions for defend/attack activation
$("#player1-defend").on('click', function () {
  player1.protect = (player1.protect) ? false : true;
})
$("#player2-defend").on('click', function () {
  player2.protect = (player2.protect) ? false : true;
})

// change players
function setNextPlayer() {
  if (turn == player1) {
    turn = player2;
    turn2 = player1;
    text = 'Player 2 it is your turn!';
    turnClass = 'player2';
    turn2Class = 'player1';
    turnColor = 'orange';
    turn2Color = 'blue';
    turn.protect = player2.protect;
    turn2.protect = player1.protect;
    $("#player1-defend").prop('disabled', true);
    $("#player2-defend").prop('disabled', false);
  } else {
    turn = player1;
    turn2 = player2;
    text = 'Player 1 it is your turn!';
    turnClass = 'player1';
    turn2Class = 'player2';
    turnColor = 'blue';
    turn2Color = 'orange';
    turn.protect = player1.protect;
    turn2.protect = player2.protect;
    $("#player1-defend").prop('disabled', false);
    $("#player2-defend").prop('disabled', true);
  }
  return turn, text, turnClass, turn2, turn2Class, turn.protect, turn2.protect;
}

//
function movePlayers() {
  //change header text and color
  header.text(text);
  header.css('color', turnColor);
  // 
  $(".grid-item").click(function () {
    let playerId = $('.' + turnClass).attr('id');
    let playerNewID = $(this).attr('id');
    let idDifference = playerNewID - playerId;
    let decadeOfIdDifference = idDifference / 10;
    arrayOfgridsBetween = [];
    // create array of IDes of grids between start and final position of the player
    if (idDifference > 1 && idDifference < 4) {
      for (let i = 1; i < idDifference; i++) {
        arrayOfgridsBetween.push(String(Number(playerId) + i));
      }
    }
    if (idDifference < -1 && idDifference > -4) {
      for (let i = 1; i < (Math.abs(idDifference)); i++) {
        arrayOfgridsBetween.push(String(Number(playerId) - i));
      }
    }
    if (idDifference == 20 || idDifference == 30) {
      for (let i = 1; i < decadeOfIdDifference; i++) {
        arrayOfgridsBetween.push(String(Number(playerId) + i * 10));
      }
    }
    if (idDifference == -20 || idDifference == -30) {
      for (let i = 1; i < Math.abs(decadeOfIdDifference); i++) {
        arrayOfgridsBetween.push(String(Number(playerId) - i * 10));
      }
    }
    //check if the final grid is not occupanted by the opponent
    if (
      ($(this).hasClass(turn2Class) == false) &&
      //check if the player chenged it's position
      ($(this).hasClass(turnClass) == false) &&
      // player can move from one to three boxes (horizontally or vertically)
      ((Math.abs(idDifference) > 4) ||
        (arrayOfgridsBetween.every(gridDoesntEnd9) == true)) &&
      ((idDifference !== 1) ||
        (Number(playerId) % 10 !== 9)) &&
      ((Math.abs(idDifference) <= 3) ||
        (Math.abs(idDifference) == 10) ||
        (Math.abs(idDifference) == 20) ||
        (Math.abs(idDifference) == 30))
    ) {
      // player can't pass through obstacles directly
      if (arrayOfgridsBetween.every(gridIsEmpty) == true) {
        // move weapon with the player if the final grid doesn't have another weapon
        // onion weapon - 40 power 
        if ($('.' + turnClass).hasClass('onion') == true &&
          $(this).hasClass('corn') == false &&
          $(this).hasClass('tomato') == false &&
          $(this).hasClass('cabbage') == false
        ) {
          $(this).addClass('onion');
          $('.' + turnClass).removeClass('onion');
          turn.power = 40;
        }
        // cabbage weapon 30 power
        if ($('.' + turnClass).hasClass('cabbage') == true &&
          $(this).hasClass('corn') == false &&
          $(this).hasClass('tomato') == false &&
          $(this).hasClass('onion') == false
        ) {
          $(this).addClass('cabbage');
          $('.' + turnClass).removeClass('cabbage');
          turn.power = 30;
        }
        // corn weapon 20 power
        if ($('.' + turnClass).hasClass('corn') == true &&
          $(this).hasClass('cabbage') == false &&
          $(this).hasClass('tomato') == false &&
          $(this).hasClass('onion') == false
        ) {
          $(this).addClass('corn');
          $('.' + turnClass).removeClass('corn');
          turn.power = 20;
        }
        // tomato weapon 50 power
        if ($('.' + turnClass).hasClass('tomato') == true &&
          $(this).hasClass('cabbage') == false &&
          $(this).hasClass('corn') == false &&
          $(this).hasClass('onion') == false
        ) {
          $(this).addClass('tomato');
          $('.' + turnClass).removeClass('tomato');
          turn.power = 50;
        }
        // check and update start grids availability
        if ($('.' + turnClass).hasClass('onion') == false &&
          $('.' + turnClass).hasClass('corn') == false &&
          $('.' + turnClass).hasClass('tomato') == false &&
          $('.' + turnClass).hasClass('cabbage') == false) {
          $('.' + turnClass).prop(availability, 'empty')
        }
        // add player class to the final grid and remove it from the start grid
        $('#' + playerId).toggleClass(turnClass);
        $(this).addClass(turnClass);
        $(this).prop(availability, 'unavailable');
        // add power of the new weapon
        if ($(this).hasClass('corn')) {
          turn.power = 20;
        }
        if ($(this).hasClass('cabbage')) {
          turn.power = 30;
        }
        if ($(this).hasClass('onion')) {
          turn.power = 40;
        }
        if ($(this).hasClass('tomato')) {
          turn.power = 50;
        }
      }
    }
    //check if the player changed it's position 
    if ($('.' + turnClass).attr('id') !== playerId) {
      // the battle
      //the player attacks
      // check if player in attack position
      if ((turn.protect == false) &&
        // check if players cross over adjacent squares (horizontally or vertically)
        (($(this).attr('id') == $('.' + turn2Class).attr('id') + 10) ||
          ($(this).attr('id') == $('.' + turn2Class).attr('id') - 10) ||
          ((Math.abs($(this).attr('id') - $('.' + turn2Class).attr('id')) == 1) &&
            ($(this).attr('id') % 10 !== 9) && ($('.' + turn2Class).attr('id') % 10 !== 9))
        )) {
        // check if the opponent has defend
        if (turn2.protect == true) {
          // calculate life points
          turn2.lifePoints = turn2.lifePoints - turn.power / 2
        }
        else {
          turn2.lifePoints = turn2.lifePoints - turn.power
        }
      }
      // update score table
      $('#life-points').text(turnClass + ':' + turn.lifePoints + ', ' + turn2Class + ':' + turn2.lifePoints);
      // check if the player win
      if (turn2.lifePoints < 1) {
        alert('Game over: ' + turnClass + ' win')
      }
      else {
        // the opponent attacks
        // check if the opponent is in attack position
        if ((turn2.protect == false) &&
          //check if players cross over adjacent squares (horizontally or vertically)
          (($(this).attr('id') == $('.' + turn2Class).attr('id') + 10) ||
            ($(this).attr('id') == $('.' + turn2Class).attr('id') - 10) ||
            ((Math.abs($(this).attr('id') - $('.' + turn2Class).attr('id')) == 1) &&
              ($(this).attr('id') % 10 !== 9) && ($('.' + turn2Class).attr('id') % 10 !== 9))
          )) {
          // calculate life points
          if (turn.protect == true) {
            turn.lifePoints = turn.lifePoints - turn2.power / 2
          }
          else { turn.lifePoints = turn.lifePoints - turn2.power }
        }
        // update score text
        $('#life-points').text(turn.lifePoints);
        $('#life-points').css('color', turnColor);
        $('#life-points2').text(turn2.lifePoints);
        $('#life-points2').css('color', turn2Color);
        // check if the opponent win
        if (turn.lifePoints < 1) {
          alert('Game over: ' + turnClass + ' win')
        }
        else {
          //change the players
          setNextPlayer();
          // update header information about turn and its color
          header.text(text);
          header.css('color', turnColor);
          // text players properties
          console.log(turnClass + ' power = ' + turn.power);
          console.log(turn2Class + ' power = '  + turn2.power);
          console.log('player1 protect: ' + player1.protect);
          console.log('player2 protect: ' + player2.protect);
        }
      }
    }
  });
}


makeGrid(10, 10);
createMap();
movePlayers();