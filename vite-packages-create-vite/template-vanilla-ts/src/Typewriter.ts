// setting type of queue array to a promise that returns nothing
type QueueItems = () => Promise<void>

export default class Typewriter {
    //setting types for the constructor properties
    loop: boolean;
    typingSpeed: number;
    deletingSpeed: number;
    //making properties private so that consumers of the class can't modify their values
    private element : HTMLElement;
    private queue : QueueItems[] = []
    

    constructor(parent: HTMLElement, {loop = false, typingSpeed = 50, deletingSpeed = 50} ) {
        this.element = document.createElement('div')
        parent.append(this.element);
        this.deletingSpeed = deletingSpeed;
        this.loop = loop;
        this.typingSpeed = typingSpeed;

    }
    //Adds a new promise to the queue array by accepting a callback function
    private addToQueue (callback: (resolve: () => void) => void){
        this.queue.push(() => {
            return new Promise(callback)
        })
    }

    typeString(string: string){
        this.addToQueue(resolve => {
            console.log(string)
            //initialize a counter to represent each elements of the string
            let i = 0
            const interval = setInterval(() => {
                //start adding the string one at a time to the div element
                this.element.append(string[i])
                i++
                //check if we've gotten to the end of the string, then clear the interval and moves to the next function on queue(resolve)
                if(i >= string.length){
                    clearInterval(interval)
                    resolve()
                }
            }, this.typingSpeed)    
        })
        //to enable chaining the methods to each other when calling the class
        return this
    }
    pauseFor(duration: number){
        this.addToQueue(resolve =>{
            setTimeout(resolve, duration)
        })
        return this
    }
    deleteChars(number: number){
        this.addToQueue(resolve => {
            console.log(number)
            //initialize a counter to represent each elements of the string
            let i = 0
            const interval = setInterval(() => {
                //start removing the string one at a time to the div element
                this.element.innerText = this.element.innerText.substring(0, this.element.innerText.length - 1)
                i++
                //check if we've gotten to the specified number, then clear the interval and moves to the next function on queue(resolve)
                if(i >= number){
                    clearInterval(interval)
                    resolve()
                }
            }, this.deletingSpeed)    
        })
        return this
    }
    deleteAll(deletespeed = this.deletingSpeed){
        this.addToQueue(resolve => {
            //initialize a counter to represent each elements of the string
            const interval = setInterval(() => {
                //start removing the string one at a time from the div element
                this.element.innerText = this.element.innerText.substring(0, this.element.innerText.length - 1)
                //check if we've gotten to the end of the string, then clear the interval and moves to the next function on queue(resolve)
                if(this.element.innerText.length === 0){
                    clearInterval(interval)
                    resolve()
                }
            }, deletespeed) 
        })
        return this
    }

    async start(){
        //recalls each functions in the queue array
        let callback = this.queue.shift()
        while(callback !== undefined){
            await callback()
            //adds the callback continously if loop is true
            if(this.loop) this.queue.push(callback)
            callback = this.queue.shift()
        }
        return this
    }
}