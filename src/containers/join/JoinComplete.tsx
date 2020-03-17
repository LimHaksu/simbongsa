import React from "react";
import { Link } from "react-router-dom";
// redux 관련
import { Map } from 'immutable';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as authActions from "redux/modules/auth";
import * as userActions from "redux/modules/user";

import { Icon, Container } from 'semantic-ui-react'

interface Iprops {
  location: {
    state: {
      email: "string";
    };
  };
  form: any;
}

class JoinComplete extends React.Component<Iprops, any> {
  render() {
    const { email } = this.props.form.toJS();
    return (
      <Container>
        <div className="wrapC">
          <div className="input-with-label">
            <h1 style={{ marginBottom: "2rem", marginTop: "1em", color: "rgb(78, 78, 78)" }}>환영합니다!</h1>
          </div>
          <div>
            <span className="message" style={{ fontSize: "1.2rem" }}> 메일이 도착하지 않았나요?</span>

            <Link
              to={{
                pathname: "/mailresend",
                state: { email: email }
              }}
              className="link"
              style={{ fontSize: "1.2rem" }}
            >
              메일 재발송
            </Link>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <Link to={"/login"} className="link" style={{ fontSize: "1.2rem" }}>
              <Icon name="long arrow alternate left"></Icon><span className="btn btn--back btn--join">로그인 화면으로</span>
            </Link>
          </div>
        </div>
      </Container>
    );
  }
}

export default connect(
  (state: any) => ({
    form: state.auth.getIn(["join", "form"]),
    error: state.auth.getIn(["join", "error"]),
    exists: state.auth.getIn(["join", "exists"]),
    result: state.auth.get("result")
  }),
  dispatch => ({
    AuthActions: bindActionCreators(authActions, dispatch),
    UserActions: bindActionCreators(userActions, dispatch)
  })
)(JoinComplete);
