import axios, { AxiosResponse } from "axios";
import storage from "lib/storage";
import jwt from "jsonwebtoken";

const restBaseApi = process.env.REACT_APP_REST_BASE_API!;

/// 팔로우 관련 API 시작
export const getUserFollower = (userId: string) => {
  const token = "Bearer " + storage.get("token");
  try{
    return axios.get(
      restBaseApi + "/follow/" + userId + "/followers",
      { headers: { Authorization: token } }
    );
  }catch(error){
    return error;
  }
};

export const getUserFollowing = (userId: string) => {
  const token = "Bearer " + storage.get("token");
  try{
    return axios.get(
      restBaseApi + "/follow/" + userId + "/followees",
      { headers: { Authorization: token } }
    );
  }catch(error){
    return error;
  }
};

export const checkFollow = (followerId: string, followeeId: string) => {
  const token = "Bearer " + storage.get("token");
  try{
    return axios.get(
      restBaseApi + "/isfollowing?follower_userid=" +
    followerId +
    "&followee_userid=" +
    followeeId,
      { headers: { Authorization: token } }
    );
  }catch(error){
    return error;
  }
};

export const followUser =  (
  follower_userid: string,
  followee_userid: string
) => {
  const token = "Bearer " + storage.get("token");
  const data = { 
    "followee_userid": followee_userid,
  "follower_userid": follower_userid
}
  try{
    return axios.post(restBaseApi + "/insertfollow/", data, {
      headers: { Authorization: token }
    });
  }catch(error){
    return error;
  }
};

export const unfollowUser = (
  follower_userid: string,
  followee_userid: string
) => {
  const token = "Bearer " + storage.get("token");
  const data = { 
    "followee_userid": followee_userid,
  "follower_userid": follower_userid
}
  try{
    return axios.post(restBaseApi + "/deletefollow/", data, {
      headers: { Authorization: token }
    });
  }catch(error){
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
      const token = "Bearer " + storage.get("token");
      return axios.patch(restBaseApi + `/rest/Member/${userId}`, data, {
        headers: { Authorization: token }
      });
    } catch (error) {
      console.log(error);
      return error;
    }
    // try {
    //   return axios.post(restBaseApi + "Member", data);
    // } catch (error) {
    //   console.log(error);
    //   return true;
    // }
  };

export const localPreferInfo = (userId: string) => {
  try {
    const tokenTemp = storage.get("token");
    const temp: any = jwt.decode(tokenTemp);
    const userId2 = temp.iss;
    const token = "Bearer " + storage.get("token");
    return axios.get(restBaseApi + `/rest/Member/${userId2}/PreferDetail`, {
      headers: { Authorization: token }
    });
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
    const token = "Bearer " + storage.get("token");
    // return axios.get(restBaseApi + `rest/PostFeed/3/10/${pgNum}`, {
    return axios.get(restBaseApi + `/rest/PostFeed/${mId2}/8/${pgNum}`, {
      headers: { Authorization: token }
    });
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
    const token = "Bearer " + storage.get("token");
    // return axios.get(restBaseApi + `rest/PostFeed/3/10/${pgNum}`, {
    return axios.get(restBaseApi + `/rest/PostFeed2/${mId2}/2/${pgNum}`, {
      headers: { Authorization: token }
    });
  } catch (error) {
    console.log(error);
    return true;
  }
};

export const changePassword = async (eMail: string, password: string) => {
  let data = { m_email: eMail, m_password: password };
  const token = "Bearer " + storage.get("token");
  let response = await axios.post(restBaseApi + "/rest/Member/Password", data, {
    headers: { Authorization: token }
  });
  // response 안에서 데이터 추출하기.
  return response;
};

export const getUserInfo = (userId: string) => {
  const token = "Bearer " + storage.get("token");
  try{
    return axios.get(`${restBaseApi}/rest/Member/${userId}`, {
      headers: { Authorization: token }
    });
  }catch(error){
    return error;
  }
};


// 회원 탈퇴
export const deleteUser = async (
  m_id: string
) => {
  try {
    const token = "Bearer " + storage.get("token");
    return axios.delete(restBaseApi + `/rest/Member/${m_id}`, {
      headers: { Authorization: token }
    });
  } catch (error) {
    console.log(error);
    return true;
  }
}
