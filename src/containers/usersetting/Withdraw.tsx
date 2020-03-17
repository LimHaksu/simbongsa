import React, { Component } from "react";
import { Container, Button, Form } from "semantic-ui-react";
import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
import AuthError from "components/error/AuthError";
import * as UserApi from "lib/api/UserApi";
import storage from "lib/storage";
import * as authActions from 'redux/modules/auth';
import { bindActionCreators } from "redux";
interface Props { email: string, AuthActions: any, mId: string }
interface State { errorMessage: string, inputEmail: string, isButtonDisabled: boolean }

class Withdraw extends Component<Props, State> {
  state = { isButtonDisabled: true, errorMessage: "", inputEmail: "" };
  handleWithdraw = () => {
    const { AuthActions, mId } = this.props;
    UserApi.deleteUser(mId)
    .then((res:any)=>{
      storage.remove("token");
      AuthActions.loginCheck(false);
      window.location.href = process.env.REACT_APP_FRONT_URI + "/withdrawcomplete";
    });
  };
  handleChange = (e: any) => {
    this.setState({ inputEmail: e.target.value }, () => {
      if (this.state.inputEmail !== this.props.email) {
        this.setState({ errorMessage: "이메일이 일치하지 않습니다.", isButtonDisabled: true })

      } else {
        this.setState({ errorMessage: "", isButtonDisabled: false })
      }
    })
  }
  render() {
    const { handleWithdraw, handleChange } = this;
    const { isButtonDisabled, inputEmail, errorMessage } = this.state;

    return (
      <div>
        <Container>

          정말로 탈퇴하시겠어요?<br />
          이메일 계정을 입력하시고 "탈퇴" 버튼을 누르시면 회원 탈퇴를 진행합니다.<br />
          <Form>
            <AuthError error={errorMessage} />
            <Form.Input
              fluid
              icon="user"
              id="email"
              value={inputEmail}
              iconPosition="left"
              placeholder="이메일을 입력하세요."
              onChange={handleChange}
            />
            <Button
              disabled={isButtonDisabled}
              inverted
              color="orange"
              //   fluid
              //   size="large"
              width="84px"
              onClick={handleWithdraw}
              style={{
                marginLeft: 50,
                paddingLeft: 35,
                paddingRight: 35
              }}
            >
              탈퇴
          </Button>
          </Form>
        </Container>
      </div>
    );
  }
}

export default connect(
  (state: any) => ({
    // props로 받아오는 정보들...
    email: state.user.getIn(["loggedInfo", "username"]),
    mId: state.user.getIn(["loggedInfo", "m_id"])
  }),
  dispatch => ({
    AuthActions: bindActionCreators(authActions, dispatch)
  })
)(Withdraw);