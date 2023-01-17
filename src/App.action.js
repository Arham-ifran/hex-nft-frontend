import { BEFORE_APP, SET_BNB, SET_WBNB, SET_MYNT, SET_MYNT_TO_BNB, SET_BNB_TO_WBNB } from './redux/types';
import { emptyError } from './redux/shared/error/error.action';
import axios from 'axios';
import { ENV } from './config/config';

export const beforeApp = () => {
    return {
        type: BEFORE_APP
    }
};

// BNB to USD
export const setBNBRate = () => async dispatch => {
    dispatch(emptyError());
    await axios.get(ENV.bnb).then((res) => {
        if (res) {
            const { data } = res.data
            dispatch({
                type: SET_BNB,
                payload: data?.quote[0].price || 0
            })
        }
    })
};

// WBNB to USD
export const setWBNBRate = () => async dispatch => {
    dispatch(emptyError());
    await axios.get(ENV.wbnb).then((res) => {
        if (res) {
            const { data } = res.data
            dispatch({
                type: SET_WBNB,
                payload: data?.quote[0].price || 0
            })
        }
    })
};

// MYNT to USD
export const setMYNTRate = () => async dispatch => {
    dispatch(emptyError());
    await axios.get(ENV.mynt).then((res) => {
        if (res) {
            const { data } = res.data
            dispatch({
                type: SET_MYNT,
                payload: data?.quote[0].price || 0
            })
        }
    })
};

// MYNT to BNB
export const setMYNTToBNB = () => async dispatch => {
    dispatch(emptyError());
    await axios.get(ENV.myntToBnb).then((res) => {
        if (res) {
            const { data } = res.data
            dispatch({
                type: SET_MYNT_TO_BNB,
                payload: data?.quote[0].price || 0
            })
        }
    })
};

// BNB to WBNB
export const setBNBToWBNB = () => async dispatch => {
    dispatch(emptyError());
    await axios.get(ENV.bnbToWbnb).then((res) => {
        if (res) {
            const { data } = res.data
            dispatch({
                type: SET_BNB_TO_WBNB,
                payload: data?.quote[0].price || 0
            })
        }
    })
};