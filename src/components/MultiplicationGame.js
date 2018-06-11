import React from 'react';

import Score from './Score';
import Question from './Question';
import Options from './Options';
import StartGame from './StartGame';
import LevelsSelection from './LevelsSelection';
import FinalScore from './FinalScore';

export default class MultiplicationGame extends React.Component {

    constructor(props) {
        super(props);

        this.initStartReset = this.initStartReset.bind(this);
        this.initGame = this.initGame.bind(this);
        this.setDifficulty = this.setDifficulty.bind(this);
        this.showLevelsSelection = this.showLevelsSelection.bind(this);
        this.generateQuestion = this.generateQuestion.bind(this);
        this.generateOptions = this.generateOptions.bind(this);
        this.checkAnswer = this.checkAnswer.bind(this);
        this.hideMessage = this.hideMessage.bind(this);
        this.startCounter = this.startCounter.bind(this);
        this.resetGame = this.resetGame.bind(this);
        this.hideGameOverScore = this.hideGameOverScore.bind(this);

        this.state = {
            score: 0,
            prevScore: 0,
            isLevelSelected: false,
            difficulty: null,
            question: {},
            operation: null,
            currentAnswer: null,
            options: null,
            message: null,
            gameOver: null,
            timeRemaining: 60,
            gameRunning: false,
            timeOut: null
        }
    }

    initStartReset() {
        if (!this.state.isLevelSelected) {
            this.showLevelsSelection();
        } else {
            this.resetGame();
        }
    }

    initGame() {
        this.generateQuestion();
        this.startCounter();
    }

    generateQuestion() {
        let max, operation;

        switch ( Math.floor(Math.random() * 4) ) {
            case 0:
                operation = "Addition";
                break;
            case 1:
                operation = "Substruction";
                break;
            case 2:
                operation = "Multiplication";
                break;
            case 3:
                operation = "Division";
                break;            
        }

        switch(this.state.difficulty) {
            case "Easy" : max = 10; break;
            case "Medium" : max = 30; break;
            case "Hard" : max = 50; break;
        }
        
        let x = this.randomNumber(1, max);
        let y = this.randomNumber(1, max);


        this.setState(() => ({
            question : {x: x, y : y},
            operation: operation,
            currentAnswer: this.operation(x, y, operation)
        }), 
        // after setting the state perform these actions
        () => {
            this.generateOptions();

            this.setState(() => ({
                gameRunning: true
            }));
        });
    }

    operation(x, y, operation) {
        switch(operation) {
            case 'Addition':
                return x + y;
            
            case 'Substruction':
                return x - y;

            case 'Multiplication':
                return x * y;

            case 'Division':
                if (y == 1)
                    return x / y;
                else 
                    // Since the toFixed method returns a string
                    // we're explicitly converting it to a Number
                    return Number( (x / y).toFixed(2) );
        }
    }

    showLevelsSelection() {
        this.setState(() => ({
            isLevelSelected: true
        }))
    }

    setDifficulty(e) {
        const difficulty = e.target.textContent;

        this.setState(() => ({
            difficulty: difficulty
        }), () => {
            // initialize game after selecting the level
            this.initGame();
        });
    }

    generateOptions() {
        let opt_1, opt_2, opt_3, optArr = [];
        let max, 
            currentAnswer = this.state.currentAnswer,
            operation = this.state.operation;

        switch(this.state.difficulty) {
            case "Easy" : max = 10; break;
            case "Medium" : max = 30; break;
            case "Hard" : max = 50; break;
        }

        do {
            switch(operation) {
                case "Addition":
                    opt_1 = this.randomNumber(1, max) + this.randomNumber(1, max);
                    opt_2 = this.randomNumber(1, max) + this.randomNumber(1, max);
                    opt_3 = this.randomNumber(1, max) + this.randomNumber(1, max);
                    break;
                case "Substruction":
                    opt_1 = this.randomNumber(1, max) - this.randomNumber(1, max);
                    opt_2 = this.randomNumber(1, max) - this.randomNumber(1, max);
                    opt_3 = this.randomNumber(1, max) - this.randomNumber(1, max);
                    break;
                case "Multiplication":
                    opt_1 = this.randomNumber(1, max) * this.randomNumber(1, max);
                    opt_2 = this.randomNumber(1, max) * this.randomNumber(1, max);
                    opt_3 = this.randomNumber(1, max) * this.randomNumber(1, max);
                    break;
                case "Division":
                    opt_1 = Number( (this.randomNumber(1, max) / this.randomNumber(1, max)).toFixed(2) );
                    opt_2 = Number( (this.randomNumber(1, max) / this.randomNumber(1, max)).toFixed(2) );
                    opt_3 = Number( (this.randomNumber(1, max) / this.randomNumber(1, max)).toFixed(2) );
                    break;
            }
        } while (opt_1 === opt_2 || opt_2 === opt_3 || opt_3 === opt_1 || opt_1 === currentAnswer || opt_2 === currentAnswer || opt_3 === currentAnswer);

        optArr = [ opt_1, opt_2, opt_3, currentAnswer ];

        // suffling array
        optArr = this.shuffleOptions(optArr);
        // set State
        this.setState(() => ({
            options: optArr
        }));
    }

    shuffleOptions(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    
    // check answer
    checkAnswer(e) {
        let option = Number(e.target.textContent);
        let answer = this.state.currentAnswer;

        if (option == answer) {

            this.setState((prevState) => ({
                score: prevState.score + 1
            }))

            // set message
            this.setMessage("Correct");

            // hide message after 1 second
            this.hideMessage();

            // Generate new Question
            this.generateQuestion();
        } else {

            this.setMessage("Try Again");
            // hide message after 1 second
            this.hideMessage();
        }
    }

    hideMessage() {
        const timeOut = setTimeout(() => {
            this.setState(() => ({
                message: null
            }));
        }, 500);

        this.setState(() => ({
            timeOut: timeOut
        }));
    }

    setMessage(msg) {
        if (this.state.timeOut) 
            clearTimeout(this.state.timeOut);

        this.setState(() => ({
            message: msg
        }));
    }

    startCounter() {
        const interval = setInterval( () => {
            
            if (this.state.gameRunning) {
                /* 
                checking if state gameRunning is true when generating Question
                if true then we are counting the time
                */

                this.setState( (prevState) => ({
                    timeRemaining: prevState.timeRemaining - 1
                }));
            } else {

                clearInterval(interval);
            }

            if (this.state.timeRemaining == 0) {
                /* check if game isOver we want to change some states
                and also set the prevScore to reserve the score which was scored by the player.
                we are researving this because we'll reset the game, and by doing that 
                score goes to 0. So, we are passing this prevScore to FinalScore Component
                to show the final score
                */

                this.setState( (prevState) => ({
                    gameOver: true,
                    prevScore: prevState.score
                }));

                // we are resetting the game which restors all the initial states
                this.resetGame();

                // we also want to clear the interval once there is no time remaining
                clearInterval(interval);
            }

        }, 1000);
    }
    
    resetGame() {
        this.setState(() => ({ 
            score: 0,
            isLevelSelected: false, 
            question: {}, 
            difficulty: null, 
            operation: null,
            currentAnswer: null,
            options: null,
            timeRemaining: 60,
            gameRunning: false,
            timeOut: null
        }));
    }

    hideGameOverScore() {

        this.setState( () => ({
            gameOver: null
        }) );


    }

    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    render() {
        return(
            <div className="multiplicationGame">

                <Question 
                    currentScore = {this.state.score} 
                    question = {this.state.question}
                    message = {this.state.message}
                    timeRemaining = {this.state.timeRemaining}
                    operation = {this.state.operation}
                />
                
                <Options options={this.state.options} checkAnswer={this.checkAnswer} />

                <StartGame 
                    initStartReset={this.initStartReset} 
                    isLevelSelected={this.state.difficulty} 
                />

                { this.state.isLevelSelected && !this.state.difficulty ? 
                    <LevelsSelection 
                        setDifficulty= {this.setDifficulty}
                    /> : null 
                }

                {this.state.gameOver && <FinalScore score={this.state.prevScore} hideGameOverScore={this.hideGameOverScore} />}
            </div>
        );
    }
}