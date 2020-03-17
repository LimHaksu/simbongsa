import axios from "axios";
import storage from "lib/storage";

const restBaseApi = process.env.REACT_APP_REST_BASE_API!;

export const postPosting = (posting: FormData) => {
  try {
    const token = "Bearer " + storage.get("token");
    return axios.post(restBaseApi, posting, {
      headers: { Authorization: token }
    });
  } catch (err) {
    console.log(err);
    return true;
  }
};

export const postReview = (posting: FormData) => {
  try {
    const token = "Bearer " + storage.get("token");
    return axios.post(restBaseApi, posting, {
      headers: { Authorization: token }
    });
  } catch (err) {
    console.log(err);
    return true;
  }
};

export const getPosts = (postNum: number): any => {
  try {
    const token = "Bearer " + storage.get("token");
    return axios.get(restBaseApi + "/rest/Post/" + postNum, {
      headers: { Authorization: token }
    });
  } catch (err) {
    console.log(err);
    return true;
  }
};

export const deletePost = (postNum: number): any => {
  try {
    const token = "Bearer " + storage.get('token');
    return axios.delete(restBaseApi + "/rest/Post/" + postNum,
      { headers: { Authorization: token } });
  } catch (err) {
    console.log(err);
    return true;
  }

}


export const uploadProfileImage = async (mId: string, file: any) => {
  const token = "Bearer " + storage.get("token");
  let response = await axios.post(
    restBaseApi + `/rest/Member/PostProfile/${mId}`,
    file,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token
      }
    }
  );
  let data = response.data;
  return data;
};

export const getPostByUser = (userId: string, pageNum: number) => {
  const token = "Bearer " + storage.get("token");
  try {
    return axios.get(
      restBaseApi + `/rest/Member/Post/${userId}/10/${pageNum}`,
      {
        headers: { Authorization: token }
      }
    );
  } catch (error) {
    console.log(error);
    return true;
  }
};

export const insertPostVote = (postVote: { p_id: number, m_id: string }): any => {
  const token = "Bearer " + storage.get("token");
  try {
    return axios.post(restBaseApi + "/rest/PostVote/",
      postVote,
      { headers: { Authorization: token } });
  } catch (err) {
    console.log(err)
    return false;
  }
}

export const deletePostVote = ( m_id: string, p_id: number ): any => {
  const token = "Bearer " + storage.get("token");
  try {
    return axios.delete(`${restBaseApi}/rest/PostVote/${m_id}/${p_id}`,
      { headers: { Authorization: token } });
  } catch (err) {
    console.log(err)
    return false;
  }
}

export const getComment = (inP_id: number): any => {
  const token = "Bearer " + storage.get("token");
  try {
    return axios.get(restBaseApi + `/rest/Comment/${inP_id}`,
      { headers: { Authorization: token } });
  } catch (err) {
    console.log(err)
    return false;
  }
}

export const postComment = (commet: { c_content: string, p_id: string, m_id: string }): any => {
  const token = "Bearer " + storage.get("token");
  try {
    return axios.post(restBaseApi + '/rest/Comment',
      commet,
      { headers: { Authorization: token } }
    )
  } catch (error) {
    console.log(error);
  }
}

export const deleteComment = (c_id: number): any => {
  const token = "Bearer " + storage.get("token");
  try {
    return axios.delete(restBaseApi + `/rest/Comment/${c_id}`,
      { headers: { Authorization: token } })
  } catch (error) {
    console.log(error);
    return false;
  }
}