import {Song} from '../../../models/song';

export interface HomeState {
  newsFeed: Song[];
}

export const initialState: HomeState = {
  newsFeed: []
};
