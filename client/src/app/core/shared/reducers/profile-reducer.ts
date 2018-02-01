import {PROFILE_LOADED, PROFILE_FEED_LOADED, UPDATE_FEED, REMOVE_SONG} from '../actions/profile-actions';
import {Action} from '@ngrx/store';
import {ProfileState, initialState} from '../stores/profile-store';

export function profileStoreReducer(state: ProfileState = initialState, action: Action) {
  switch (action.type) {
    case PROFILE_LOADED: {
      return {
        ...state,
        ...{userProfile: action.payload}
      };
    }
    case PROFILE_FEED_LOADED: {
      return {
        ...state,
        ...{userSongs: action.payload}
      };
    }
    case UPDATE_FEED: {
      const newArray = state.userSongs.concat(action.payload);
      return {
        ...state,
        ...{userSongs: newArray}
      };
    }
    case REMOVE_SONG: {
      const filteredArray = state.userSongs.filter(song => {
        return song.id !== action.payload;
      });
      return {
        ...state,
        ...{userSongs: filteredArray}
      };
    }
    default: {
      return state;
    }
  }
}
