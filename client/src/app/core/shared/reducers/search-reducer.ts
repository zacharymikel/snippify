import { Action } from '@ngrx/store';
import {SearchState, initialState} from '../stores/search-store';
import {SEARCH_RESULTS_LOADED} from '../actions/search-actions';
import { User } from '../../../models/user';

export function searchStoreReducer(state: SearchState = initialState, action: Action) {
  switch (action.type) {
    case SEARCH_RESULTS_LOADED: {
      return {
        ...state,
        ...{users: action.payload}
      };
    }
    default: {
      return state;
    }
  }
}
