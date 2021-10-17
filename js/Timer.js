/**
* Class Timer
*/
export class Timer{
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
