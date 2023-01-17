import { toast } from 'react-toastify';
import { GET_ERRORS, BEFORE_CATEGORY, GET_CATEGORY, GET_CATEGORIES } from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from '../../config/config';

export const beforeCategory = () => {
    return {
        type: BEFORE_CATEGORY
    }
}

export const getCategory = (slug) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}category/get`;

    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
        },
        body: JSON.stringify({ slug })
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: GET_CATEGORY,
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
}

export const getCategories = () => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}category/list`;

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
                type: GET_CATEGORIES,
                payload: data.categories
            })
        } else {
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
}