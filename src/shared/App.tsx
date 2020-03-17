import React, { Component } from "react";
import Router from './Router'
import { Grid, Segment, Dimmer, Loader } from "semantic-ui-react";
import { List } from "immutable"

// 로컬에 저장
import storage from "lib/storage";
// redux 관련
import * as userActions from "redux/modules/user";
import * as searchActions from "redux/modules/search";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import jwt from "jsonwebtoken";
// json 관련
import locationAllList from "lib/json/temp.json";
import categoryAllList from "lib/json/searchCategory.json";

import { Container, Image } from 'semantic-ui-react'
import * as volActions from 'redux/modules/vol';
interface IProps {
  UserActions: any
  VolActions: any
  SearchActions: any
  userId: string
  preferInfo: any
  input: string
  locations: List<any>
  categorys: List<any>
  times: any
  loading: boolean
}
class App extends Component<IProps> {
  initializeUserInfo = async () => {
    const token = storage.get("token"); // 로그인 정보를 로컬스토리지에서 가져옵니다.
    if (!token) return; // 로그인 정보가 없다면 여기서 멈춥니다.
    const temp = jwt.decode(token);
    const { UserActions, loading } = this.props;

    await UserActions.setLoggedInfo(temp);

    const { userId } = this.props
    await UserActions.setPreferInfo(userId);
    const { preferInfo } = this.props
    this.initializePreferInfo(preferInfo)

    await this.initialSearch()

    // history.push("/mainpage");
  };
  initialSearch = () => {
    const { input, VolActions, locations, categorys, times } = this.props
    let preferLocate = locations.toJS().map((location: any) => location.text)
    let preferCategory = categorys.toJS().map((category: any) => category.text)
    const locateSize = preferLocate.length
    const categorySize = preferCategory.length
    for (let i = 0; i < 3 - locateSize; i++) {
      preferLocate.push("null null")
    }
    for (let i = 0; i < 3 - categorySize; i++) {
      preferCategory.push(null)
    }
    const firstLocation = preferLocate[0].split(" ")
    const secondLocation = preferLocate[1].split(" ")
    const thirdLocation = preferLocate[2].split(" ")

    const firstCategory = preferCategory[0]
    const secondCategory = preferCategory[1]
    const thirdCategory = preferCategory[2]

    const { bgnTm, endTm } = times.toJS()

    
    VolActions.getVolList({ input: input, firstLocation: firstLocation, secondLocation: secondLocation, thirdLocation: thirdLocation, firstCategory: firstCategory, secondCategory: secondCategory, thirdCategory: thirdCategory, bgnTm: bgnTm, endTm: endTm })
    VolActions.getInitailList({ input: input, firstLocation: firstLocation, secondLocation: secondLocation, thirdLocation: thirdLocation, firstCategory: firstCategory, secondCategory: secondCategory, thirdCategory: thirdCategory, bgnTm: bgnTm, endTm: endTm, pageNum: 1 })
  }
  initializePreferInfo = (preferInfo: any) => {
    const { SearchActions } = this.props;
    if (preferInfo) {
      const info = preferInfo.toJS();

      if(info.bgnTm === null){
        SearchActions.initialInsert({
          form: "times",
          key: "bgnTm",
          value: "00:00:00"
        });
      }
      else{
        SearchActions.initialInsert({
          form: "times",
          key: "bgnTm",
          value: info.bgnTm
        });
      }
      if(info.endTm === null){
        SearchActions.initialInsert({
          form: "times",
          key: "endTm",
          value: "24:00:00" 
        });
    }
    else{
      if(info.endTm === "23:59:59"){
        SearchActions.initialInsert({
          form: "times",
          key: "endTm",
          value: "24:00:00" 
        });
      }
      else{
      SearchActions.initialInsert({
        form: "times",
        key: "endTm",
        value: info.endTm 
      });
    }
    }
      // 나이 관련
      const today = new Date();
      const year = today.getFullYear();
      if (!info.age) {
        SearchActions.initialInsert({
          form: "ages",
          key: "adult",
          value: false
        });
        SearchActions.initialInsert({
          form: "ages",
          key: "youth",
          value: false
        });
      } else {
        const age = Number(info.age.split("-")[0]);
        const result = Math.abs(age - year);
        if (result > 18) {
          SearchActions.initialInsert({
            form: "ages",
            key: "adult",
            value: true
          });
          SearchActions.initialInsert({
            form: "ages",
            key: "youth",
            value: false
          });
        } else if (0 < result && result <= 18) {
          SearchActions.initialInsert({
            form: "ages",
            key: "adult",
            value: false
          });
          SearchActions.initialInsert({
            form: "ages",
            key: "youth",
            value: true
          });
        } else {
          SearchActions.initialInsert({
            form: "ages",
            key: "adult",
            value: false
          });
          SearchActions.initialInsert({
            form: "ages",
            key: "youth",
            value: false
          });
        }
      }

      for (let j = 0; j < info.preferRegion.length; j++) {
        //지역 관련
        const splitValue = locationAllList[
          info.preferRegion[j] - 1
        ].value.split("/");
        SearchActions.insert({
          form: "location",
          text: splitValue[1],
          key: splitValue[0]
        });
      }

      // 봉사활동 카테고리 관련
      for (let j = 0; j < info.preferCategory.length; j++) {
        const number: keyof typeof categoryAllList = info.preferCategory[j]
        SearchActions.insert({
          form: "category",
          text: categoryAllList[number],
          key: number
        });
      }
    }
  }



  initialLoad = (userId: string) => {
    const { UserActions } = this.props;
    UserActions.setPreferInfo(userId);
  };
  // shouldComponentUpdate(nextProps: any) {
  //   const { userId } = this.props;
  //   console.log("tihs.props", this.props);
  //   console.log("nextProps", nextProps);
  //   const userId2 = nextProps.userId;
  //   console.log("userid의 변화", userId, userId2);
  //   if (userId !== userId2) {
  //     this.initialLoad(userId2);
  //   }
  //   const { preferInfo } = this.props;
  //   const preferInfo2 = nextProps.preferInfo;
  //   if (userId === userId2) {
  //     console.log("preferInfo의 변화", preferInfo, preferInfo2);
  //     if (preferInfo !== preferInfo2) {
  //       this.initializePreferInfo(preferInfo2);
  //     }
  //   }
  //   return userId === userId2 && preferInfo === preferInfo2;
  // }
  constructor(props: any) {
    super(props);
    this.initializeUserInfo();
  }

  render() {
    const { loading } = this.props;
    return (
      <div className="main--body">
        <Segment style={{  }}>
          {loading && (
            <Dimmer active inverted>
              <Loader>로딩중</Loader>
            </Dimmer>
          )}
        </Segment>
          <Router />
      </div>
    );
  }
}

export default connect(
  ({ user, vol, search }: any) => ({
    userId: user.getIn(["loggedInfo", "userId"]),
    preferInfo: user.getIn(["loggedInfo", "preferInfo"]),
    volunteers: vol.get("volunteers"), // store에 있는 state를 this.pros로 연결
    input: search.get("input"),
    loading: user.get('loading'),
    locations: search.get("locations"),
    categorys: search.get("categorys"),
    times: search.get("times"),
  }),
  dispatch => ({
    UserActions: bindActionCreators(userActions, dispatch),
    SearchActions: bindActionCreators(searchActions, dispatch),
    VolActions: bindActionCreators(volActions, dispatch)
  })
)(App);
