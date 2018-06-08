import React from 'react';

export default class Score extends React.Component {
    render() {
        return(
            <div className="question__box--score">Score : {this.props.currentScore} </div>
        );
    }
}