import { createAction, handleActions } from "redux-actions";

import { Map, List } from "immutable";
import * as UserAPI from "lib/api/UserApi";
import { pender } from "redux-pender";
import * as userActions from "redux/modules/user";

const SET_LOGGED_INFO = "user/SET_LOGGED_INFO"; // 로그인 정보 설정
const SET_VALIDATED = "user/SET_VALIDATED"; // validated 값 설정
const SET_PREFER_INFO = "user/SET_PREFER_INFO"; // 큐레이션 설정 불러오기
const CHANGE_LOADING = "user/CHANGE_LOADING"; // loading 설정
const GET_NORMAL_FEED_LIST = "user/GET_NORMAL_FEED_LIST"; // 유저의 피드 리스트 가져오기
const GET_PREFER_FEED_LIST = "user/GET_PREFER_FEED_LIST"; // 유저의 피드 리스트 가져오기
const RESET_FEED_LIST = "user/RESET_FEED_LIST";
const SET_USER_FOLLOWING_LIST = "user/SET_USER_FOLLOWING_LIST";
const SET_USER_FOLLOWER_LIST = "user/SET_USER_FOLLOWER_LIST";
const SET_USER_FOLLOW_TAG = "user/SET_USER_FOLLOW_TAG";
const FOLLOW_USER = 'user/FOLLOW_USER';
const UNFOLLOW_USER = 'user/UNFOLLOW_USER';
const SET_USER_PROFILE_IMAGE = 'user/SET_USER_PROFILE_IMAGE';
const SET_OTHERS_ID = 'user/SET_OTHERS_ID';
// const SET_USER_ID = "user/SET_USER_ID";

export const setLoggedInfo = createAction(SET_LOGGED_INFO); // loggedInfo
export const setValidated = createAction(SET_VALIDATED); // validated
export const setPreferInfo = createAction(
  SET_PREFER_INFO,
  UserAPI.localPreferInfo
);
export const changeLoading = createAction(CHANGE_LOADING);

export const getPreferFeedList = createAction(
  GET_PREFER_FEED_LIST,
  UserAPI.getPreferFeedList
);
export const getNormalFeedList = createAction(
  GET_NORMAL_FEED_LIST,
  UserAPI.getNormalFeedList
);
export const resetFeedList = createAction(RESET_FEED_LIST);

export const setUserFollowingList = createAction(SET_USER_FOLLOWING_LIST, UserAPI.getUserFollowing, profileUserId=>profileUserId); // 3번째 파라미터는 onSucess 부분에서 action.meta 입니다. 두번째 파라미터(action.payload)와 같은 인풋을 받습니다.
export const setUserFollowerList = createAction(SET_USER_FOLLOWER_LIST, UserAPI.getUserFollower, (profileUserId)=>{return profileUserId});
export const setUserFollowTag = createAction(SET_USER_FOLLOW_TAG, UserAPI.checkFollow, (loginUserId,profileUserId)=>{return profileUserId}); // 세번째 파라미터의 인풋 loginUserId는 사용하지 않지만 인풋이 두개임을 나타내기 위하여 필요함.
export const followUser = createAction(FOLLOW_USER, UserAPI.followUser, (loginUserId,profileUserId)=>{return profileUserId});
export const unfollowUser = createAction(UNFOLLOW_USER, UserAPI.unfollowUser, (loginUserId,profileUserId)=>{return profileUserId});
export const setUserProfileImage = createAction(SET_USER_PROFILE_IMAGE, UserAPI.getUserInfo, profileUserId=>profileUserId);
export const setOthersID = createAction(SET_OTHERS_ID);
// export const setUserId = createAction(SET_USER_ID);

// interface initialStateParams{
//   setIn: any;
//   set: any;
//   loggedInfo: {
//     // 현재 로그인중인 유저의 정보
//     thumbnail: string;
//     username: string;
//   };
//   logged: boolean; // 현재 로그인중인지 알려준다
//   validated: boolean; // 이 값은 현재 로그인중인지 아닌지 한번 서버측에 검증했음을 의미
//   loading: boolean;
//   normarlFeedList: List<any>;
//   preferFeedList: List<any>;
// }
const initialState = Map({
  loggedInfo: Map({
    // 현재 로그인중인 유저의 정보
    email: "",
    userId: "",
    m_id: "",
    preferInfo: Map({
      bgnTm: "",
      endTm: "",
      age: "",
      preferRegion: [],
      preferCategory: []
    }),
  }),
  logged: false, // 현재 로그인중인지 알려준다
  validated: false, // 이 값은 현재 로그인중인지 아닌지 한번 서버측에 검증했음을 의미
  loading: false,

  normalFeedList: List([]),
  preferFeedList: List([]),

  userProfileMap: Map({
    //  key : userId
    //  value : followerList: string[];
    //          followingList: string[];
    //          isProfileUserFollowedByLoginUser: boolean;
    //          profileImage : string;
  }),

  othersId : "" // 다른 사람 프로필을 조회하기 위한 아이디
});

export default handleActions<any>(
  {
    [SET_LOGGED_INFO]: (state, action) => {
      const { sub, aud, iss } = action.payload;
      // console.log("=================SET_LOGGED", sub, aud);
      return state
        .set("logged", true)
        .setIn(["loggedInfo"], Map({ username: sub, userId: iss, m_id: aud }));
    },

    [SET_VALIDATED]: (state, action) => state.set("validated", action.payload),
    [CHANGE_LOADING]: (state, action) => {
      return state.set("loading", action.payload);
    },
    [RESET_FEED_LIST] : (state) =>{
      return state.set("preferFeedList", List([])).set("normalFeedList", List([]));
    },
    ...pender({
      type: SET_PREFER_INFO,
      onSuccess: (state, action) => {
        const {
          m_bgnTm,
          m_endTm,
          m_age,
          m_prefer_region,
          m_prefer_category
        } = action.payload.data.data;
        let data = Map({
          bgnTm: m_bgnTm,
          endTm: m_endTm,
          age: m_age,
          preferRegion: m_prefer_region,
          preferCategory: m_prefer_category
        });
        return state.setIn(["loggedInfo", "preferInfo"], data);
      }
    }),
    ...pender({
      type: GET_NORMAL_FEED_LIST,
      onSuccess: (state, action) => {
        const { data } = action.payload.data;
        return state.set("normalFeedList", state.get("normalFeedList").concat(data));
      }
    }),
    ...pender({
      type: GET_PREFER_FEED_LIST,
      onSuccess: (state, action) => {
        const { data } = action.payload.data;
        return state.set("preferFeedList", state.get("preferFeedList").concat(data));
      }
    }),

    ...pender({
        type : SET_USER_FOLLOWING_LIST,
        onSuccess : (state, action) =>{
          const { data } = action.payload.data;
          const profileUserId = action.meta;       
          return state.setIn(["userProfileMap", profileUserId, "followingList"],data.map((item : any)=>item.m_userid));
        }
    }),
    ...pender({
        type : SET_USER_FOLLOWER_LIST,
        onSuccess : (state, action) =>{
          const { data } = action.payload.data;
          const profileUserId = action.meta;          
          return state.setIn(["userProfileMap", profileUserId, "followerList"], data.map((item : any)=>item.m_userid));
        }
    }),
    ...pender({
        type : SET_USER_FOLLOW_TAG,
        onSuccess : (state, action) =>{
          const { data } = action.payload.data;
          const profileUserId = action.meta; 
          return state.setIn(["userProfileMap", profileUserId, "isProfileUserFollowedByLoginUser"], data);
        }
    }),
    ...pender({
      type : FOLLOW_USER,
      onSuccess : (state, action)=>{
        // const { }
        const profileUserId = action.meta; 
        return state.setIn(["userProfileMap", profileUserId, "isProfileUserFollowedByLoginUser"], true);
      }
    }),
    ...pender({
      type : UNFOLLOW_USER,
      onSuccess : (state, action)=>{
        // const { }
        const profileUserId = action.meta; 
        return state.setIn(["userProfileMap", profileUserId, "isProfileUserFollowedByLoginUser"], false);
      }
    }),
    ...pender({
      type : SET_USER_PROFILE_IMAGE,
      onSuccess : (state, action)=>{
        const { profile } = action.payload.data.data;
        const profileUserId = action.meta;
        return state.setIn(["userProfileMap", profileUserId, "profileImage"], `${process.env.REACT_APP_REST_BASE_API}/uploads/${profile}`);
      }
    }),

    [SET_OTHERS_ID] : (state, action)=>{
      return state.set("othersId", action.payload);
    }
    // [SET_USER_ID]: (state, action) =>
    //   state.setIn(["userPforile", "ueserId"], action.payload),

  },
  initialState
);
