/**
* Class Cell
*/
export class Cell{
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


