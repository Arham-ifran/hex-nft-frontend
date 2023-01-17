import { GET_REPORTS, GET_REPORT, BEFORE_REPORT, ADD_REPORT_RESPONSE, ADD_REPORT, GET_REPORTED_USERS, GET_REPORT_MESSAGES, BEFORE_NFT_REPORT} from '../../redux/types'

const initialState = {
    
    getUserNftReportsRes : {},
    getUserNftReportsAuth: false,

    addReportResponseData : {},
    addReportResponseAuth : false,

    getReportMessagesRes : {},
    getReportMessagesAuth : false,

    getReportedNftUsersRes : {},
    getReportedNftUsersAuth : false,
    
    getReportRes : {},
    getReportAuth: false,

    addReportRes : {},
    addReportAuth : false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_REPORTS:
            return {
                ...state,
                getUserNftReportsRes: action.payload,
                getUserNftReportsAuth: true
            }
        case GET_REPORT:
            return {
                ...state,
                getReportRes: action.payload,
                getReportAuth: true
            }
        case ADD_REPORT:
            return {
                ...state,
                addReportRes: action.payload,
                addReportAuth: true
            }
    
        case ADD_REPORT_RESPONSE:
            return {
                ...state,
                addReportResponseData: action.payload,
                addReportResponseAuth: true
            }

        case GET_REPORT_MESSAGES:
            return {
                ...state,
                getReportMessagesRes: action.payload,
                getReportMessagesAuth: true
            }

        case GET_REPORTED_USERS:
            return {
                ...state,
                getReportedNftUsersRes: action.payload,
                getReportedNftUsersAuth: true
            }
        case BEFORE_REPORT:
            return {
                ...state,
                getUserNftReportsRes: {},
                addReportResponseData: {},
                getReportMessagesRes: {},
                getReportedNftUsersRes: {},
                getReportRes: {},
                addReportRes: {},

                getReportMessagesAuth: false,
                addReportResponseAuth: false,
                getUserNftReportsAuth: false,
                getReportedNftUsersAuth: false,
                getReportAuth: false,
                addReportAuth: false,
            }
        case BEFORE_NFT_REPORT:
            return {
                ...state,
                getUserNftReportsRes : {},
                getUserNftReportsAuth : false
            }
        default:
            return {
                ...state
            }
    }
}