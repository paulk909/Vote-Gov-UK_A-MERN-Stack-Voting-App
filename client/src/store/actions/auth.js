import { BrowserRouter as Router } from "react-router-dom";
import axios from 'axios';

import {addError, removeError} from './error';
import {SET_CURRENT_USER, SET_POLLS, CLEAR_POLLS} from '../actionTypes';
import api from '../../services/api';
import { setPolls } from './polls';

export const setCurrentUser = user => ({
    type: SET_CURRENT_USER,
    user
});

export const setToken = token => {
    api.setToken(token);
};

export const logout = () => {
    return dispatch => {
        localStorage.clear();
        api.setToken(null);
        dispatch(setPolls([]));
        dispatch(setCurrentUser({}));
        dispatch(removeError());
    };
};

export const authUser = (path, data) => {
    return async dispatch => {
        try 
        {
            const {token, ...user} = await api.call('post', `auth/${path}`, data);
            localStorage.setItem('jwtToken', token);
            api.setToken(token);
            dispatch(setCurrentUser(user));
            dispatch(removeError());
        }
        catch (err)
        {          
            console.log(err);  
            const { error } = err.message;
            dispatch(addError(error));
        }
    };
};