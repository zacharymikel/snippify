import {Song} from '../../../models/song';

export interface ProfileState {
  userSongs: Song[];
  userProfile: {};
}

export const initialState: ProfileState = {
  userSongs: [],
  userProfile: {}
};
