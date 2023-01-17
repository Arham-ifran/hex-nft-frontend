import { BEFORE_EARNING, GET_EARNINGS } from '../../redux/types';

const initialState = {
    earnings: null,
    earningsAuth: false
}

export default function earningRed(state = initialState, action) {
    switch (action.type) {
        case GET_EARNINGS:
            return {
                ...state,
                earnings: action.payload,
                earningsAuth: true
            }
        case BEFORE_EARNING:
            return {
                ...state,
                earnings: null,
                earningsAuth: false
            }
        default:
            return {
                ...state
            }
    }
}