import { BEFORE_SETTINGS, GET_SETTINGS } from '../../../redux/types';

const initialState = {
    settings: null,
    settingsAuth: false
}

export default function footerRed(state = initialState, action) {
    switch (action.type) {
        case GET_SETTINGS:
            return {
                ...state,
                settings: action.payload,
                settingsAuth: true
            }
        case BEFORE_SETTINGS:
            return {
                ...state,
                settings: null,
                settingsAuth: false
            }
        default:
            return {
                ...state
            }
    }
}