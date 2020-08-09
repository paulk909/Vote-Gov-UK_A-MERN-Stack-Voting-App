import React from 'react';
import {Redirect} from 'react-router-dom';

import Poll from '../components/Poll';
import ErrorMessage from '../components/ErrorMessage';

const PollPage = ({match, getPoll, isAuthenticated}) => {
    getPoll(match.params.id);

    if (!isAuthenticated) return <Redirect to="/" />;

    return (
        <div>
            <ErrorMessage />
            <Poll />
        </div>
    );
};

export default PollPage;