import {User} from "../../../models/user";
import 'rxjs/Rx';

export interface UserState {
  currentUser: User
}

export const initialState: UserState = {
  currentUser: null
};
