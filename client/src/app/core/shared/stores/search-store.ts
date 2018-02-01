import { User } from '../../../models/user';

export interface SearchState {
  users: User[];
}

export const initialState: SearchState = {
  users: []
};
