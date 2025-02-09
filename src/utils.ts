export const W = 'w'
export const A = 'a'
export const S = 's'
export const D = 'd'
export const SHIFT = 'shift'
export const DIRECTIONS = [W, A, S, D]

export class KeyDisplay {

    map: Map<string, HTMLDivElement> = new Map()

    constructor() {
        const w: HTMLDivElement = document.createElement("div")
        const a: HTMLDivElement = document.createElement("div")
        const s: HTMLDivElement = document.createElement("div")
        const d: HTMLDivElement = document.createElement("div")
        const shift: HTMLDivElement = document.createElement("div")

        this.map.set(W, w)
        this.map.set(A, a)
        this.map.set(S, s)
        this.map.set(D, d)
        this.map.set(SHIFT, shift)

        this.map.forEach( (v, k) => {
            v.style.color = 'blue'
            v.style.fontSize = '50px'
            v.style.fontWeight = '800'
            v.style.position = 'absolute'
            v.textContent = k
        })

        this.updatePosition()

        this.map.forEach( (v, _) => {
            document.body.append(v)
        });

        this.hideKeys();
    }

    public updatePosition() {
        this.map.get(W).style.top = `${window.innerHeight - 150}px`;
        this.map.get(A).style.top = `${window.innerHeight - 100}px`;
        this.map.get(S).style.top = `${window.innerHeight - 100}px`;
        this.map.get(D).style.top = `${window.innerHeight - 100}px`;
        this.map.get(SHIFT).style.top = `${window.innerHeight - 100}px`;
        
        this.map.get(W).style.left = `300px`;
        this.map.get(A).style.left = `200px`;
        this.map.get(S).style.left = `300px`;
        this.map.get(D).style.left = `400px`;
        this.map.get(SHIFT).style.left = `50px`;
    }
    public hideKeys() {
        this.map.forEach((v, _) => {
            v.style.display = 'none'; // Hides the keys when the page loads
        });
    }
 


    public down(key: string) {
        const lowerKey = key.toLowerCase();
        const element = this.map.get(lowerKey);  // Get the HTMLDivElement
        if (element) {
            element.style.color = 'red';  // Safely access style if the element exists
        } else {
            console.error(`Invalid key pressed: ${key}`);
        }
    }
    
    public up(key: string) {
        const lowerKey = key.toLowerCase();
        const element = this.map.get(lowerKey);  // Get the HTMLDivElement
        if (element) {
            element.style.color = 'blue';  // Safely access style if the element exists
        } else {
            console.error(`Invalid key released: ${key}`);
        }
    }    
    

}
