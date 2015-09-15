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
                    to: 1,
                    whitePosition: {
                        whites: [1,2,3,4,5],
                        whiteQueens: [6,7],
                        blacks: [8,9,10],
                        blackQueens: [11,12,13]
                    }
                },
                black: {
                    from: 3,
                    to: 4,
                    blackPosition: {
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
            //this.render();
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
            //hor array just a wow mind games 9k
            var hor = ['B','D','F','H','A','C','E','G'];
            for(var i = 0; i < 2; i++) {
                var firstCoordinate = step.get(color[i]).from;
                var secondCoordinate = step.get(color[i]).to;
                var firstVerticalCoordinate = Math.floor(Math.floor(firstCoordinate/4) + 1);
                //and here 9k
                var firstHorizontalCoordinate = hor[firstCoordinate%9-1];
                var secondVerticalCoordinate = Math.floor( Math.floor(secondCoordinate/4) + 1);
                //and here 9k
                var secondHorizontalCoordinate =  hor[secondCoordinate%9-1];
                var halfStep = firstHorizontalCoordinate.toString() + firstVerticalCoordinate.toString() + "-"
                    + secondHorizontalCoordinate.toString() + secondVerticalCoordinate.toString();
                if(color[i] === 'white') answer.whiteHalfStep = halfStep;
                else if(color[i] === 'black') answer.blackHalfStep = halfStep;
            }
            return answer;
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
        render: function(){
            var currPosition = this.collection.at(this.collection.currStepNum);
            for(var i = 0; i < 32; i++) {
                var figure = this.determineFigure(currPosition.get("position")[i]);
                if(figure != "empty")
                    this.$el.find('.'+i+'-mark').addClass(figure);
                else {
                    this.$el.find('.'+i+'-mark').removeClass("white-figure white-queen black-figure black-queen");
                }
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
            return 5*(i - 1) + Math.ceil(Math.floor(j/2));
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
        }
    });

    App.Views.Game8x8 = App.Views.Game.extend({
    });


    var game_positions = new App.Collections.Board();

    //window.draughts_board_demonstration = new App.Views.Game({collection: game_positions, el: '#draughts-board-demonstration'});
    window.draughts_board_demonstration = new App.Views.Game8x8({collection: game_positions, el: '#draughts-board-demonstration'});


});