import { REMOVE_FROM_NEWS_FEED } from './../actions/home-actions';
import {UPDATE_NEWS_FEED, NEWS_FEED_LOADED} from '../actions/home-actions';
import {Action} from '@ngrx/store';
import {HomeState, initialState} from '../stores/home-store';
import {Song} from '../../../models/song';

export function homeStoreReducer(state: HomeState = initialState, action: Action) {
  switch (action.type) {
    case NEWS_FEED_LOADED: {
      state.newsFeed = action.payload;
      return state;
    }
    case UPDATE_NEWS_FEED: {
      const newArray = state.newsFeed.concat(action.payload as Song[]);
      return Object.assign({}, state.newsFeed, {
        newsFeed: newArray
      });
    }
    case REMOVE_FROM_NEWS_FEED: {
      const newArray = state.newsFeed.filter( song => {
        return song.id !== action.payload;
      });
      return Object.assign({}, state.newsFeed, {
        newsFeed: newArray
      });
    }
    default: {
      return state;
    }
  }
}
