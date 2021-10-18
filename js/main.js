import { Board } from "./Board.js";
import { Cell } from "./Cell.js";


let wrapper = document.querySelector('.wrapper');
let config = {
    parent: wrapper,
    nCells : 50000,//aproximado
    time: .5,
    pattern: [[0,1,0],[0,1,0],[0,1,0]],
}

window.addEventListener('load',() => {            
    let board = new Board(config);         
    document.querySelector('.button--play').addEventListener('click',e=>{
        if(e.currentTarget.classList.contains('button--on')){
            e.currentTarget.classList.remove('button--on');
            board.pause();
        }else{
            e.currentTarget.classList.add('button--on');
            board.play();
        }
    });
    document.querySelector('.button--step').addEventListener('click',e=>{
        board.cycle();
    });

    document.querySelector('.button--reset').addEventListener('click',e=>{
        board.reset();
    });

    document.querySelector('.menu-pop__toggle').addEventListener('click',e=>{
        document.querySelector('.menu-pop').classList.toggle('menu-pop--on'); 
        e.currentTarget.classList.toggle('on');      
    });

    document.querySelector('.range-slider__range--time').addEventListener('input',e=>{
        board.timer.changeTick(e.target.value/100);
    });

    document.querySelector('.range-slider__range--cells').addEventListener('input',e=>{
        wrapper.querySelector('.board').style.transform = `scale(${Number(e.target.value)/100})`;
    });

    document.querySelector('.menu-pop__input--populated').addEventListener('input',e=>{
        Cell.populated = Number(e.target.value);
    });

    document.querySelector('.menu-pop__input--overpopulated').addEventListener('input',e=>{
        Cell.overpopulated = Number(e.target.value);
    });

    document.querySelector('.menu-pop__input--underpopulated').addEventListener('input',e=>{
        Cell.underpopulated = Number(e.target.value);
    });
    
    document.querySelector('.menu-pop__rejilla').addEventListener('click',e=>{
        document.querySelectorAll('.cell').forEach(cell=>{cell.classList.toggle('cell--no-border');});
        e.currentTarget.querySelectorAll('div').forEach(cell=>{cell.classList.toggle('no-border');});
    });   

});
        