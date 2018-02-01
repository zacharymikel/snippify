import { ADD_FOLLOWING, REMOVE_FOLLOWING } from './../actions/user-actions';
import {GET_USER, UPDATE_USER} from '../actions/user-actions';
import {UserState, initialState} from '../stores/user-store';
import {Action} from '@ngrx/store';
import {User} from '../../../models/user';

export function userStoreReducer(state: UserState = initialState, action: Action) {
  switch (action.type) {
    case GET_USER: {
      return {
        ...{},
        ...state.currentUser
      };
    }
    case UPDATE_USER: {
      return {
        ...state,
        ...{currentUser: action.payload}
      };
    }
    case ADD_FOLLOWING: {
      const newArray = state.currentUser.following.concat([action.payload]);
      console.log(newArray);
      const newState = {
        ...state,
        currentUser: {
          ...state.currentUser,
          ...{
            following: newArray
          }
        }
      };

      localStorage.setItem('user', JSON.stringify(newState.currentUser));
      return newState;
    }
    case REMOVE_FOLLOWING: {
      const index = state.currentUser.following.indexOf(action.payload);
      const filteredArray = state.currentUser.following.filter( f => {
        return f !== action.payload;
      });
      console.log(filteredArray);
      const newState = {
        ...state,
        currentUser: {
          ...state.currentUser,
          ...{
            following: filteredArray
          }
        }
      };
      localStorage.setItem('user', JSON.stringify(newState.currentUser));
      return newState;
    }
    default: {
      return state;
    }
  }
}
