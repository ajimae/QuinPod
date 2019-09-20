import { combineReducers } from 'redux';

// reducers
import songsReducer from './songsReducer';

const rootReducer = combineReducers({
  songsReducer
});

export default rootReducer;
