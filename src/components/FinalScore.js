import React from 'react';

export default class FinalScore extends React.Component {
    render() {
        return (
            <div className="FinalScore__box">
                <div className="FinalScore__box--closeButton" onClick={this.props.hideGameOverScore}>X</div>
                <p className="FinalScore__box--gameOver">Game Over</p>
                <p className="FinalScore__box--score">Your Score is { this.props.score }</p>
            </div>
        );
    }
}