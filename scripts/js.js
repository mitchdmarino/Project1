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

for (let i=0;i<8;i++) {
    for (let j=0;j<8;j++) {
        { if (
            i%2===0 && j%2===0 || 
            i%2>0 && j%2>0 ) {
                ctx.fillStyle = 'green'
            }
            else {
                ctx.fillStyle = 'lightgreen'
            }
            ctx.fillRect(canvas.width*i/8, canvas.width*j/8,canvas.width/8, canvas.height/8)}
    }
}
// this works, but we want a checkerboard appearrance 
// when J is odd, switch the if else statement

