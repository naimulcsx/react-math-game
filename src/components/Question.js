import React from 'react';
import Score from './Score';

export default class Question extends React.Component {
    render() {
        return (
            <div className="question__box">

                {
                    this.props.message && <div className="question__box--message"> <p>{this.props.message}</p> </div>
                }
                
                <div className="question__box--timer"> {this.props.timeRemaining} second remaining. </div>
                <Score currentScore={this.props.currentScore} />

                    <div className="question__box--question"> 
                        { this.props.question.x && <span className="x"> {this.props.question.x} </span> } 
                        { this.props.question.x && <span className="operation"> x </span> } 
                        { this.props.question.x && <span className="y"> {this.props.question.y} </span> } 
                    </div>
                
            </div>
        );
    }
}