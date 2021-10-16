import { Cell } from "./Cell.js";
import { Board } from "./Board.js";



let pattern = [[0,1,0],
                        [0,1,1],
                        [0,1,0]];
        let board = new Board(20,30);
        console.log(board);
        document.querySelector('body').append(board.node);
        board.displayPattern(pattern,250);