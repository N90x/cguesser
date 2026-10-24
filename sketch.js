let cnv;
let margin = 20
let countryList;
let activeMode = 'Area'

async function setup() {
  cnv = createCanvas(windowWidth - margin, windowHeight - margin);
  cnv.position(margin/2, margin/2, 'fixed');
  background(180);
  countryList = await loadJSON('assets/countries.json')
  //console.log(countryList)
  //loadPhysics()
}

function windowResized() {
  resizeCanvas(windowWidth - margin, windowHeight - margin);
}

function getRandomCountry() {
  let list = countryList.countries.country
  let i = getRandomInt(list.length)
  return list[i]
}

function getRandomCountryPair() {
  let r1 = getRandomCountry()
  let r2 = getRandomCountry()
  while (r1 == r2) {
    r2 = getRandomCountry()
  }
  return [r1,r2]
}

let countryPair;
function keyPressed() {
  if (key == ' ' && countryPair === undefined) {
    countryPair = getRandomCountryPair()
    console.log(countryPair)
    timer = allottedTime
    if (dead) {
      dead = false
      score = 0
    }
  }
  if (key == ' ' && screenBlock) {
    screenBlock.time = 75
  }
  console.log(key)
  if (key == 'Backspace' && dead) {
    dead = false
    score = 0
    timer = allottedTime
    countryPair = undefined
  }
  if (inMainMenu) {
    if (key == 'ArrowLeft' || key == 'ArrowRight') {
      if (activeMode == 'Area') {activeMode = 'Population'} else {activeMode = 'Area'}
    }
  }
}

let screenBlock;
let numQuestions = 0

function mousePressed() {
  let guess;
  let nonGuess;
  if (screenBlock) {
    return
  }
  if (mouseX<width/2) {
    guess = 0
    nonGuess = 1
  } else {
    guess = 1
    nonGuess = 0
  }
  if (countryPair) {

    let guessedNum;
    let nonguessedNum;
    if (activeMode == 'Area') {
      guessedNum = Number(countryPair[guess].areaInSqKm)
      nonguessedNum = Number(countryPair[nonGuess].areaInSqKm)
    } else if (activeMode == 'Population') {
      guessedNum = Number(countryPair[guess].population)
      nonguessedNum = Number(countryPair[nonGuess].population)
    }

    let correct = guessedNum > nonguessedNum

    let c1 = {
      n: countryPair[0].countryName,
      area: Number(Math.round(countryPair[0].areaInSqKm)),
      pop: Number(Math.round(countryPair[0].population))
    }
    let c2 = {
      n: countryPair[1].countryName,
      area: Number(Math.round(countryPair[1].areaInSqKm)),
      pop: Number(Math.round(countryPair[1].population))
    }

    let answer;
    if (activeMode == 'Area') {
      answer = [
        c1.area.toLocaleString('en-UK', {minimumFractionDigits: 0}), 
        c2.area.toLocaleString('en-UK', {minimumFractionDigits: 0})
      ]
    } else if (activeMode == 'Population') {
      answer = [
        c1.pop.toLocaleString('en-UK', {minimumFractionDigits: 0}), 
        c2.pop.toLocaleString('en-UK', {minimumFractionDigits: 0})
      ]
    }

    if (correct) {
      screenBlock = {time: 0, colour: correctColour, answer: answer}
      timer += allottedTime/10
      score++
    } else {
      screenBlock = {time: 0, colour: incorrectColour, answer: answer}
      timer -= allottedTime/10
    }
    numQuestions++
    //countryPair = getRandomCountryPair()
  }
}

function setTimer(t) {
  allottedTime = t
  timer = allottedTime
}

let allottedTime = 60 * 10 // 60 * seconds
let timer = allottedTime
let score = 0

let backgroundColour = '#2d522d'
let highlightColour = '#68b468'
let textColour = '#e0f4df'
let incorrectColour = '#c62323'
let correctColour = '#20a63d'

let dead = false
let inMainMenu;


function draw() { 
  timer = Math.min(timer, allottedTime+1)
  inMainMenu = false
  if (timer<=0 || dead) {
    background(incorrectColour)
    fill(textColour)
    textSize(32)
    noStroke()
    let perc = Math.round((score/numQuestions)*100)
    text(`You ran out of time!\nScore: ${score} / ${numQuestions} (${perc}%)\nSpace: Play Again\nBKSP: Main Menu`, width/2, height/2)
    dead = true
    countryPair = undefined
    timer = 0
    return
  }

  background(backgroundColour);
  let answerA = ''; let answerB = ''
  if (screenBlock) {
    fill(screenBlock.colour)
    rect(0,0,width,height)
    screenBlock.time++

    let unit;
    if (activeMode == 'Area') {
      unit = 'km²'
    } else {
      unit = 'people'
    }

    answerA = `\n${screenBlock.answer[0]} ${unit}`
    answerB = `\n${screenBlock.answer[1]} ${unit}`
    //fill(0)
    //text(screenBlock.answer, width/2, height/2)
    if (screenBlock.time>=75) {
      screenBlock = undefined
      countryPair = getRandomCountryPair()
    }
  }


  if (countryPair) {
    let c1 = countryPair[0]
    let c2 = countryPair[1]
    textSize(32)
    textAlign(CENTER, CENTER)
    fill(textColour)
    noStroke()
    text(`${c1.countryName}${answerA}`, width*0.25, height/2)
    text(`${c2.countryName}${answerB}`, width*0.75, height/2)

    // Timer
    if (!screenBlock) {
      stroke(highlightColour)
      strokeWeight(5)
      line(width/2, 0, width/2, height-25)
      strokeWeight(1)

      timer--

      push()
      noStroke()
      fill(highlightColour)
      
      let w = (timer/allottedTime) * width
      let h = 10
      rect(0, 0, w, h)

      fill(textColour)
      textAlign(CENTER)
      textSize(16)
      text(`Score: ${score}`, width/2, height-10)
      pop()
    }
  } else {
    textSize(32)
    textAlign(CENTER)
    fill(textColour)
    inMainMenu = true
    text(`Press Space to Start\n< Mode: ${activeMode} >`, width/2, height/2)
  }


}
