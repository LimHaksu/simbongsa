import { createAction, handleActions } from "redux-actions";
import { pender } from "redux-pender"; // aixos 응답 이후 작업을 할때 pender 사용
import { Record, Map, List } from "immutable"; // json 형태의 객체 -> Map으로 만들어 immutable 속성 유지
import * as VolApi from "lib/api/VolApi";
import { number } from "prop-types";

type CreatePayload = string;
type RemovePayload = number;
type TogglePayload = number;
type ChangeInputPayload = string;

// 가장 아래 있는 handleActions와 연결해줌
const SET_SELECTED_VOLUNTEER = "vol/GET_VOL_BY_ID"; // v_id로 봉사정보 가져오기
const GET_VOL_LIST_TO_LIST = "vol/GET_VOL_LIST_TO_LIST";
const GET_VOL_LIST = "vol/GET_VOL_LIST";
const RESET_SELECTED_VOL = "vol/RESET_SELECTED_VOL";
const SET_CURRENT_LOCATION = "vol/SET_CURRENT_LOCATION";
const SET_VOL_MAP = "vol/SET_VOL_MAP";
const SET_SELECTED_MARKER = "vol/SET_SELECTED_MARKER";
const SET_VOL_LIST_FOR_MAP = "vol/SET_VOL_LIST_FOR_MAP";
const APPEND_VOL_LIST = "volunteer/APPEND_VOL_LIST";
const GET_VOL_DETAIL = "volunteer/GET_VOL_DETAIL";
const SET_SHOW_VOL_INFO = "vol/SET_SHOW_VOL_INFO";
const SELECT_VOL = "volunteer/SELECT_VOL";
const GET_VOL_LIST_BY_USER_ID = "vol/GET_VOL_LIST_BY_USER_ID";
const DAY_VOL_LIST = "vol/DAY_VOL_LIST";
const RESET_VOLUNTEER_FOR_LIST = "vol/RESET_VOLUNTEER_FOR_LIST";
const APPEND_VOL_LIST_FORCAL = "vol/APPEND_VOL_LIST_FORCAL"
export const dayVolList = createAction(DAY_VOL_LIST);
export const setVolMap = createAction(SET_VOL_MAP);
export const setSelectedVolunteer = createAction(
  SET_SELECTED_VOLUNTEER,
  VolApi.getVolDetail
);
export const resetSelectedVol = createAction(RESET_SELECTED_VOL);
export const getVolList = createAction(GET_VOL_LIST, VolApi.getVolListBySearch); // 이후 list 받는 api로 수정해야함
export const getVolListToList = createAction(GET_VOL_LIST_TO_LIST, VolApi.getVolListBySearchPage); // 이후 list 받는 api로 수정해야함
export const setCurrentLocation = createAction(SET_CURRENT_LOCATION);
export const setSelectedMarker = createAction(SET_SELECTED_MARKER);
export const setVolunteersForMap = createAction(SET_VOL_LIST_FOR_MAP);
export const appendList = createAction(
  APPEND_VOL_LIST,
  VolApi.getVolListBySearchPage
);
export const resetVolunteerForList = createAction(RESET_VOLUNTEER_FOR_LIST);
export const appendListForCal = createAction(APPEND_VOL_LIST_FORCAL)
export const getVolDetail = createAction(GET_VOL_DETAIL, VolApi.getVolDetail);
export const setShowVolInfo = createAction(SET_SHOW_VOL_INFO);
export const selectVol = createAction(SELECT_VOL);
export const getInitailList = createAction(
  GET_VOL_LIST_TO_LIST,
  VolApi.getVolListBySearchPage
);
export const getVolListByUserId = createAction(
  GET_VOL_LIST_BY_USER_ID,
  VolApi.getVolListByUserId
);

export interface volState {
  volunteers: List<any>;
  volunteersForList: List<any>;
  volunteersForMap: List<any>;
  volunteersForCal: List<any>;
  currentLocation: { y: number; x: number };
  selectedVolunteer: {};
  selectedMarker: any;
  showVolInfo: boolean;
  volunteer: Object;
  volListByUserId: List<any>;

}

const initialState = Map({
  volunteers: List([]),
  volunteersForList: List([]),
  volunteersForMap: List([]), // 지도에서 검색결과로 사용할 봉사리스트
  volunteersForCal: List([]), // 달력에서 검색결과로 사용할 봉사리스트
  currentLocation: { y: 35.888013, x: 127.791075 },
  selectedVolunteer: { v_id: null },
  volMap: null,
  selectedMarker: null,
  showVolInfo: false,
  volunteer: { v_id: null },
  volListByUserId: List([]),
});

export default handleActions<any>(
  {
    [SET_VOL_MAP]: (state, action) => {
      return state.set("volMap", action.payload);
    },
    [SELECT_VOL]: (state, action) => {
      return state.setIn(["volunteer", "v_id"], action.payload);
    },
    [SET_CURRENT_LOCATION]: (state, action) => {
      return state.set("currentLocation", action.payload);
    },
    [RESET_SELECTED_VOL]: state => {
      return state.setIn(["selectedVolunteer", "v_id"], null);
    },
    [SET_SELECTED_MARKER]: (state, action) => {
      return state.set("selectedMarker", action.payload);
    },
    [SET_VOL_LIST_FOR_MAP]: (state, action) => {
      return state.set("volunteersForMap", List(action.payload));
    },
    [SET_SHOW_VOL_INFO]: (state, action) => {
      return state.set("showVolInfo", action.payload);
    },
    [DAY_VOL_LIST]: (state, action) => {
      return state.set("volunteersForCal", List(action.payload));
    },
    [RESET_VOLUNTEER_FOR_LIST] : (state) =>{
      return state.set("volunteerForList", List([]));
    },
    ...pender({
      type: SET_SELECTED_VOLUNTEER,
      onSuccess: (state, action) => {
        const { data } = action.payload.data;
        return state.set("selectedVolunteer", data);
      }
    }),
    ...pender({
      type: GET_VOL_LIST_TO_LIST,
      onSuccess: (state, action) => {
        const { data } = action.payload.data;
        return state.set("volunteersForList", List(data));
      },
      onFailure: (state, action) => {
      }
    }),
    ...pender({
      type: GET_VOL_LIST,
      onSuccess: (state, action) => {
        const { data } = action.payload.data;
        return state.set("volunteers", List(data));
      },
      onFailure: (state, action) => {
      }
    }),
    ...pender({
      type: APPEND_VOL_LIST,
      onSuccess: (state, action) => {
        const volunteersForList = state.get("volunteersForList");
        return state.set(
          "volunteersForList",
          volunteersForList.concat(action.payload.data.data)
        );
      }
    }),
    ...pender({
      type: GET_VOL_DETAIL,
      onSuccess: (state, action) =>
        state.set("volunteer", action.payload.data.data)
    }),
    ...pender({
      type: GET_VOL_LIST_BY_USER_ID,
      onSuccess: (state, action) => {
        const { data } = action.payload.data;
        return state.set("volListByUserId", List(data));
      }
    })
  },
  initialState
);
