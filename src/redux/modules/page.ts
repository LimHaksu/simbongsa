import { createAction, handleActions } from "redux-actions";
import { Map, List } from "immutable";

enum VolTab{
    List,
    Map,
    Calendar
}
enum UserPageTab{
    Volunteer,
    Post,
    Statistics
}
const SET_CURRENT_TAB = "page/SET_CURRENT_TAB";
const SET_CURRENT_MAP_INFO = "page/SET_CURRENT_MAP_INFO"
const SET_VOL_LIST_FOR_MAP = "page/SET_VOL_LIST_FOR_MAP";
export const setCurrentTab = createAction(SET_CURRENT_TAB);
export const setCurrentMapInfo = createAction(SET_CURRENT_MAP_INFO);
export const setVolListForMap = createAction(SET_VOL_LIST_FOR_MAP);
const initialState = Map({
    currentTab : 0,
    currentMapInfo : Map({
        location : Map({y : 0, x : 0}),
        level : 14,
    }),
});

export default handleActions<any>(
  {
    [SET_CURRENT_TAB] : (state, action) =>{
        return state.set("currentTab", action.payload);
    },
    [SET_CURRENT_MAP_INFO] : (state, action) =>{
        const { y, x, level } = action.payload;
        const data = { location : { y : y, x : x}, level : level};
        return state.set("currentMapInfo", Map(data));
    },
  },
  initialState
);
