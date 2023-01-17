import { BEFORE_HISTORY, GET_HISTORY } from '../../redux/types';

const initialState = {
    history: null,
    pagination: null,
    getAuth: false
}

export default function historyRed(state = initialState, action) {
    switch (action.type) {
        case GET_HISTORY:
            return {
                ...state,
                history: action.payload.history,
                pagination: action.payload.pagination,
                getAuth: true
            }
        case BEFORE_HISTORY:
            return {
                ...state,
                history: false,
                getAuth: false,
            }
        default:
            return {
                ...state
            }
    }
}