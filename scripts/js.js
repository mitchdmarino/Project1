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
    constructor(column, row, color, isOpen) {
        // the x position is the width of the entire board(canvas.width) x the column number
        // and divided by 8. 
        this.x = canvas.width*column/8
        this.y = canvas.height*row/8
        this.width = canvas.width/8
        this.height = canvas.height/8
        this.openSpace = isOpen
        this.color = color
        // if openSpace = false, player won't be able to move there
    }
    renderSpace() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.strokeStyle = 'black'
        ctx.strokeRect(this.x, this.y, this.width, this.height)
    }
}

// make one square with this class 
// const square1 = new GameSpace(0,0
// square1.renderSpace()

// make the entire gameboard using the for loop from line 36
// we will make each square using the method outlined above,
// but will be adding each square into an array. 
const gameSpaceArray = []
for (let i=0;i<8;i++) {
    for (let j=0;j<8;j++) {
        //We have designated "lake" spaces that are not passable. Make them blue. 
        if (
            (i===3 && j===1) || (i===4 && j===1) ||
            (i==3 && j===2) || (i===4 && j===2)  ||
            (i==3 && j===5) || (i===4 && j===5)  ||
            (i==3 && j===6) || (i===4 && j===6) ) {
            let nextSpace = new GameSpace(j,i, '#69fcff', false)
            gameSpaceArray.push(nextSpace) 
            } 
        else if (
            i%2===0 && j%2===0 || 
            i%2>0 && j%2>0 ) {
                let nextSpace = new GameSpace(j,i, '#b4f7a1', true)
                gameSpaceArray.push(nextSpace)  
            } 
            else {
                let nextSpace = new GameSpace(j,i, 'lightgreen', true)
                gameSpaceArray.push(nextSpace)  
            }
        
                 
    }
}

// render each square in the array 
gameSpaceArray.forEach(item => {
    item.renderSpace() 
})


// create a class for all player pieces

class BlueSoldier {
    static total = 24
    constructor(rank, x, y) {
        this.rank = rank
        this.x = x 
        this.y = y
        this.alive=true
        this.color = 'blue'
    }
    //render function for the soldier
    renderSoldier() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x,this.y, canvas.width/12, canvas.height/12)
    }
    showRank() {
        ctx.fillStyle = 'black'
        ctx.textAlign = 'center'
        ctx.font = '30px Comic Sans MS'
        ctx.fillText(rank, this.x+10, this.y+10)
    }
    moveFoward() {

    }
    moveLeft() {

    }
    moveRight() {

    }
    moveBack() {

    }
}
class RedSoldier {
    static total = 24
    constructor(rank, x, y) {
        this.rank = rank
        this.x = x 
        this.y = y
        this.alive=true
        this.color = 'red'
    }
    //render function for the soldier
    renderSoldier() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x,this.y, canvas.width/12, canvas.height/12)
    }
    showRank() {
        ctx.fillStyle = 'black'
        ctx.textAlign = 'center'
        ctx.font = '30px Comic Sans MS'
        ctx.fillText(rank, this.x+10, this.y+10)
    }
    moveFoward() {

    }
    moveLeft() {

    }
    moveRight() {

    }
    moveBack() {

    }
}


// can access each game space to put token in corresponding position 
// board layout 00 01 02 03 04 05 06 07 
//              08 09 10 11 12 13 14 15
//              16 17 18 19 20 21 22 23 ....


const redTeam = []
for (let i=0; i<24; i++) {
    let newX = gameSpaceArray[i].x + 10
    let newY = gameSpaceArray[i].y + 10
    const soldier = new RedSoldier(1,newX,newY)
    redTeam.push(soldier)
}
redTeam.forEach(item => {
    item.renderSoldier()
})

const blueTeam = []
for (let i=63; i>39; i--) {
    let newX = gameSpaceArray[i].x + 10
    let newY = gameSpaceArray[i].y + 10
    const soldier = new BlueSoldier(1,newX,newY)
    blueTeam.push(soldier)
    console.log(i)
}
blueTeam.forEach(item => {
    item.renderSoldier()
})






