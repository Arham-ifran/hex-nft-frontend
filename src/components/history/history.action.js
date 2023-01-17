import { toast } from 'react-toastify';
import { GET_ERRORS, BEFORE_HISTORY, GET_HISTORY } from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';

export const beforeHistory = () => {
    return {
        type: BEFORE_HISTORY
    }
}

export const getHistory = (qs = '') => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}nfts/history`;
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
                type: GET_HISTORY,
                payload: data.data
            })
        } else {
            if (!qs)
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