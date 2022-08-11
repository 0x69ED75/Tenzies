import React from "react"
import './style.css';
import Die from "./Components/Die"
import {nanoid} from "nanoid"
import Confetti from 'react-confetti'

export default function App() {

    const [dice,setDice] = React.useState(genDieNums)
    const [tenzies, setTenzies] = React.useState(false)
    const [count,setCount] = React.useState(0)

    // useEffect that runs each time the dice state changes.
    React.useEffect(()=> {

        const expectantValue = dice[0].value // stores the value of the first die
        const held = dice.every(die => die.isHeld) // checks every die to make sure held is true, if not, this value is false.
        const allMatch = dice.every(die => die.value === expectantValue) // checks every die to see if they have the same value

        if(held && allMatch){ // if all dice are the same value, and are all held then the user has won.
            handleWin() // running a method which handles the events when a user wins.
        }

    }, [dice])

    // randomly generates 10 numbers from 1-6, creates the die element objects, pushing them into an array.
    function genDieNums(){
        let dieNums = []
        for(let i = 0 ; i < 10; i++){
            dieNums.push({ // pushes these die into dieNums array, as an object with multiple properties.
                id: nanoid(),
                value: Math.floor(Math.random()* 6) +1,
                isHeld:false
            })
        }
        return dieNums
    }

    // mapping each die in the previously created array to a html element (die.js) and passing it props
    const diceValues = dice.map(die => <Die
        handleClick={()=> holdDice(die.id)} // using anonymous function with implicit return to pass die.id
        value={die.value}
        key = {die.id}
        toggled = {die.isHeld}
    />)

// handles the rolling of any die which is not being held.
    function handleRoll(){
        setCount(oldCount => oldCount + 1); // increasing the number of times the die has been rolled.

        setDice(oldDice => oldDice.map(die=>{
            return die.isHeld
                ? die
                : {...die, value:Math.floor(Math.random()* 6) +1} // only changing the value of the die, instead of generating a new die.
        }))
    }

    //setting dice held state by looking through the old dice, mapping each value to a new array, if we find the dice with the id passed as param, we change isHeld to the opposite value.
    function holdDice(id){
        setDice(oldDice => oldDice.map(die =>{
            return die.id === id
                ? {...die, isHeld:!die.isHeld}
                : die
        }))
    }

    // handles resetting the game, resetting all states back to 0, and rolling completely new dice objects (not editing existing dice objects)
    function resetGame(){
        setDice(genDieNums)
        setTenzies(prevTenzies => !prevTenzies)
        setCount(0)
    }

    // Handles all events that occur when a user wins: updating localstorage, updating states.
    function handleWin(){

        // Calculating if the achieved score is the user's best (or if it's null, there first time winning). If so, updating this score to local storage.
        if (localStorage.getItem("bestScore") === null || count < Number.parseInt((localStorage.getItem("bestScore")))){ // calculating whether this is the users best win
            localStorage.setItem("bestScore",JSON.stringify(count)) // Updating localstorage.
        }

        // updating local storage to append the users score to their existing record.
        let old = localStorage.getItem("scores");
        if(old === null) localStorage.setItem("scores", ""+ count)
        else localStorage.setItem("scores", old + "," + count)

        // calculating average
        let scoreArr = localStorage.getItem("scores").split(",").map(item => Number.parseInt(item));
        let avg = Math.round(scoreArr.reduce((a, b) => a + b, 0) / scoreArr.length);
        localStorage.setItem("averageScore",""+avg)


        // setting Tenzies to true, since the user has won.
        setTenzies(true)
    }


    return(
        <div>
            <main>
                {tenzies && <Confetti/>}
                <h1 className="title">Tenzies</h1>
                <p className="instructions">Roll the dice until all the dice match.</p>
                <p className="instructions">  Click any die to freeze it at its current value between rolls. </p>
                <div className="dieContainer" >
                    {diceValues}
                </div>
                <button className="rollButton" onClick={tenzies ? resetGame : handleRoll}> {tenzies ? "Play Again" : "Roll"}</button>
            </main>

            <div className="scores">
                <h1>Rolls: {count}</h1>
                <h3>Best Score: {localStorage.getItem("bestScore")} </h3>
                <h3>Average Score: {localStorage.getItem("averageScore")}  </h3>
            </div>
        </div>

    )
}
