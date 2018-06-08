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
            currentAnswer: null,
            options: null,
            message: null,
            gameOver: null,
            timeRemaining: 60,
            gameRunning: false
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
        let max;

        switch(this.state.difficulty) {
            case "Easy" : max = 10; break;
            case "Medium" : max = 30; break;
            case "Hard" : max = 50; break;
        }
        
        let x = this.randomNumber(1, max);
        let y = this.randomNumber(1, max);


        this.setState(() => ({
            question : {x: x, y : y},
            currentAnswer: x * y
        }), 
        // after setting the state perform these actions
        () => {
            this.generateOptions();

            this.setState(() => ({
                gameRunning: true
            }));
        });
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
        let max, currentAnswer = this.state.currentAnswer;

        switch(this.state.difficulty) {
            case "Easy" : max = 10; break;
            case "Medium" : max = 30; break;
            case "Hard" : max = 50; break;
        }

        do {
            opt_1 = this.randomNumber(1, max) * this.randomNumber(1, max);
            opt_2 = this.randomNumber(1, max) * this.randomNumber(1, max);
            opt_3 = this.randomNumber(1, max) * this.randomNumber(1, max);
        } while (opt_1 == opt_2 && opt_1 == opt_3 && opt_1 == currentAnswer);

        optArr = [ opt_1, opt_2, opt_3, currentAnswer ];
        // console.log (optArr);
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
        let option = e.target.textContent;
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
        setTimeout(() => {
            this.setState(() => ({
                message: null
            }));
        }, 1000);
    }

    setMessage(msg) {
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
            currentAnswer: null,
            options: null,
            timeRemaining: 60,
            gameRunning: false
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