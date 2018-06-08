import React from 'react';

export default class StartGame extends React.Component {
    render() {
        return (
            <div className="StartGame__box">
                <button onClick={this.props.initStartReset}> 
                     { this.props.isLevelSelected ? "Reset" : "Start Game" } 
                </button>
            </div>
        );
    }
}
