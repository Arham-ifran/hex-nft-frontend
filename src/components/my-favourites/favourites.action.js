import { BEFORE_FAVOURITE, GET_USER_FAVOURITES, ADD_USER_FAVOURITE, REMOVE_FAVOURITE, GET_ERRORS } from '../../redux/types';
import { ENV } from './../../config/config';
import { emptyError } from '../../redux/shared/error/error.action'
import { toast } from 'react-toastify';

export const beforeFavourite = () => {
    return {
        type: BEFORE_FAVOURITE
    }
}

export const getUserFavourites = (userId = null, nftId = null, page = 1, limit = 12) => dispatch => {
    dispatch(emptyError());
    toast.dismiss()
    let url = `${ENV.url}favourites/get-favourites`;
    let body = {
        userId,
        nftId,
        page,
        limit
    }
    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: GET_USER_FAVOURITES,
                payload: data.data
            })
        } else {
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(errors => {
        dispatch({
            type: GET_ERRORS,
            payload: errors
        })
    })
};

export const addToFavourite = (body) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}favourites/add-to-favourite`;

    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: ADD_USER_FAVOURITE,
                payload: data.data
            })
        } else {
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(errors => {
        dispatch({
            type: GET_ERRORS,
            payload: errors
        })
    })
};

export const removeFavourite = (body) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}favourites/remove-favourite`;

    fetch(url, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            // toast.success(data.message)
            dispatch({
                type: REMOVE_FAVOURITE,
                payload: data
            })
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};