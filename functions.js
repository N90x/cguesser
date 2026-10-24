function mouseInBounds(x,y,w,h) {
  let inX = (mouseX>x) && (mouseX<x+w)
  let inY = (mouseY>y) && (mouseY<y+h)
  return (inX && inY)
}

function mouseInBoundsC(x1,y1,r) {
    let x2 = mouseX; let y2 = mouseY;
    let dist = Math.hypot(x2 - x1, y2 - y1);
    return dist<r
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function new2DArray(rows, columns) {
  let arr = [];
  let value = 1;

  for (let i = 0; i < rows; i++) {
    arr[i] = [];
    for (let j = 0; j < columns; j++) {
      arr[i][j] = value++;
    }
  }

  return arr
  
}