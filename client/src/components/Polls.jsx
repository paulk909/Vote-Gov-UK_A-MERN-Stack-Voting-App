import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';

import {getPolls, getAdminPolls, getCurrentPoll} from '../store/actions';

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
        const {auth, getPolls, getAdminPolls} = this.props;

        const polls = this.props.polls.map(poll => (<li onClick={() => 
        this.handleSelect(poll._id)} key={poll._id}>
        {poll.title + ": " + poll.constituency}
        </li>
        ));

        return <Fragment>
            {auth.isAuthenticated && (
                <div className="button-center">
                    <button className="button" onClick={getPolls}>All Polls</button>
                    <button className="button" onClick={getAdminPolls}>My Polls</button>
                </div>
            )}
            <ul className="polls">{polls}</ul>
        </Fragment>;
    }
};

export default connect(
    store => ({
        auth: store.auth,
        polls: store.polls
    }), 
    {getPolls, getAdminPolls, getCurrentPoll}
)(Polls);