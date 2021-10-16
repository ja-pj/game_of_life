import { Cell } from "./Cell.js";

/**
* Class Board
*/
export class Board{
	#rows=null;
    #columns=null;
    #cells=null;
    #node = null;
    #pattern=null;
    #state=null;
    #timer=null;    
    

    /**
    * Creates an instance of the class Board
	* @param {Number} rows
    * @param {Number} columns
    * @param {Array<Cell>} cells 
    */
    constructor(rows,columns){
		this.rows=rows;
        this.columns=columns;
        this.cells=this.generateBoardCells();
        this.node = this.generateNode();
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
    * Getter for #timer
    * @returns {*} #timer
    */
     get timer(){
        return this.#timer;
    }
    
    /**
    * Setter for #timer
    * @param {*} timer
    */
    set timer(timer){
        this.#timer=timer;
    }
    
    
    
    /**
    * Getter for #state
    * @returns {*} #state
    */
    get state(){
        return this.#state;
    }
    
    /**
    * Setter for #state
    * @param {*} state
    */
    set state(state){
        this.#state=state;
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
        return this.node;
    }

    displayPattern(pattern,pos=null){
        if(pos === null){
            pos = {row:0,column:0};
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
    
    /**
     * Removes the board element from the doom
     */
    removeNode(){
        this.#node.remove();        
    }

    reset(){
        this.cells.forEach(cell=>{
            cell.token = null;
        });
    }

}