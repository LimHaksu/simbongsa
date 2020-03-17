import React, { Component } from "react";
import storage from "lib/storage";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as authActions from "redux/modules/auth";

interface Props {
  history: any;
  AuthActions: any;
  loginCheck: boolean;
}
interface State { }

// 토큰이 존재 하지 않음 === 로그인 안함
// 로그인 안한 사람이 로그인이 필요한 페이지 접근시 강제로 인트로 페이지로 보냄
class LoginChecker extends Component<Props, State> {
  state = {};
  componentDidMount() {

    const { AuthActions, loginCheck } = this.props;
    const url = window.location.href
      .split(`${process.env.REACT_APP_FRONT_URI!}/`)[1]
      .split("#")[0];

    const token = storage.get("token");
    // 토큰이 존재 하지 않음 === 로그인 안함
    // 로그인 안한 사람이 로그인이 필요한 페이지 접근시 강제로 인트로 페이지로 보냄
    const needAuthUrl = /\bmainpage\b|\bfeed\b|\bmypage\b|\busersetting\b|\bcalendar\b|\buser\b|\bfollow\b/;
    if (!loginCheck &&token !== null && token.split('.')[0] === 'eyJhbGciOiJIUzUxMiJ9') {
      AuthActions.loginCheck(true);
    }
    else if (token === "EmailAuthenticateNeed") {
      this.props.history.push("/mailresend");
    } else
      if (token === null && needAuthUrl.test(url)) {

        AuthActions.loginCheck(false);
        this.props.history.push("/");
      }
  }
  componentDidUpdate() {
    const { AuthActions, loginCheck} = this.props;
    const url = window.location.href.split(
      `${process.env.REACT_APP_FRONT_URI!}/`
    )[1];
    const token = storage.get("token");
    // 토큰이 존재 하지 않음 === 로그인 안함
    // 로그인 안한 사람이 로그인이 필요한 페이지 접근시 강제로 인트로 페이지로 보냄
    const needAuthUrl = /\bmainpage\b|\bfeed\b|\bmypage\b|\busersetting\b|\bcalendar\b/;
    if (!loginCheck && token !== null && token.split('.')[0] === 'eyJhbGciOiJIUzUxMiJ9') {
      AuthActions.loginCheck(true);
    }
    else if (token === "EmailAuthenticateNeed") {
      this.props.history.push("/mailresend");
    }
    if (token === null && needAuthUrl.test(url)) {
      AuthActions.loginCheck(false);
      this.props.history.push("/");
    }
  }
  render() {
    return <div></div>;
  }
}

export default connect(
  (state: any) => ({
    loginCheck: state.auth.get("loginCheck")
  }),
  dispatch => ({
    AuthActions: bindActionCreators(authActions, dispatch)
  })
)(LoginChecker);
