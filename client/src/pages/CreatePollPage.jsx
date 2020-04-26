import React from 'react';

import ErrorMessage from '../components/ErrorMessage';
import CreatePoll from '../components/CreatePoll';
import { Redirect } from 'react-router-dom';

const CreatePollPage = ({isAuthenticated}) => {
    if (!isAuthenticated) return <Redirect to='/login' />;

    return (
        <div>
            <ErrorMessage />
            <CreatePoll />
        </div>
    );
};

export default CreatePollPage;