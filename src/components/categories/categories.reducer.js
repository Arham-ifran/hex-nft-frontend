import { BEFORE_CATEGORY, GET_CATEGORIES, GET_CATEGORY } from '../../redux/types';

const initialState = {
    category: null,
    categories: null,
    getAuth: false,
    getCategory: false
}

export default function catReducer(state = initialState, action) {
    switch (action.type) {
        case GET_CATEGORY:
            return {
                ...state,
                category: action.payload,
                getCategory: true
            }
        case GET_CATEGORIES:
            return {
                ...state,
                categories: action.payload,
                getAuth: true
            }
        case BEFORE_CATEGORY:
            return {
                ...state,
                category: null,
                categories: null,
                getAuth: false,
                getCategory: false
            }
        default:
            return {
                ...state
            }
    }
}