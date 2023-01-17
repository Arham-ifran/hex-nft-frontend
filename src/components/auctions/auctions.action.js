import { GET_ERRORS, BEFORE_AUCTION, GET_AUCTIONS, REMOVE_FAVOURITE_AUCTION, ADD_FAVOURITE_AUCTION, BEFORE_FAVOURITE } from '../../redux/types';
import { ENV } from './../../config/config';
import { emptyError } from '../../redux/shared/error/error.action'
import { toast } from 'react-toastify';

export const beforeAuction = () => {
    return {
        type: BEFORE_AUCTION
    }
}

export const getLiveAuctions = (qs = null) => dispatch => {
    toast.dismiss()
    dispatch(emptyError());
    let url = `${ENV.url}auctions/live`;
    if (qs)
        url += `?${qs}`

    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: GET_AUCTIONS,
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
                type: ADD_FAVOURITE_AUCTION,
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
                type: REMOVE_FAVOURITE_AUCTION,
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

export const beforeFavourite = () => {
    return {
        type: BEFORE_FAVOURITE
    }
}