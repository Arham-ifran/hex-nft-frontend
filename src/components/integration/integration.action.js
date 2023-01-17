import { toast } from 'react-toastify';
import { GET_ERRORS, BEFORE_INTEGRATION, CREATE_INTEGRATION } from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';

export const beforeIntegration = () => {
    return {
        type: BEFORE_INTEGRATION
    }
}

export const createIntegration = (body) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}collection/integrate`;

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
            toast.success(data.message)
            dispatch({
                type: CREATE_INTEGRATION,
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