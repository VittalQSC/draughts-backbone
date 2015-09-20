$(function(){
    window.App = {
        Models: {},
        Views: {},
        Collections: {}
    };


    App.Models.Step = Backbone.Model.extend({
        default: {
            index: 1,
            white: {
                from: 1,
                to: 1,
                whitePosition: {
                    whites: [],
                    whiteQueens: [],
                    blacks: [],
                    blackQueens: []
                }
            },
            black: {
                from: 1,
                to: 1,
                blackPosition: {
                    whites: [],
                    whiteQueens: [],
                    blacks: [],
                    blackQueens: []
                }
            }
        }
    });

    App.Collections.Board = Backbone.Collection.extend({
        model: App.Models.Step
    });

    App.Views.Game = Backbone.View.extend({
        brdSize: 8,
        initialize: function () {
            this.createBoard(this.brdSize);

            this.collection.add(new App.Models.Step({
                index: 1,
                white: {
                    from: 1,
                    to: 2,
                    position: {
                        whites: [1,2,3,4,5,6,7,8,9,10,11,12],
                        whiteQueens: [13],
                        blacks: [32,31,30,29,28,27,26,25,24],
                        blackQueens: [15]
                    }
                },
                black: {
                    from: 3,
                    to: 4,
                    position: {
                        whites: [1,2,3,4,5],
                        whiteQueens: [6,9],
                        blacks: [],
                        blackQueens: [11,12,13]
                    }
                }
            }));
            this.collection.add(new App.Models.Step({
                index: 2,
                white: {
                    from: 5,
                    to: 6,
                    whitePosition: {
                        whites: [],
                        whiteQueens: [],
                        blacks: [],
                        blackQueens: []
                    }
                },
                black: {
                    from: 8,
                    to: 7,
                    blackPosition: {
                        whites: [],
                        whiteQueens: [],
                        blacks: [],
                        blackQueens: []
                    }
                }
            }));


            this.fillGameStepsSidebar();
            this.render(1,'white');
        },
        fillGameStepsSidebar: function(){
            for(var i = 0; i < this.collection.length; i++) {
                this.insertHalfStepsIntoStepsSidebar(this.collection.at(i));
            }
        },
        insertHalfStepsIntoStepsSidebar: function(step){
            var halfSteps = this.determineStep(step);
            $('#game-steps').append('<li id="' + step.get('index') + '-step" class="step">'+halfSteps.whiteHalfStep+'</li>');
            $('#game-steps').append('<li id="' + step.get('index') + '-step" class="step">'+halfSteps.blackHalfStep+'</li>');
        },
        determineStep: function(step) {
            var answer = {
                whiteHalfStep: {},
                blackHalfStep: {}
            };
            var color = ['white','black'];
            for(var i = 0; i < 2; i++) {
                var firstCoordinate = step.get(color[i]).from;
                var secondCoordinate = step.get(color[i]).to;

                var coordinate = this.convert10x10to8x8(firstCoordinate);
                var firstVerticalCoordinate = coordinate.verticalCoordinate;
                //and here 9k
                var firstHorizontalCoordinate = coordinate.horizontalCoordinate;

                coordinate = this.convert10x10to8x8(secondCoordinate);
                var secondVerticalCoordinate = coordinate.verticalCoordinate;
                //and here 9k
                var secondHorizontalCoordinate =  coordinate.horizontalCoordinate;

                var halfStep = firstHorizontalCoordinate.toString() + firstVerticalCoordinate.toString() + "-"
                    + secondHorizontalCoordinate.toString() + secondVerticalCoordinate.toString();
                if(color[i] === 'white') answer.whiteHalfStep = halfStep;
                else if(color[i] === 'black') answer.blackHalfStep = halfStep;
            }
            return answer;
        },
        convert10x10to8x8: function(coordinate10x10){
            //hor array just a wow mind games 9k
            var hor = ['A','C','E','G','B','D','F','H'];
            var verticalCoordinate = Math.floor((coordinate10x10-1)/4) + 1;
            //and here 9k
            var horizontalCoordinate = hor[(coordinate10x10-1)%8];
            return {
                verticalCoordinate: verticalCoordinate,
                horizontalCoordinate: horizontalCoordinate
            };
// 9 3A
        },
        convert8x8to10x10: function(coordinate8x8){
            // is not working now
        },
        createBoard: function(brdSize) {
            var firstSquareIsWhite;
            for(var i = brdSize; i >= 1; i--) {
                $('#draughts-board').append('<div id="'+ i +'-row" class="'+ this.getRowClassName() +'"></div>');
                firstSquareIsWhite = (i % 2 == 0);
                for(var j = 1; j < brdSize + 1; j++) {
                    var squareColor = this.determineSquareColor(firstSquareIsWhite,j);
                    var squareCoordinate =  this.determineSquareCoordinate(i,j);
                    var squareClassName = this.getSquareClassName(squareCoordinate);
                    if(squareColor === 'black')
                        $('#'+ i +'-row').append('<div id="'+ squareCoordinate +'-square" class="' + squareClassName + ' '+squareColor+'-square"></div>');
                    else
                        $('#'+ i +'-row').append('<div class="' + squareClassName + ' '+squareColor+'-square"></div>');
                }
            }
        },
        determineSquareColor: function (firstSquareIsWhite,j){
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
        determineSquareCoordinate: function(i,j) {
            return i.toString() + String.fromCharCode(64+j);
        },
        getSquareClassName: function(squareCoordinate) {
            return 'board8x8-square';
        },
        getRowClassName: function() {
            return 'row8x8';
        },
        events: {
            "click #next-step"   : "nextStep",
            "click #prev-step"   : "prevStep"
        },
        colorCurrentStep: function(){
            $('.step').removeClass('curr-step');
            if(this.collection.currStepNum != 0) {
                $('#'+ this.collection.currStepNum +'-step').addClass('curr-step');
            }
        },
        nextStep: function(){
            if(this.collection.currStepNum < this.collection.length - 1) this.collection.currStepNum++;
            this.render();
        },
        prevStep: function(){
            if(this.collection.currStepNum > 0) this.collection.currStepNum--;
            this.render();
        },
        putFigure: function (coordinate10x10, className) {
            var coordinate8x8 = this.convert10x10to8x8(coordinate10x10);
            //console.log(coordinate8x8.verticalCoordinate+coordinate8x8.horizontalCoordinate + " : " + className);
            $('#'+coordinate8x8.verticalCoordinate+coordinate8x8.horizontalCoordinate+'-square').addClass(className);
        },
        render: function(index, playerColor){
            var playerPosition = this.collection.at(index-1).get(playerColor).position;

            var whites = playerPosition.whites;
            var blacks = playerPosition.blacks;
            var whiteQueens = playerPosition.whiteQueens;
            var blackQueens = playerPosition.blackQueens;

            for(var i = 0; i < whites.length; i++) {
                this.putFigure(whites[i],'white-figure');
            }
            for(var i = 0; i < blacks.length; i++) {
                this.putFigure(blacks[i],'black-figure');
            }
            for(var i = 0; i < whiteQueens.length; i++) {
                this.putFigure(whiteQueens[i],'white-queen');
            }
            for(var i = 0; i < blackQueens.length; i++) {
                this.putFigure(blackQueens[i],'black-queen');
            }
        },
        determineFigure: function(square) {
            if(square == 1) return "white-figure";
            else if(square == 2) return "black-figure";
            else if(square == 3) return "white-queen";
            else if(square == 4) return "black-queen";
            else if(square == 0) return "empty";
            else return "empty";
         }
    });

    App.Views.Game10x10 = App.Views.Game.extend({
        brdSize: 10,
        determineSquareCoordinate: function(i,j) {
            return 5*(i - 1) + Math.ceil(j/2);
        },
        getSquareClassName: function(squareCoordinate) {
            return 'board10x10-square';
        },
        getRowClassName: function() {
            return 'row10x10';
        },
        determineStep: function(step) {
            var answer = {
                whiteHalfStep: {},
                blackHalfStep: {}
            };
            var color = ['white','black'];
            for(var i = 0; i < 2; i++) {
                var firstCoordinate = step.get(color[i]).from;
                var secondCoordinate = step.get(color[i]).to;
                var halfStep = firstCoordinate.toString() + "-"
                    + secondCoordinate.toString();
                if(color[i] === 'white') answer.whiteHalfStep = halfStep;
                else if(color[i] === 'black') answer.blackHalfStep = halfStep;

            }
            return answer;
        },
        putFigure: function (coordinate10x10, className) {
            $('#'+coordinate10x10.toString()+'-square').addClass(className);
        }
    });

    App.Views.Game8x8 = App.Views.Game.extend({
    });


    var game_positions = new App.Collections.Board();

    window.draughts_board_demonstration = new App.Views.Game8x8({collection: game_positions, el: '#draughts-board-demonstration'});
    //window.draughts_board_demonstration = new App.Views.Game10x10({collection: game_positions, el: '#draughts-board-demonstration'});


});