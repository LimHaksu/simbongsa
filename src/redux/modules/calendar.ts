import { createAction, handleActions, Action } from "redux-actions";
import moment, { Moment as MomentTypes } from "moment";
import produce from "immer";
const DATE_CHANGE = "calendar/DATE_CHANGE";
const TOGGLE_CHANGE = "calendar/TOGGLE_CHANGE";

export const changeDate = createAction(DATE_CHANGE);
export const changeToggle = createAction(TOGGLE_CHANGE);

export interface CalendarState {
  date: MomentTypes;
  toggle: boolean;
}
const initialState: CalendarState = {
  date: moment(),
  toggle: false
};

type Payload = Date | boolean;

export default handleActions<CalendarState, Payload>(
  {
    [DATE_CHANGE]: (state, action: Action<Payload>) => {
      return produce(state, (draft: { date: Payload }) => {
        draft.date = action.payload;
      });
    },
    [TOGGLE_CHANGE]: (state, action: Action<Payload>) => {
      return produce(state, (draft: { toggle: Payload }) => {
        draft.toggle = action.payload;
      });
    }
  },
  initialState
);
