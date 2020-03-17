import axios from "axios";
import storage from "lib/storage";

const restBaseApi = process.env.REACT_APP_REST_BASE_API!;

// let headers = {
//   // "Access-Contorl-Allow-Origin": "*",
//   // "Access-Contorl-Allow-Method": "*",
//   // "Access-Contorl-Allow-Headers": "*",
//   // "Access-Contorl-Allow-Credencial": true,
//   Authorization: ""
// };


export const getVolListBySearch = ({ input, firstLocation, secondLocation, thirdLocation, firstCategory, secondCategory, thirdCategory, bgnTm, endTm, age }: any) => {
  try {
    const token = "Bearer " + storage.get("token");
    let url = restBaseApi + '/vol/titles/4000/1/filtering/?'
    let isAmpersand = false
    if (firstLocation[0] !== 'null') {
      if (isAmpersand) {
        url += '&'
      }
      url += `r_sidoNm1=${firstLocation[0]}&r_gugunNm1=${firstLocation[1]}`
      isAmpersand = true
    }
    if (secondLocation[0] !== 'null') {
      if (isAmpersand) {
        url += '&'
      }
      url += `r_sidoNm2=${secondLocation[0]}&r_gugunNm2=${secondLocation[1]}`
      isAmpersand = true
    }
    if (thirdLocation[0] !== 'null') {
      if (isAmpersand) {
        url += '&'
      }
      url += `r_sidoNm3=${thirdLocation[0]}&r_gugunNm3=${thirdLocation[1]}`
      isAmpersand = true
    }
    if (firstCategory !== null) {
      if (isAmpersand) {
        url += '&'
      }
      url += `ca_highNm1=${firstCategory}`
      isAmpersand = true
    }
    if (secondCategory !== null) {
      if (isAmpersand) {
        url += '&'
      }
      url += `ca_highNm2=${secondCategory}`
      isAmpersand = true
    }
    if (thirdCategory !== null) {
      if (isAmpersand) {
        url += '&'
      }
      url += `ca_highNm3=${thirdCategory}`
      isAmpersand = true
    }
    if (input !== '') {
      if (isAmpersand) {
        url += '&'
      }
      url += `vol_title=${input}`
      isAmpersand = true
    }
    if (age !== '') {
      if (isAmpersand) {
        url += '&'
      }
      url += `m_age=${age}`
      isAmpersand = true
    }
    if (isAmpersand) {
      url += '&'
    }
    url += `v_bgnTm=${bgnTm}&v_endTm=${endTm}`


    return axios.get(
      url,
      //restBaseApi + `/vol/titles/4000/1/filtering/?r_sidoNm1=${firstLocation[0]}&r_sidoNm2=${secondLocation[0]}&r_sidoNm3=${thirdLocation[0]}&r_gugunNm1=${firstLocation[1]}&r_gugunNm2=${secondLocation[1]}&r_gugunNm3=${thirdLocation[1]}&ca_highNm1=${firstCategory}&ca_highNm2=${secondCategory}&ca_highNm3=${thirdCategory}&v_bgnTm=${bgnTm}&v_endTm=${endTm}&vol_title=${input}`,
      // v_bgnTm=${bgnTm}&v_endTm=${endTm}&vol_title=${input}`,
      { headers: { Authorization: token } }
    ); // 1/1  (페이지당 한개)/(1페이지)
  } catch (error) {
    console.log(error);
    return true;
  }
};

export const getVolDetail = (id: number): any => {
  try {

    const token = "Bearer " + storage.get("token");
    return axios.get(restBaseApi + "/vol/detail/" + id, {
      headers: { Authorization: token }
    });
  } catch (error) {
    console.log(error);
    return true;
  }
};
export const getVolListBySearchPage = ({ input, firstLocation, secondLocation, thirdLocation, firstCategory, secondCategory, thirdCategory, bgnTm, endTm, pageNum, age }: any) => {
  try {
    const token = "Bearer " + storage.get("token");
    let url = restBaseApi + `/vol/titles/10/${pageNum}/filtering/?`
    let isAmpersand = false
    if (firstLocation[0] !== 'null') {
      if (isAmpersand) {
        url += '&'
      }
      url += `r_sidoNm1=${firstLocation[0]}&r_gugunNm1=${firstLocation[1]}`
      isAmpersand = true
    }
    if (secondLocation[0] !== 'null') {
      if (isAmpersand) {
        url += '&'
      }
      url += `r_sidoNm2=${secondLocation[0]}&r_gugunNm2=${secondLocation[1]}`
      isAmpersand = true
    }
    if (thirdLocation[0] !== 'null') {
      if (isAmpersand) {
        url += '&'
      }
      url += `r_sidoNm3=${thirdLocation[0]}&r_gugunNm3=${thirdLocation[1]}`
      isAmpersand = true
    }
    if (firstCategory !== null) {
      if (isAmpersand) {
        url += '&'
      }
      url += `ca_highNm1=${firstCategory}`
      isAmpersand = true
    }
    if (secondCategory !== null) {
      if (isAmpersand) {
        url += '&'
      }
      url += `ca_highNm2=${secondCategory}`
      isAmpersand = true
    }
    if (thirdCategory !== null) {
      if (isAmpersand) {
        url += '&'
      }
      url += `ca_highNm3=${thirdCategory}`
      isAmpersand = true
    }
    if (input !== '') {
      if (isAmpersand) {
        url += '&'
      }
      url += `vol_title=${input}`
      isAmpersand = true
    }
    if (age !== '') {
      if (isAmpersand) {
        url += '&'
      }
      url += `m_age=${age}`
      isAmpersand = true
    }
    if (isAmpersand) {
      url += '&'
    }
    url += `v_bgnTm=${bgnTm}&v_endTm=${endTm}`


    return axios.get(
      url,
      //restBaseApi + `/vol/titles/4000/1/filtering/?r_sidoNm1=${firstLocation[0]}&r_sidoNm2=${secondLocation[0]}&r_sidoNm3=${thirdLocation[0]}&r_gugunNm1=${firstLocation[1]}&r_gugunNm2=${secondLocation[1]}&r_gugunNm3=${thirdLocation[1]}&ca_highNm1=${firstCategory}&ca_highNm2=${secondCategory}&ca_highNm3=${thirdCategory}&v_bgnTm=${bgnTm}&v_endTm=${endTm}&vol_title=${input}`,
      // v_bgnTm=${bgnTm}&v_endTm=${endTm}&vol_title=${input}`,
      { headers: { Authorization: token } }
    ); // 1/1  (페이지당 한개)/(1페이지)
  } catch (error) {
    console.log(error);
    return true;
  }
};


export const getVolListByUserId = (userId: string): any => {
  try {
    const token = "Bearer " + storage.get("token");
    return axios.get(restBaseApi + "/rest/Member/" + userId + "/Vote", {
      headers: { Authorization: token }
    });
  } catch (error) {
    return true;
  }
};

export const getVolFeed = (v_id : string, pageNum : number) : any => {
  try{
    const token = "Bearer " + storage.get('token');
    return axios.get(`${restBaseApi}/rest/VolFeed/${v_id}/10/${pageNum}`,{
      headers : { Authorization : token }
    });
  }catch(error){
    return error;
  }

}
