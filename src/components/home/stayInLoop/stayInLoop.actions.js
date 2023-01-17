import { ADD_SUBSCRIPTION, BEFORE_SUBSCRIPTION, GET_ERRORS } from '../../../redux/types';
import { ENV } from '../../../config/config';
import { emptyError } from '../../../redux/shared/error/error.action'
import { toast } from 'react-toastify';

export const beforeSubscription = () => {
    return {
        type: BEFORE_SUBSCRIPTION
    }
}

export const addUserSubscription = (body) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}subscriptions/create`;

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
            toast.success('You have successfully subscribed to our Newsletter!')
            dispatch({
                type: ADD_SUBSCRIPTION,
                payload: data
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
