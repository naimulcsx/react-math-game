import React from 'react';


export default class Options extends React.Component {
    render() {
        return (
            <div className="options__box">
            {
                this.props.options ? 
                this.props.options.map((option, index) => {
                    return <div key={index}> <button onClick={this.props.checkAnswer}> {option} </button> </div>
                })
                :
                null
            }
            </div>


        );
    }
}