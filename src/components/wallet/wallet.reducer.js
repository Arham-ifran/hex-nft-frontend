import { BEFORE_WALLET, SET_WALLET, GET_WALLET, SET_WALLET_ERROR, REDIRECT_TO_WALLET } from '../../redux/types';

const initialState = {
    connectedAddress: '',
    walletAuth: false,
    redirectW: false, // redirect to wallet / login
}

export default function walletRed(state = initialState, action) {
    switch (action.type) {
        case SET_WALLET:
            return {
                ...state,
                connectedAddress: action.payload,
                walletAuth: true
            }
        case GET_WALLET:
            return {
                ...state
            }
        case SET_WALLET_ERROR:
            return {
                ...state,
                walletError: action.payload
            }
        case REDIRECT_TO_WALLET:
            return {
                ...state,
                redirectW: action.payload
            }
        case BEFORE_WALLET:
            return {
                ...state,
                connectedAddress: '',
                walletAuth: false,
                userAuth: false,
                redirectW: false
            }
        default:
            return {
                ...state
            }
    }
}