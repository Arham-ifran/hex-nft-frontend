import { BEFORE_NAVBAR, GET_NAVBAR } from '../../../redux/types';

const initialState = {
    navBar: null,
    navBarAuth: false
}

export default function navBarRed(state = initialState, action) {
    switch (action.type) {
        case GET_NAVBAR:
            return {
                ...state,
                navBar: action.payload,
                navBarAuth: true
            }
        case BEFORE_NAVBAR:
            return {
                ...state,
                navBar: null,
                navBarAuth: false
            }
        default:
            return {
                ...state
            }
    }
}