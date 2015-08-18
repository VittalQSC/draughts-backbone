$(function(){
    window.App = {
        Models: {},
        Views: {},
        Collections: {}
    };


    App.Models.Step = Backbone.Model.extend({
        default: {
            position: '[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]'
        }
    });

    App.Collections.Board = Backbone.Collection.extend({ model: App.Models.Step });

    App.Views.Game = Backbone.View.extend({
        initialize: function () {
            this.createBoard();
            this.on('click #next-step');
            this.collection.add(new App.Models.Step([1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2]));
            this.collection.add(new App.Models.Step([1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,2,2,2,2,0,2,2,2,2,2,2,2,2]));
            this.collection.add(new App.Models.Step([1,1,1,1,1,1,1,1,0,1,1,1,1,0,0,0,0,0,0,2,2,2,2,0,2,2,2,2,2,2,2,2]));
            this.render();
        },
        createBoard: function() {
            var firstSquareIsWhite;
            var markForBlackSquares = 0;
            for(var i = 8; i > 0; i--) {
                $('#draughts-board').append('<div id="'+ i +'-row" class="row"></div>');
                if(i % 2 == 0)
                    firstSquareIsWhite = true;
                else
                    firstSquareIsWhite = false;
                for(var j = 1; j < 9; j++) {
                    var squareColor = this.determineSquareColor(firstSquareIsWhite,j);
                    var squareCoordinate =  i.toString() + String.fromCharCode(64+j);
                    $('#'+ i +'-row').append('<div id="'+ squareCoordinate +'-square" class="board-square '+squareColor+'-square"></div>');
                    if(squareColor === 'black') {
                        $('#' + squareCoordinate+'-square').addClass(markForBlackSquares + "-mark");
                        markForBlackSquares++;
                    }
                }
            }
        },
        determineSquareColor: function determineSquareColor(firstSquareIsWhite,j){
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

    },
        el: '#draughts-board-demonstration',
        events: {
            "click #next-step" : "nextStep",
            "click #prev-step" : "prevStep"
        },
        currStepNum: 0,
        nextStep: function(){
            if(this.currStepNum < this.collection.length - 1) this.currStepNum++;
            this.render();
        },
        prevStep: function(){
            if(this.currStepNum > 0) this.currStepNum--;
            this.render();
        },
        render: function(){
            var currPosition = this.collection.at(this.currStepNum);
            for(var i = 0; i < 32; i++) {
                var figure = this.determineFigure(currPosition.get(i)); 
                if(figure != "undefined" && figure != "empty")
                    this.$el.find('.'+i+'-mark').addClass(figure);
                else {
                    this.$el.find('.'+i+'-mark').removeClass("white-figure white-queen black-figure black-queen");
                }
            }
        },
        determineFigure: function(square) {
            if(square == 1) return "white-figure";
            else if(square == 2) return "black-figure"
            else if(square == 3) return "white-queen"
            else if(square == 4) return "black-queen"
            else if(square == 0) return "empty";
            else return "empty";
         }
    });

    var game_positions = new App.Collections.Board();

    window.draughts_board_demonstration = new App.Views.Game({collection: game_positions});


});