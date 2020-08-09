import React, {Component, Fragment} from 'react';
import { connect } from 'react-redux';

import {createPoll} from '../store/actions';

class CreatePoll extends Component {
constructor(props) {
    super(props);
    this.state = {
        title: '',
        constituency: '',
        date: '',
        options: [{
            candidateName: '',
            candidateAddress: '',
            candidateParty: ''
        }]
    };

    this.handleChange = this.handleChange.bind(this);
    this.addAnswer = this.addAnswer.bind(this);
    this.handleAnswer = this.handleAnswer.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
};

addAnswer() {
    this.setState({options: [...this.state.options, 
        {
            candidateName: '',
            candidateAddress: '',
            candidateParty: ''
        }
    ]});
};

handleAnswer(e, index) {
    const options = [...this.state.options];
    options[index] = e.target.value;
    this.setState({options});
}

handleSubmit(e) {
    e.preventDefault();
    this.props.createPoll(this.state);
}

handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
};

render() {
    const options = this.state.options.map((options, i) => 
        <Fragment key={i} >
            <label className="form-label">Candidate</label>
            <input 
                className="form-input" 
                type='text' 
                placeholder="Candidate name"
                autoComplete='off'
                value={options.candidateName} 
                onChange={e => this.handleAnswer(e, i)}
            />
            <input 
                className="form-input" 
                type='text' 
                placeholder="Candidate address"
                autoComplete='off'
                value={options.candidateAddress} 
                onChange={e => this.handleAnswer(e, i)}
            />
            <input 
                className="form-input" 
                type='text' 
                placeholder="Candidate party"
                autoComplete='off'
                value={options.candidateParty} 
                onChange={e => this.handleAnswer(e, i)}
            />
        </Fragment>
        )
    
        return <form className="form" onSubmit={this.handleSubmit}>
            <label className="form-label" htmlFor="question">Ballot details</label>
            <input
                className="form-input" 
                type='text' 
                name='title' 
                placeholder="Election name"
                autoComplete='off'
                value={this.state.title} 
                onChange={this.handleChange}
            />
            <input
                className="form-input" 
                type='text' 
                name='constituency' 
                placeholder="Constituency"
                autoComplete='off'
                value={this.state.constitiuency} 
                onChange={this.handleChange}
            />
            <input
                className="form-input" 
                type='text' 
                name='date' 
                placeholder="Polling date"
                autoComplete='off'
                value={this.state.date} 
                onChange={this.handleChange}
            />
    
            {options}
    
            <div className="button-center">
                <button className="button" type='button' onClick={this.addAnswer}>Add Candidate</button>
                <button className="button" type='submit'>Submit</button>
            </div>
        </form>
    }
};

export default connect(
    () => ({}), 
    {createPoll}
)(CreatePoll);
