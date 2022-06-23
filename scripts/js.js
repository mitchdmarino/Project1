console.log('hello stratego')

//  grab canvas element 
const canvas = document.querySelector('#canvas')

const ctx = canvas.getContext('2d')
//  set canvas width and height
canvas.setAttribute('height', getComputedStyle(canvas)['height'])
canvas.setAttribute('width', getComputedStyle(canvas)['width'])

// gamespace class 
class GameSpace {
    constructor(column, row, color, isOpen) {
        // the x position is the width of the entire board(canvas.width) times the column number
        // and divided by 8. 
        this.x = canvas.width*column/8
        this.y = canvas.height*row/8
        this.width = canvas.width/8
        this.height = canvas.height/8
        // position on the grid: 
        this.position = findPosition(this.x, this.y) 
        this.color = color 
        // movable space? 
        this.openSpace = isOpen
        // cannot move onto a space shared by a teammate. we need to know which team color occupies the space, if any
        this.teamColor = ""
        // store the rank of the soldier occupying the space, if there is one
        this.currentSoldier = ""
        // if openSpace = false, player won't be able to move there
    }
    renderSpace() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.strokeStyle = 'black'
        ctx.strokeRect(this.x, this.y, this.width, this.height)
    }
}
// make the entire gameboard using for loop
// add each space into an array to access later 
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
        // create checkerboard appearance 
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
// render each square in the array to render the gameboard
gameSpaceArray.forEach(item => {
    item.renderSpace() 
})

// create a class for all player pieces on each team

// Blue team (player 1)
class BlueSoldier {
    static total = 24
    constructor(rank, x, y) {
        this.rank = rank
        this.x = x 
        this.y = y
        // soldier status (alive or not)
        this.alive=true
        this.color = 'blue'
        // this helps us correlate position of soldier with position on grid 
        this.position = findPosition(this.x,this.y)
    }
    //render function for the soldier
    renderSoldier() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x,this.y, canvas.width/12, canvas.height/12)
        // blue team rank will always show
        this.showRank()
        const currentSpace = gameSpaceArray.findIndex((space) => {
            return arrayEquals(space.position, this.position)           
        })
        gameSpaceArray[currentSpace].teamColor = this.color
        gameSpaceArray[currentSpace].currentSoldier = this.rank
        
    }
    showRank() {
        ctx.fillStyle = 'black'
        ctx.textAlign = 'center'
        ctx.font = '30px Comic Sans MS'
        ctx.fillText(this.rank, this.x+20, this.y+30)
    }
    moveForward() {
        const currentSpace = gameSpaceArray.findIndex((space) => {
            return arrayEquals(space.position, this.position)           
        })
        
        const potentialSpace = gameSpaceArray.findIndex((space) => {
            return arrayEquals(space.position, [this.position[0], this.position[1]-1])
        })
        if ((gameSpaceArray[potentialSpace].openSpace) && gameSpaceArray[potentialSpace].teamColor !== 'blue') {
            this.y -= canvas.width/8
            this.position[1] -=1
            //Since we have moved, remove soldier attributes from previous space
            gameSpaceArray[currentSpace].teamColor = ''
            gameSpaceArray[currentSpace].currentSoldier = ''
            // now check if opponent is there
            if (gameSpaceArray[potentialSpace].teamColor ==='red') {
                //battle function 
            }
        }
        else {
            console.log('space is not open')
        }
    }
    moveLeft() {
        const currentSpace = gameSpaceArray.findIndex((space) => {
            return arrayEquals(space.position, this.position)           
        })
        
        const potentialSpace = gameSpaceArray.findIndex((space) => {
            return arrayEquals(space.position, [this.position[0]-1, this.position[1]])
        })
        if ((gameSpaceArray[potentialSpace].openSpace) && gameSpaceArray[potentialSpace].teamColor !== 'blue') {
            this.x -= canvas.width/8
            this.position[0] -=1
            //Since we have moved, remove soldier attributes from previous space
            gameSpaceArray[currentSpace].teamColor = ''
            gameSpaceArray[currentSpace].currentSoldier = ''
            // now check if opponent is there
            if (gameSpaceArray[potentialSpace].teamColor ==='red') {
                //battle
            }
        }
        else {
            console.log('space is not open')
        }
    }
    moveRight() {
        const currentSpace = gameSpaceArray.findIndex((space) => {
            return arrayEquals(space.position, this.position)           
        })
        
        const potentialSpace = gameSpaceArray.findIndex((space) => {
            return arrayEquals(space.position, [this.position[0]+1, this.position[1]])
        })
        console.log(currentSpace, potentialSpace)
        if ((gameSpaceArray[potentialSpace].openSpace) && gameSpaceArray[potentialSpace].teamColor !== 'blue') {
            this.x += canvas.width/8
            this.position[0] +=1
            //Since we have moved, remove soldier attributes from previous space
            gameSpaceArray[currentSpace].teamColor = ''
            gameSpaceArray[currentSpace].currentSoldier = ''
            // now check if opponent is there
            if (gameSpaceArray[potentialSpace].teamColor ==='red') {
                //battle
            }
        }
        else {
            console.log('space is not open')
        }
    }
    moveBack() {
        const currentSpace = gameSpaceArray.findIndex((space) => {
            console.log(space.position, this.position)
            return arrayEquals(space.position, this.position)
        })
        
        const potentialSpace = gameSpaceArray.findIndex((space) => {
            return arrayEquals(space.position, [this.position[0], this.position[1]+1])
        })
        if ((gameSpaceArray[potentialSpace].openSpace) && gameSpaceArray[potentialSpace].teamColor !== 'blue') {
            this.y += canvas.width/8
            this.position[1] +=1
            //Since we have moved, remove soldier attributes from previous space
            gameSpaceArray[currentSpace].teamColor = ''
            gameSpaceArray[currentSpace].currentSoldier = ''
            // now check if opponent is there
            if (gameSpaceArray[potentialSpace].teamColor ==='red') {
                //battle
            }
        }
        else {
            console.log('space is not open')
        }
    }
}
// Red Team (CPU)
class RedSoldier {
    static total = 24
    constructor(rank, x, y) {
        this.rank = rank
        this.x = x 
        this.y = y
        this.alive=true
        this.color = 'red'
        this.position = findPosition(this.x,this.y)
    }
    //render function for the soldier
    renderSoldier() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x,this.y, canvas.width/12, canvas.height/12)
        this.showRank()
        const currentSpace = gameSpaceArray.findIndex((space) => {
            return arrayEquals(space.position, this.position)           
        })
        gameSpaceArray[currentSpace].teamColor = this.color
        gameSpaceArray[currentSpace].currentSoldier = this.rank
    }
    showRank() {
        ctx.fillStyle = 'black'
        ctx.textAlign = 'center'
        ctx.font = '30px Comic Sans MS'
        ctx.fillText(this.rank, this.x+20, this.y+30)
    }
    moveForward() {
        
        this.y += canvas.height/8
        this.position[1] += 1
    }
    moveLeft() {
        this.x += canvas.width/8
        this.position[0] +=1
    }
    moveRight() {
        this.x -= canvas.width/8
        this.position[0] -=1
    }
    moveBack() {
        this.y -= canvas.width/8
        this.position[1] -=1
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
    const soldier = new RedSoldier(3,newX,newY)
    redTeam.push(soldier)
}
redTeam.forEach(item => {
    const pos = item.position

    item.renderSoldier()
    
})

const blueTeam = []
for (let i=63; i>39; i--) {
    let newX = gameSpaceArray[i].x + 10
    let newY = gameSpaceArray[i].y + 10
    const soldier = new BlueSoldier(1,newX,newY)
    blueTeam.push(soldier)
   
}
blueTeam.forEach(item => {
    item.renderSoldier()
    // item.showRank()
})

const gameLoop = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // re render the game board 
    gameSpaceArray.forEach(item => {
        item.renderSpace() 
    })
    //re render each team of soldiers(with the updated value from the move )
    redTeam.forEach(item => {
        item.renderSoldier()
    })
    blueTeam.forEach(item => {
        item.renderSoldier()
        // item.showRank()
    })
    
}


// when a player clicks, we need to know which token is being clicked
// designate by row and column of clicking event 
function findPosition(x,y) {
    let column = 0
    let row = 0
    switch(true) {
        case (x<62.5): 
            column = 0
            break
        case (x<125): 
            column = 1
            break
        case (x<187.5): 
            column = 2
            break
        case (x<250): 
            column = 3
            break
        case (x<312.5): 
            column = 4
            break
        case (x<375): 
            column = 5
            break
        case (x<437.5): 
            column = 6
            break
        case (x<500): 
            column = 7
            break
    }
    switch(true) {
        case (y<62.5): 
            row = 0
            break
        case (y<125): 
            row = 1
            break
        case (y<187.5): 
            row = 2
            break
        case (y<250): 
            row = 3
            break
        case (y<312.5): 
            row = 4
            break
        case (y<375): 
            row = 5
            break
        case (y<437.5): 
            row = 6
            break
        case (y<500): 
            row = 7
            break
    }
    return [column, row]
    // this gives us our x and y coordinates on the grid( 
    // where X is the column# and Y is the row#)
    // can we combine these into a single 'space'? 

    // create an array that stores the information for each space? 
    // build that into our gameSpaceArray 
    // -- needs to have a soldier property 
}
// handles keyboard input 

// https://stackoverflow.com/questions/8941183/pass-multiple-arguments-along-with-an-event-object-to-an-event-handler
const movementHandler = function(item) {
    // console.log(e.key)
    const movementFunction = function(e) {
        console.log(item)
        switch(e.key) {
            case('w'):
                item.moveForward()
                break
            case('s'):
                item.moveBack()
                break
            case('a'):
                item.moveLeft()
                break
            case('d'):
                item.moveRight()
                break
        }
        e.stopPropagation()
        gameLoop()
    }
    return movementFunction
}

// https://masteringjs.io/tutorials/fundamentals/compare-arrays
function arrayEquals(a,b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.every((val,index) => val === b[index])
}
 // player turn. Player clicks on an soldier, and can direct that soldier left, up, right, down using wasd
 // can only click one soldier 
 // can only move one space 
function playerTurn() {
canvas.addEventListener('click', e => {
    console.log(`${e.offsetX} is X, ${e.offsetY} is Y`)
    const clickPosition = findPosition(e.offsetX,e.offsetY)
    let clickedSoldier = ""
    blueTeam.forEach(item => {
        // check if the position array matches one of a token
        if (arrayEquals(item.position, clickPosition)) {
            clickedSoldier = item
        }
    })
    console.log(clickedSoldier)
    
    if (clickedSoldier) {
        document.addEventListener('keydown',movementHandler(clickedSoldier), {once: true})
            }
}
// ,{once: true}
)
}
function cpuTurn() {
    
}
playerTurn()







