import { combineReducers } from "redux";
import authReducer from "./authReducer";
import fetchBucketsReducer from "./fetchBucketsReducer";
import fetchCardsReducer from "./fetchCardsReducer";
import fetchHistoryReducer from "./fetchHistoryReducer";

const reducers = combineReducers({
    authReducer: authReducer,
    fetchBucketsReducer:fetchBucketsReducer,
    fetchCardsReducer:fetchCardsReducer,
    fetchHistoryReducer:fetchHistoryReducer,
})

export default reducers;