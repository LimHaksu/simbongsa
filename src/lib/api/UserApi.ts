import axios, { AxiosResponse } from "axios";
import storage from "lib/storage";
import jwt from "jsonwebtoken";
import getHeaders from './getHeaders';

const restBaseApi = process.env.REACT_APP_REST_BASE_API!;

/// 팔로우 관련 API 시작
export const getUserFollower = (userId: string) => {
  const headers = getHeaders();
  try {
    return axios.get(
      restBaseApi + "/follow/" + userId + "/followers", { headers }
    );
  } catch (error) {
    return error;
  }
};

export const getUserFollowing = (userId: string) => {
  const headers = getHeaders();
  try {
    return axios.get(
      restBaseApi + "/follow/" + userId + "/followees", { headers });
  } catch (error) {
    return error;
  }
};

export const checkFollow = (followerId: string, followeeId: string) => {
  const headers = getHeaders();
  try {
    return axios.get(
      restBaseApi + "/isfollowing?follower_userid=" +
      followerId +
      "&followee_userid=" +
      followeeId,
      { headers }
    );
  } catch (error) {
    return error;
  }
};

export const followUser = (
  follower_userid: string,
  followee_userid: string
) => {
  const headers = getHeaders();
  const data = {
    "followee_userid": followee_userid,
    "follower_userid": follower_userid
  }
  try {
    return axios.post(restBaseApi + "/insertfollow/", data, { headers });
  } catch (error) {
    return error;
  }
};

export const unfollowUser = (
  follower_userid: string,
  followee_userid: string
) => {
  const headers = getHeaders();
  const data = {
    "followee_userid": followee_userid,
    "follower_userid": follower_userid
  }
  try {
    return axios.post(restBaseApi + "/deletefollow/", data, { headers });
  } catch (error) {
    return error;
  }
};
/// 팔로우 관련 API 끝
interface Iprefer {
  age: any;
  bgnTm: any;
  endTm: any;
  preferCategory: any;
  preferRegion: any;
  userId: any;
}

export const localPreferRegister: ({
  age,
  bgnTm,
  endTm,
  preferCategory,
  preferRegion,
  userId
}: Iprefer) => false | Promise<AxiosResponse<any>> = ({
  age,
  bgnTm,
  endTm,
  preferCategory,
  preferRegion,
  userId
}: Iprefer) => {
    let data = {
      m_age: age,
      m_bgnTm: bgnTm,
      m_endTm: endTm,
      prefer_category: preferCategory,
      prefer_region: preferRegion
    };

    try {
      const headers = getHeaders();
      return axios.patch(restBaseApi + `/rest/Member/${userId}`, data, { headers });
    } catch (error) {
      console.log(error);
      return error;
    }
  };

export const localPreferInfo = (userId: string) => {
  try {
    const tokenTemp = storage.get("token");
    const temp: any = jwt.decode(tokenTemp);
    const userId2 = temp.iss;
    const headers = getHeaders();
    return axios.get(restBaseApi + `/rest/Member/${userId2}/PreferDetail`, { headers });
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getPreferFeedList = (mId: string, pgNum: number) => {
  try {
    const tokenTemp = storage.get("token");
    const temp: any = jwt.decode(tokenTemp);
    const mId2 = temp.aud;
    const headers = getHeaders();
    return axios.get(restBaseApi + `/rest/PostFeed/${mId2}/8/${pgNum}`, { headers });
  } catch (error) {
    console.log(error);
    return true;
  }
};

export const getNormalFeedList = (mId: string, pgNum: number) => {
  try {
    const tokenTemp = storage.get("token");
    const temp: any = jwt.decode(tokenTemp);
    const mId2 = temp.aud;
    const headers = getHeaders();
    return axios.get(restBaseApi + `/rest/PostFeed2/${mId2}/2/${pgNum}`, { headers });
  } catch (error) {
    console.log(error);
    return true;
  }
};

export const changePassword = async (eMail: string, password: string) => {
  let data = { m_email: eMail, m_password: password };
  const headers = getHeaders();
  let response = await axios.post(restBaseApi + "/rest/Member/Password", data, { headers });
  return response;
};

export const getUserInfo = (userId: string) => {
  const headers = getHeaders();
  try {
    return axios.get(`${restBaseApi}/rest/Member/${userId}`, { headers });
  } catch (error) {
    return error;
  }
};


// 회원 탈퇴
export const deleteUser = async (
  m_id: string
) => {
  try {
    const headers = getHeaders();
    return axios.delete(restBaseApi + `/rest/Member/${m_id}`, { headers });
  } catch (error) {
    console.log(error);
    return true;
  }
}
