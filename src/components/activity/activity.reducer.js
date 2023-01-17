import { BEFORE_ACTIVITY, GET_ACTIVITIES } from '../../redux/types';

const initialState = {
    activities: null,
    activitiesAuth: false
}

export default function activityRed(state = initialState, action) {
    switch (action.type) {
        case GET_ACTIVITIES:
            return {
                ...state,
                activities: action.payload,
                activitiesAuth: true
            }
        case BEFORE_ACTIVITY:
            return {
                ...state,
                activities: null,
                activitiesAuth: false
            }
        default:
            return {
                ...state
            }
    }
}