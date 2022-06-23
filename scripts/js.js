console.log('hello stratego')

//  grab canvas element 
const canvas = document.querySelector('#canvas')

const ctx = canvas.getContext('2d')
//  set canvas width and height
canvas.setAttribute('height', getComputedStyle(canvas)['height'])
canvas.setAttribute('width', getComputedStyle(canvas)['width'])

//  create the game board. each square will be 1/8th the width 
//  and height of the entire board. 
//  Make the board cover the entire canvas

// create a row of squares alternating color (checkerboard)
// render one square first 
//     ctx.fillStyle = 'green'
//     ctx.fillRect(0,0,canvas.width/8, canvas.height/8)
// // second square 
//     ctx.fillStyle = 'lightgreen'
//     ctx.fillRect(canvas.width*1/8, 0,canvas.width/8, canvas.height/8)
// a row of 8 squares can be rendered using:   
// for (let i=0;i<8; i++) {
//     if (i%2===0) {
//         ctx.fillStyle = 'green'
//     }
//     else {
//         ctx.fillStyle = 'lightgreen'
//     }
//     ctx.fillRect(canvas.width*i/8, 0,canvas.width/8, canvas.height/8)
// }

// apply same logic to create 8 more rows
// add more conditions to create checkerboard appearance 

// for (let i=0;i<8;i++) {
//     for (let j=0;j<8;j++) {
//         { if (
//             i%2===0 && j%2===0 || 
//             i%2>0 && j%2>0 ) {
//                 ctx.fillStyle = 'green'
//             }
//             else {
//                 ctx.fillStyle = 'lightgreen'
//             }
//             ctx.fillRect(canvas.width*i/8, canvas.width*j/8,canvas.width/8, canvas.height/8)}
//     }
// }
// use this function to create a GameSpace class that will construct GameSpace objects. 

class GameSpace {
    constructor(row, column) {
        this.x = canvas.width*row/8
        this.y = canvas.height*column/8
        this.width = canvas.width/8
        this.height = canvas.height/8
        this.openSpace = true
        // if openSpace = false, player won't be able to move there
    }
    renderSpace() {
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

// make one square with this class 
// const square1 = new GameSpace(0,0)
// square1.renderSpace()

// make the entire gameboard using the for loop from line 36
const gameSpaceArray = []
for (let i=0;i<8;i++) {
    for (let j=0;j<8;j++) {
        if (
            i%2===0 && j%2===0 || 
            i%2>0 && j%2>0 ) {
                ctx.fillStyle = 'green'
            }
            else {
                ctx.fillStyle = 'lightgreen'
            }
        gameSpaceArray[i] = new GameSpace(i,j)
        gameSpaceArray[i].renderSpace()
    }
}



