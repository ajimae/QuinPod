
const initialState = {
  isLoading: false,
  tracks: [],
  error: null
};

// reducer - modifies the state and returns a new state
const songsReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'FETCH_SONGS_START': {
      return {
        ...state,
        isLoading: true
      }
    }
    case 'FETCH_SONGS_SUCCESS': {
      return {
        ...state,
        tracks: [...state.tracks, action.payload],
        isLoading: false
      }
    }
    case 'FETCH_SONGS_ERROR': {
      return {
        ...state,
        error: action.error,
        isLoading: false
      }
    }
    // default
    default: {
      return state;
    }
  }
}

export default songsReducer;
