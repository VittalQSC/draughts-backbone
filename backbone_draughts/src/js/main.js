$(function(){
    window.App = {
        Models: {},
        Views: {},
        Collections: {}
    };


    App.Models.PlyDTO  = Backbone.Model.extend({
        default: {
            index: 1,
            commentBefore: 'commentBefore',
            commentAfter: 'commentAfter',
            rate: 'rate',
            whiteSide: true,
            from: 22,
            to: 18,
            position: {
                whites: [],
                whiteKings: [],
                blacks: [],
                blackKings: []
            },
            alternatives: []
        }
    });

    App.Collections.Board = Backbone.Collection.extend({
        model: App.Models.PlyDTO
    });

    App.Views.Game = Backbone.View.extend({
        brdSize: 8,
        currentStep: 1,
        initialize: function () {
            this.createBoard(this.brdSize);

            this.collection.add(new App.Models.PlyDTO({
                index: 1,
                commentBefore: 'commentBefore',
                commentAfter: 'commentAfter',
                rate: 'rate',
                whiteSide: true,
                from: 22,
                to: 18,
                position: {
                    whites: [1,2,3,4,5,6,7,8,9,10,11,12],
                    whiteKings: [],
                    blacks: [32,31,30,29,28,27,26,25,24,23,22,21],
                    blackKings: []
                },
                alternatives: []
            }));
            this.collection.add(new App.Models.PlyDTO({
                index: 2,
                commentBefore: 'commentBefore',
                commentAfter: 'commentAfter',
                rate: 'rate',
                whiteSide: true,
                from: 9,
                to: 13,
                position: {
                    whites: [1,2,3,4,5,6,7,8,13,10,11,12],
                    whiteKings: [],
                    blacks: [32,31,30,29,28,27,26,25,24,23,22,21],
                    blackKings: []
                },
                alternatives: []
            }));
            this.collection.add(new App.Models.PlyDTO({
                index: 3,
                commentBefore: 'commentBefore',
                commentAfter: 'commentAfter',
                rate: 'rate',
                whiteSide: false,
                from: 21,
                to: 19,
                position: {
                    whites: [1,2,3,4,5,6,7,8,13,10,11,12],
                    whiteKings: [],
                    blacks: [32,31,30,29,28,27,26,25,24,23,22,18],
                    blackKings: []
                },
                alternatives: []
            }));
            this.collection.add(new App.Models.PlyDTO({
                index: 4,
                commentBefore: 'commentBefore',
                commentAfter: 'commentAfter',
                rate: 'rate',
                whiteSide: false,
                from: 0,
                to: 0,
                position: {
                    whites: [],
                    whiteKings: [2,3,4,5],
                    blacks: [],
                    blackKings: [9,10,11,14]
                },
                alternatives: []
            }));


            this.fillGameStepsSidebar();
            this.render(1,this.collection.at(0).attributes.whiteSide);
        },
        fillGameStepsSidebar: function () {
            for(var i = 0; i < this.collection.length; i++) {
                this.insertPlyIntoStepsSidebar(this.collection.at(i).attributes);
            }
        },
        insertPlyIntoStepsSidebar: function (ply) {
            var listEl = this.determineListEl(ply);
            $('#game-steps').append('<li id="' + ply.index + '-step" class="step">'+ listEl +'</li>');
        },
        determineListEl: function (ply) {
            var from = this.convert10x10to8x8(ply.from);
            var to = this.convert10x10to8x8(ply.to);
            return from.horizontalCoordinate + from.verticalCoordinate + " - " + to.horizontalCoordinate + to.verticalCoordinate;
        },
        convert10x10to8x8: function (coordinate10x10) {
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
        convert8x8to10x10: function (coordinate8x8) {
            // is not working now
        },
        createBoard: function (brdSize) {
            var firstSquareIsWhite;
            for(var i = brdSize; i >= 1; i--) {
                $('#draughts-board').append('<div id="'+ i +'-row" class="'+ this.getRowClassName() +'"></div>');
                firstSquareIsWhite = (i % 2 == 0);
                for(var j = 1; j < brdSize + 1; j++) {
                    var squareColor = this.determineSquareColor(firstSquareIsWhite,j);
                    var squareCoordinate =  this.determineSquareCoordinate(i,j);
                    var squareClassName = this.getSquareClassName();
                    if(squareColor === 'black')
                        $('#'+ i +'-row').append('<div id="'+ squareCoordinate +'-square" class="' + squareClassName + ' '+squareColor+'-square"></div>');
                    else
                        $('#'+ i +'-row').append('<div class="' + squareClassName + ' '+squareColor+'-square"></div>');
                }
            }
        },
        determineSquareColor: function (firstSquareIsWhite,j) {
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
        determineSquareCoordinate: function (i,j) {
            return i.toString() + String.fromCharCode(64+j);
        },
        getSquareClassName: function () {
            return 'board8x8-square';
        },
        getRowClassName: function () {
            return 'row8x8';
        },
        events: {
            "click #next-step"   : "nextStep",
            "click #prev-step"   : "prevStep",
        },
        nextStep: function () {
            if(this.currentStep < this.collection.length) {
                    ++this.currentStep
                    var currentIndex = this.currentStep - 1;
                    this.render(this.currentStep, this.collection.at(currentIndex).attributes.whiteSide);
            }
        },
        prevStep: function () {
            if(this.currentStep > 1) {
                --this.currentStep
                var currentIndex = this.currentStep - 1;
                this.render(this.currentStep, this.collection.at(currentIndex).attributes.whiteSide);
            }
        },
        putFigure: function (coordinate10x10, className) {
            var coordinate8x8 = this.convert10x10to8x8(coordinate10x10);
            $('#'+coordinate8x8.verticalCoordinate+coordinate8x8.horizontalCoordinate+'-square').addClass(className);
        },
        clearSquare: function (i) {
            var coordinate8x8 = this.convert10x10to8x8(i);
            $('#'+coordinate8x8.verticalCoordinate+coordinate8x8.horizontalCoordinate+'-square').removeClass('white-figure');
            $('#'+coordinate8x8.verticalCoordinate+coordinate8x8.horizontalCoordinate+'-square').removeClass('black-figure');
            $('#'+coordinate8x8.verticalCoordinate+coordinate8x8.horizontalCoordinate+'-square').removeClass('white-queen');
            $('#'+coordinate8x8.verticalCoordinate+coordinate8x8.horizontalCoordinate+'-square').removeClass('black-queen');
        },
        render: function (index, whitePly) {
            var playerPosition = this.collection.at(index-1).attributes.position;
            var whites = playerPosition.whites;
            var blacks = playerPosition.blacks;
            var whiteKings = playerPosition.whiteKings;
            var blackKings = playerPosition.blackKings;
            for(var i = 1; i <= this.brdSize*this.brdSize/2; i++) {
                this.clearSquare(i);
            }

            for(var i = 0; i < whites.length; i++) {
                this.putFigure(whites[i],'white-figure');
            }
            for(var i = 0; i < blacks.length; i++) {
                this.putFigure(blacks[i],'black-figure');
            }
            for(var i = 0; i < whiteKings.length; i++) {
                this.putFigure(whiteKings[i],'white-queen');
            }
            for(var i = 0; i < blackKings.length; i++) {
                this.putFigure(blackKings[i],'black-queen');
            }
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
        determineListEl: function(ply) {
            return ply.from + " - " + ply.to;
        },
        putFigure: function (coordinate10x10, className) {
            $('#'+coordinate10x10.toString()+'-square').addClass(className);
        },
        clearSquare: function (i) {
            $('#' + i + '-square').removeClass('white-figure');
            $('#' + i + '-square').removeClass('black-figure');
            $('#' + i + '-square').removeClass('white-queen');
            $('#' + i + '-square').removeClass('black-queen');
        }
    });

    App.Views.Game8x8 = App.Views.Game.extend({

    });


    var game_positions = new App.Collections.Board();

    //window.draughts_board_demonstration = new App.Views.Game10x10({collection: game_positions, el: '#draughts-board-demonstration'});
    window.draughts_board_demonstration = new App.Views.Game8x8({collection: game_positions, el: '#draughts-board-demonstration'});


});