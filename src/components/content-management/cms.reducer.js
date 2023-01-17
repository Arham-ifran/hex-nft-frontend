import { GET_CONTENT_PAGES, GET_CONTENT_PAGE, BEFORE_CONTENT } from '../../redux/types';

const initialState = {
    contentPages: {},
    contentPageRes: {},
    cmsAuth: false
}

export default function CmsReducer(state = initialState, action) {
    switch (action.type) {
        case GET_CONTENT_PAGES:
            return {
                ...state,
                contentPages: action.payload,
                cmsAuth: true
            }
        case GET_CONTENT_PAGE:
            return {
                ...state,
                contentPageRes: action.payload,
                cmsAuth: true
            }
        case BEFORE_CONTENT:
            return {
                ...state,
                contentPages: {},
                cmsAuth: false
            }
        default:
            return {
                ...state
            }
    }
}