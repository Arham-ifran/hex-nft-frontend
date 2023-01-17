import { ADD_SUBSCRIPTION, BEFORE_SUBSCRIPTION } from '../../../redux/types';

const initialState = {

    addSubscription : {},
    addSubscriptionAuth : false
}

export default function subscriptionRed(state = initialState, action) {
    switch (action.type) {
        case ADD_SUBSCRIPTION:
            return {
                ...state,
                addSubscription: action.payload,
                addSubscriptionAuth: true
            }
        case BEFORE_SUBSCRIPTION:
            return {
                ...state,
                addSubscription : {},
                addSubscriptionAuth : false
            }
        default:
            return {
                ...state
            }
    }
}