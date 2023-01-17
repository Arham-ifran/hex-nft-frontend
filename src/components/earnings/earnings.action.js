import { GET_ERRORS, BEFORE_EARNING, GET_EARNINGS } from '../../redux/types';
import { ENV } from '../../config/config';
import { emptyError } from '../../redux/shared/error/error.action'

export const beforeEarning = () => {
    return {
        type: BEFORE_EARNING
    }
}

export const getEarnings = (body) => dispatch => {
    dispatch(emptyError())
    const url = `${ENV.url}earnings/owner-earnings`

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
                type: GET_EARNINGS,
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
}