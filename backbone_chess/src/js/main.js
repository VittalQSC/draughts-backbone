$(function(){
    window.App = {
        Models: {},
        Views: {},
        Collections: {}
    };


    function determineSquareColor(firstSquareIsWhite,j){
        if(firstSquareIsWhite)
            if( j % 2 != 0)
                return "white";
            else
                return "black";
        else if(!firstSquareIsWhite)
            if(j % 2 != 0)
                return "black";
            else
                return "white";

    }

    var firstSquareIsWhite;
    var squareColor;
    for(var i = 8; i > 0; i--) {
        $('#draughts-board').append('<div id="'+ i +'-row" class="row"></div>');

        if(i % 2 == 0)
            firstSquareIsWhite = true;
        else
            firstSquareIsWhite = false;

        for(var j = 1; j < 9; j++) {
            var squareColor = determineSquareColor(firstSquareIsWhite,j);
            var squareCoordinate =  i.toString() + String.fromCharCode(64+j);
            $('#'+ i +'-row').append('<div id="'+ squareCoordinate +'-square" class="board-square '+squareColor+'-square"></div>');
        }
    }

});