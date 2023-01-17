import { BEFORE_INTEGRATION, CREATE_INTEGRATION } from '../../redux/types';

const initialState = {
    integration: null,
    createAuth: false
}

export default function intRed(state = initialState, action) {
    switch (action.type) {
        case CREATE_INTEGRATION:
            return {
                ...state,
                integration: action.payload,
                createAuth: true
            }
        case BEFORE_INTEGRATION:
            return {
                ...state,
                integration: null,
                createAuth: false
            }
        default:
            return {
                ...state
            }
    }
}