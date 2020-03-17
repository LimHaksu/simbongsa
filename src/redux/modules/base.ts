import { Map } from "immutable";
import { handleActions, createAction } from "redux-actions";

const SET_HEADER_VISIBILITY = "base/SET_HEADER_VISIBILITY"; // 헤더 렌더링 여부 설정
const SET_INITIAL_NUMBER = 'base/SET_PAGE_NUMBER';

export const setHeaderVisibility = createAction(SET_HEADER_VISIBILITY); // visible
export const setInitialNumber = createAction(SET_INITIAL_NUMBER);

const initialState = Map({
  header: Map({
    visible: true
  }),
  initialNumber: 1
});

export default handleActions(
  {
    [SET_HEADER_VISIBILITY]: (state, action) =>
      state.setIn(["header", "visible"], action.payload),
    [SET_INITIAL_NUMBER]: (state, action) => {
      return state.setIn(["initialNumber"], action.payload);
    }
  },
  initialState
);
