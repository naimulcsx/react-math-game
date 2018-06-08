import React from 'react';

export default class LevelsSelection extends React.Component {


    render() {
        return (
            <div className="LevelsSelection__box" >
                <span className="easy" onClick={this.props.setDifficulty} >Easy</span>
                <span className="medium" onClick={this.props.setDifficulty}>Medium</span>
                <span className="hard" onClick={this.props.setDifficulty}>Hard</span>
            </div>
        );
    }
}