import React, { Component } from "react";
import TabForMainPage from "containers/mainpage/TabForMainPage";
import SearchBar from "components/search/SearchBar";
import SearchContainer from "containers/usersetting/SearchContainer";
import ModalForm from "./ModalForm";
import "./MainPage.css";

import {

  Container,
} from "semantic-ui-react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as authActions from "redux/modules/auth";
import * as userActions from "redux/modules/user";
import * as volActions from "redux/modules/vol";
import * as searchActions from "redux/modules/search";
import jwt from "jsonwebtoken";
import storage from "lib/storage";
import { Search } from 'semantic-ui-react';


interface Iprops {
  loading: boolean;
  isRegister: boolean;
  SearchActions: any;
  AuthActions: any;
  UserActions: any;
  PageActions: any;
  match: any;
  result: any;
  lastInput: string;
  isSearchSubmit: boolean
}
class MainPage extends Component<Iprops> {
  async componentDidMount() {

    const { SearchActions, AuthActions, UserActions } = this.props;
    // const { id_token } = this.props.match.params;
    const hash = window.location.hash;
    if (hash.length > 0) {
      const splitedHash = hash.split("id_token=");
      if (splitedHash.length > 1) {
        const id_token = splitedHash[1].split("&")[0];
        await AuthActions.googleLogin(id_token);
        const token = this.props.result.toJS().token;
        const userEmail = jwt.decode(token);
        UserActions.setLoggedInfo(userEmail);
        storage.set("token", token);
      }
    }
    SearchActions.switchSaveButton(false);
  }
  componentWillUnmount() {
    const { SearchActions } = this.props;
    SearchActions.switchSaveButton(true);
  }
  render() {
    const { lastInput } = this.props;
    const result = '"' + lastInput + '"' + ' 검색결과 입니다.'

    return (
      //@ts-ignore
      <div id='tab' style={{width:"100vw"}}>
        <Container text >
          <SearchBar />
          <div
            style={{
              justifyContent: "space-between",
              display: "flex",
              marginTop: 10,
              marginBottom: 30,
            }}
            id="divText"
          >
            <div>{result}</div><ModalForm />
          </div>
        </Container>
        <TabForMainPage />
      </div>
    );
  }
}
export default connect(
  ({ user, auth, search }: any) => {
    return {
      loading: user.get("loading"), // user에 있는 loading
      isRegister: user.get("isRegister"),
      result: auth.get("result"),
      lastInput: search.get("lastInput"),
      isSearchSubmit: search.get("isSearchSubmit"),
    };
  },
  dispatch => ({
    VolActions: bindActionCreators(volActions, dispatch),
    SearchActions: bindActionCreators(searchActions, dispatch),
    UserActions: bindActionCreators(userActions, dispatch),
    AuthActions: bindActionCreators(authActions, dispatch),
  })
)(MainPage);
