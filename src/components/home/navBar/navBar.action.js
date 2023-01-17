import { BEFORE_NAVBAR, GET_NAVBAR, GET_ERRORS } from '../../../redux/types';
import { ENV } from '../../../config/config';
import { emptyError } from '../../../redux/shared/error/error.action';

export const beforeNavbar = () => {
    return {
        type: BEFORE_NAVBAR
    }
}

export const getNavbar = () => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}category/list`;
    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: GET_NAVBAR,
                payload: data.categories
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
