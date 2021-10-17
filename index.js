
/**
* Class Timer
*/
class Timer{
	#time;
    #currentTime;
    #callbackOnTick;
    #callbackOnTimeOut;
    #tick;
    #interval;
    #state;

    constructor(time,tick,callbackOnTick=null,callbackOnTimeOut=null){
		this.#time = time;
        this.#currentTime = time;
        this.#tick = tick;
        this.#state = false;
        this.#callbackOnTick = callbackOnTick===null?()=>{}:callbackOnTick;
        this.#callbackOnTimeOut = callbackOnTimeOut===null?()=>{}:callbackOnTimeOut;        
    }

//#region getters and setters

    /**
    * Getter for this.#currentTime
    * @returns {Number} this.#currentTime
    */
    get currentTime(){
        return this.#currentTime<0?0:this.#currentTime;
    }

//#endregion

    start(){
        if(this.#currentTime>0 && !this.isRunning()){
            this.#state = true;
            this.#interval = setInterval(_=>{
                this.#currentTime -= this.#tick;                               
                this.#callbackOnTick();
                if(!this.currentTime){                    
                    this.stop();
                }
            },this.#tick*1000);
        }else{
            this.stop();
        }        
    }

    stop(){
        clearInterval(this.#interval);
        this.#state = false;
        if(!this.currentTime){
            this.#callbackOnTimeOut();
        }
    }

    isRunning(){
        return this.#state;
    }

    reset(){
        this.#currentTime = this.#time;
    }

    changeTick(tick){
        let running = this.isRunning();
        this.stop();
        this.#tick = tick;
        if(running) this.start();
    }
}


/**
* Class Cell
*/
class Cell{
    #state=null;
    #nextState=null;    
	#neighbours=null;
    #token=null;
    #node = null;
    #age=null;
    

    static populated = 3;
    static overpopulated = 4;
    static underpopulated = 1;

    /**
    * Creates an instance of the class Cell
	* @param {Array<Cell>|null} neighbours
    * @param {Object|null} token
    */
    constructor(neighbours=null,token=null){
		this.neighbours=neighbours?neighbours:Array.from({length:8},_=>null);
        this.token=token;
    }

//#region Getters & Setters    
    
    /**
    * Getter for #state
    * @returns {Boolean} #state
    */
     get state(){
        return this.#state;
    }
    
    /**
    * Setter for #state
    * @param {Boolean} state
    */
    set state(state){
        this.#state=state;
        this.nextState = null;
        this.node.classList.remove(state?'cell--dead':'cell--alive');        
        this.node.classList.add(state?'cell--alive':'cell--dead');
    }    

    
    /**
    * Getter for #nextState
    * @returns {Boolean} #nextState
    */
     get nextState(){
        return this.#nextState;
    }
    
    /**
    * Setter for #nextState
    * @param {Boolean} nextState
    */
    set nextState(nextState){
        this.#nextState=nextState;
    }
    
    

    /**
    * Getter for #neighbours
    * @returns {Array<Cell>|null} #neighbours
    */
    get neighbours(){
        return this.#neighbours;
    }

    /**
    * Setter for #neighbours
    * @param {Array<Cell>|null} neighbours
    */
    set neighbours(neighbours){
        this.#neighbours=neighbours;
    }


    /**
    * Getter for #token
    * @returns {Object|null} #token
    */
    get token(){
        return this.#token;
    }

    /**
    * Setter for #token
    * @param {Object|null} token
    */
    set token(token){
        this.#token=token;
        if(this.node!==null){
            if(token === null){
                this.node.style.background = '';
                this.node.innerHTML='';
            }else if(token == 'red' || token == 'blue'){
                this.node.style.background = token; 
            }else{
                this.node.innerHTML = token;
            }            
        }
    }
    
    /**
    * Getter for #node
    * @returns {Object|null} #node
    */
     get node(){
        return this.#node;
    }

    /**
    * Setter for #node
    * @param {Object|null} node
    */
    set node(node){
        this.#node=node;
    }


    /**
    * Getter for #age
    * @returns {number} #age
    */
     get age(){
        return this.#age;
    }
    
    /**
    * Setter for #age
    * @param {number} age
    */
    set age(age){
        this.#age=age>10?10:age;
        this.node.dataset.age = this.age;
    }

//#endregion

    die(){
        this.state = false;
    }

    live(){
        this.state = true;
    }

    isAlive(){
        return this.state;
    }

    aliveNeighbours(){
        return this.neighbours.filter(neighbour => {
            if(neighbour){return neighbour.isAlive()
            }
        }).length;
    }


    changetoNextState(neighbours){  
        if(this.nextState){
            this.age += 1;
        }else{
            this.age = 0;
        }   
        this.state = this.nextState;
    }

    toggleState(){
        this.state = this.isAlive()?false:true;
    }

    setNextState(){
        let aliveNeighbours = this.aliveNeighbours();
        if(!this.isAlive() && aliveNeighbours===Cell.populated){
            this.nextState = true;
        }else if(this.isAlive() && (aliveNeighbours<=Cell.underpopulated || aliveNeighbours>=Cell.overpopulated)){
            this.nextState = false;
        }else if(this.isAlive()){
            this.nextState = true;
        }
    }


    /**
     * Generates a cell element for the doom
     * @returns {Object}
     */
    generateNode(){
        this.node = document.createElement('div');
        this.node.classList.add('cell','cell--dead');
        this.token = this.token;
        this.age = 0;      
        return this.node;
    }
    
}



/**
* Class Board
*/
class Board{
	#rows=null;
    #columns=null;
    #cells=null;
    #node = null;
    #pattern=null;
    #timer=null;
    #snapshot=null;
        
    

    /**
    * Creates an instance of the class Board
	* @param {Number} rows
    * @param {Number} columns
    * @param {Array<Cell>} cells 
    */
    constructor(config){
        this.calculateRowsAndColumns(config.parent,config.nCells);
        this.cells=this.generateBoardCells();
        this.node = this.generateNode();
        config.parent.append(this.node);
        this.#node.style.transform = 'scale(2)';
        this.#timer = new Timer(Infinity,config.time,_=>{
            this.cycle();
        });
        this.pattern = config.pattern;
        this.displayPattern(this.pattern);
    }
//#region Getters & Setters

    /**
    * Getter for #rows
    * @returns {Number} #rows
    */
    get rows(){
        return this.#rows;
    }

    /**
    * Setter for #rows
    * @param {Number} rows
    */
    set rows(rows){
        this.#rows=rows;
    }


    /**
    * Getter for #columns
    * @returns {Number} #columns
    */
    get columns(){
        return this.#columns;
    }

    /**
    * Setter for #columns
    * @param {Number} columns
    */
    set columns(columns){
        this.#columns=columns;
    }

    /**
    * Getter for #cells
    * @returns {Array<Cell>} #cells
    */
    get cells(){
        return this.#cells;
    }

    /**
    * Setter for #cells
    * @param {Array<Cell>} cells
    */
    set cells(cells){
        this.#cells=cells;
    }


    /**
    * Getter for #node
    * @returns {Object|null} #node
    */
     get node(){
        return this.#node;
    }

    /**
    * Setter for #node
    * @param {Object|null} node
    */
    set node(node){
        this.#node=node;
    }
  
    
    /**
    * Getter for #pattern
    * @returns {*} #pattern
    */
    get pattern(){
        return this.#pattern;
    }
    
    /**
    * Setter for #pattern
    * @param {*} pattern
    */
    set pattern(pattern){
        this.#pattern=pattern;
    }

    /**
    * Getter for #snapshot
    * @returns {*} #snapshot
    */
     get snapshot(){
        return this.#snapshot;
    }
    
    /**
    * Setter for #snapshot
    * @param {*} snapshot
    */
    set snapshot(snapshot){
        this.#snapshot=snapshot;
    }

    /**
    * Getter for #timer
    * @returns {*} #timer
    */
     get timer(){
        return this.#timer;
    }

//#endregion


    /**
     * Returns the position of an element in a Array taking the coord
     * of a bidimensional array
     * @param {Number} row 
     * @param {Number} column 
     * @returns {Number}
     */
    xy2pos(row,column){
        if(row<0 || row>this.rows-1 || column<0 || column>this.columns-1){
            return null;
        }
        return (row*this.columns)+column
    }

    /**
     * Returns the position of an element in a bidimensional array taking 
     * the position of a one dimension array
     * @param {Number} pos 
     * @returns {Object}
     */
    pos2xy(pos){
        if(pos<0 || pos>this.rows*this.columns-1){
            return null;
        }
        return {row:Math.trunc(pos/this.columns),column:pos%this.columns};
    }

    /**
     * Return the cell with the given coords
     * @param {Number} row 
     * @param {Number} column 
     * @returns {Object<Cell>|null}
     */
    getCell(row,column){
        let pos = this.xy2pos(row,column);
        return pos!==null?this.cells[pos]:null;
    }

    /**
     * Set the properties of the cell with the given coord
     * @param {Number} row 
     * @param {Number} column 
     * @param {Any} token 
     * @param {Array} neighbours 
     * @returns {Array}
     */
    setCell(row,column,token=null,neighbours=null){
        let pos = this.xy2pos(row,column);
        if(pos!==null){
            this.cells[pos].token = token;
            if(neighbours){
                this.cells[pos].neighbours = neighbours;
            }
            return this.cells[pos];
        } 
        return null;       
    }

    /**
     * Returns the adyacent cells of the given cell
     * @param {Number} pos 
     * @returns {Array}
     */
    findNeighbours(pos){ 
        let row = this.pos2xy(pos);
        if(row!==null){
            let column = row.column;
            row = row.row;
            let neighbours = [];
            for(let i=row-1;i<row+2;i++){
                for(let j=column-1;j<column+2;j++){
                    if(i!==row || j!==column){
                        neighbours.push(this.getCell(i,j)||null);
                    }                
                }
            }
            return neighbours;
        }
        return null;
    }    

    /**
     * Generate the elements to add the board to the doom
     * @returns {Array}
     */
    generateBoardCells(){
        this.cells=Array.from({length:this.rows*this.columns},_=>new Cell());
        this.cells.forEach((cell,i)=>{
            cell.neighbours=this.findNeighbours(i);
        });
        return this.cells;
    }

    /**
     * Generates a board element for the doom
     * @returns {Object}
     */
    generateNode(){
        this.node = document.createElement('div');
        this.node.classList.add('board');
        this.cells.forEach((c,i)=>{
            let cell = c.generateNode();
            /*cell.style.width = ((100/this.columns)-2)+'%';
            cell.style.margin = '1% 1%';*/
            cell.style.width = (100/this.columns)+'%';
            [cell.dataset.row,cell.dataset.column] = Object.values(this.pos2xy(i));
        });
        this.node.append(...this.cells.map(c=>c.node));
        this.node.addEventListener('click',e=>{
            if(e.target.classList.contains('cell')){
                this.cells[this.xy2pos(Number(e.target.dataset.row),Number(e.target.dataset.column))].toggleState();
                this.snapshot = this.shot();
            }
        });
        return this.node;
    }

    displayPattern(pattern,pos=null){
        if(pos === null){
            pos = {row:Math.floor(this.rows/2-pattern.length/2),column:Math.floor(this.columns/2-pattern[0].length/2)};
        }else if(typeof(pos)==='number'){
            pos = this.pos2xy(pos);
        }
        for(let i=0;i<pattern.length;i++){
            for(let j=0;j<pattern[0].length;j++){
                pattern[i][j]?this.cells[this.xy2pos(pos.row+i,pos.column+j)].live():this.cells[this.xy2pos(pos.row+i,pos.column+j)].die();
            }
        }
    }

    prepareUpdate(){
        this.cells.forEach(cell=>{
            cell.setNextState();
        });
    }

    updateBoard(){
        this.cells.forEach(cell=>{
            cell.changetoNextState();
        });
    }

    cycle(){
        this.prepareUpdate();
        this.updateBoard();
    }

    play(){
        this.#timer.start();
    }

    pause(){
        this.#timer.stop();
    }
    
    /**
     * Removes the board element from the doom
     */
    removeNode(){
        this.#node.remove();        
    }

    reset(){
        if(this.snapshot){
            this.loadSnapshot(this.snapshot);
        }else if(this.pattern){
            this.displayPattern(this.pattern);
        }else{
            this.cells.forEach(cell=>{
                cell.token = null;
            });
        }        
    }

    shot(){
        return this.cells.map(cell=>{return cell.isAlive()});
    }

    loadSnapshot(snapshot){
        this.cells.forEach((cell,i)=>{
            cell.state = snapshot[i];
        });
    }


    calculateRowsAndColumns(parent, nCells){
        let max = Math.sqrt((parent.offsetWidth*parent.offsetHeight)/nCells);
        this.rows = Math.floor(parent.offsetHeight/max);
        this.columns = Math.floor(parent.offsetWidth/max);
    }

}


let wrapper = document.querySelector('.wrapper');
let config = {
    parent: wrapper,
    nCells : 8000,//aproximado
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
        