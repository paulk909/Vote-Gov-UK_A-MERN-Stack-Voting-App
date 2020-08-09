import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';

import {getPolls, getUserPolls, getCurrentPoll} from '../store/actions';

class Polls extends Component {
    constructor(props) 
    {
        super(props);

        this.handleSelect = this.handleSelect.bind(this);
    }
    
    componentDidMount() 
    {
        const {getPolls} = this.props;
        getPolls();
    }


    handleSelect(id) {
        const {history} = this.props;
        history.push(`/poll/${id}`);
    }
    
    render(){
        const {auth, getPolls, getUserPolls} = this.props;

        const polls = this.props.polls.map(poll => (<li onClick={() => 
        this.handleSelect(poll._id)} key={poll._id}>
        {poll.title + ": " + poll.constituency}
        </li>
        ));

            
        if(auth.isAuthenticated)
        return <Fragment>
            {auth.user.userType == "Admin" && (
                <div>
                    <div className="button-center">
                        <button className="button" onClick={getPolls}>My Current Ballot</button>
                        <button className="button" onClick={getUserPolls}>My Created Polls</button>
                    </div>
                    <ul className="polls">{polls}</ul>
                </div>
            )}
            {auth.user.userType == "User" && (
                <ul className="polls">{polls}</ul>
            )}
            
        </Fragment>;
        else
        return <Fragment><div className="login-warning">Login in to view ballots</div></Fragment>
    }
};

export default connect(
    store => ({
        auth: store.auth,
        polls: store.polls
    }), 
    {getPolls, getUserPolls, getCurrentPoll}
)(Polls);