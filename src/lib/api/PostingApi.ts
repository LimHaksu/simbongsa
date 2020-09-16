import axios from "axios";
import getHeaders from './getHeaders';

const restBaseApi = process.env.REACT_APP_REST_BASE_API!;
export const postPosting = (posting: FormData) => {
  try {
    const headers = getHeaders();
    return axios.post(restBaseApi, posting, { headers });
  } catch (err) {
    console.log(err);
    return true;
  }
};

export const postReview = (posting: FormData) => {
  try {
    const headers = getHeaders();
    return axios.post(restBaseApi, posting, { headers });
  } catch (err) {
    console.log(err);
    return true;
  }
};

export const getPosts = (postNum: number): any => {
  try {
    const headers = getHeaders();
    return axios.get(restBaseApi + "/rest/Post/" + postNum, { headers });
  } catch (err) {
    console.log(err);
    return true;
  }
};

export const deletePost = (postNum: number): any => {
  try {
    const headers = getHeaders();
    return axios.delete(restBaseApi + "/rest/Post/" + postNum, { headers });
  } catch (err) {
    console.log(err);
    return true;
  }

}


export const uploadProfileImage = async (mId: string, file: any) => {
  const headers = getHeaders();
  let response = await axios.post(
    restBaseApi + `/rest/Member/PostProfile/${mId}`,
    file, {
    headers: {
      ...headers,
      "Content-Type": "multipart/form-data",
    }
  }
  );
  let data = response.data;
  return data;
};

export const getPostByUser = (userId: string, pageNum: number) => {
  const headers = getHeaders();
  try {
    return axios.get(
      restBaseApi + `/rest/Member/Post/${userId}/10/${pageNum}`, { headers }
    );
  } catch (error) {
    console.log(error);
    return true;
  }
};

export const insertPostVote = (postVote: { p_id: number, m_id: string }): any => {
  const headers = getHeaders();
  try {
    return axios.post(restBaseApi + "/rest/PostVote/",
      postVote, { headers });
  } catch (err) {
    console.log(err)
    return false;
  }
}

export const deletePostVote = (m_id: string, p_id: number): any => {
  const headers = getHeaders();
  try {
    return axios.delete(`${restBaseApi}/rest/PostVote/${m_id}/${p_id}`, { headers });
  } catch (err) {
    console.log(err)
    return false;
  }
}

export const getComment = (inP_id: number): any => {
  const headers = getHeaders();
  try {
    return axios.get(restBaseApi + `/rest/Comment/${inP_id}`, { headers });
  } catch (err) {
    console.log(err)
    return false;
  }
}

export const postComment = (commet: { c_content: string, p_id: string, m_id: string }): any => {
  const headers = getHeaders();
  try {
    return axios.post(restBaseApi + '/rest/Comment', commet, { headers })
  } catch (error) {
    console.log(error);
  }
}

export const deleteComment = (c_id: number): any => {
  const headers = getHeaders();
  try {
    return axios.delete(restBaseApi + `/rest/Comment/${c_id}`, { headers })
  } catch (error) {
    console.log(error);
    return false;
  }
}