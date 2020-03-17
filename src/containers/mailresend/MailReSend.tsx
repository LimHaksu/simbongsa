import React from "react";
import * as EmailValidator from "email-validator";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as authActions from "redux/modules/auth";
import { Map } from "immutable";
// import UserApi from "apis/UserApi";
import * as AuthApi from "lib/api/AuthApi";
//debouce 특정 함수가 반복적으로 일어나면, 바로 실행하지 않고, 주어진 시간만큼 쉬어줘야 함수가 실행된다.
import debounce from "lodash/debounce";
import {Container, Button, Form, Segment, Dimmer, Loader} from 'semantic-ui-react'
import AuthError from 'components/error/AuthError'
interface IProps {
  AuthActions: any;
  location: {
    state: {
      email: string;
    };
  };
  exists: Map<any, any>;
  email: string;
  history : any;
}
interface IState {
  email: string;
  error: {
    email: string;
  };
  isSubmit: boolean;
  component: MailReSend;
  isMailSending : boolean;
}
class MailReSend extends React.Component<IProps, IState> {
  state = {
    email: "",
    error: {
      email: ""
    },
    isSubmit: false,
    component: this,
    isMailSending : false,
  };
  componentDidMount() {
    const { email } = this.props;
    this.setState({ email: email }, () => this.checkForm());
  }
  checkForm = () => {
    let error = { ...this.state.error };
    if (
      this.state.email.length >= 0 &&
      !EmailValidator.validate(this.state.email)
    ) {
      this.setState({ error: { email: "잘못된 이메일 형식 입니다." } });
    } else {
      this.setState({ error: { email: "" } });
    }
    this.setState({ error: error }, () => {
      let isSubmit = true;
      Object.values(this.state.error).map(v => {
        if (v) isSubmit = false;
        return v;
      });
      this.setState({
        isSubmit: isSubmit
      });
    });
  };
  setError = (message: any, name: string) => {
    const { AuthActions } = this.props;
    AuthActions.setError({
      form: "join",
      message,
      name
    });
  };
  // 중복 체크

  handleSend = async () => {
    const { isMailSending , email} = this.state;
    const { history } = this.props;
    try {
      this.setState({isMailSending : true }, async ()=>{
        await AuthApi.sendSignupEmail(email);
        this.setState({isMailSending : false},)
        history.push("/join/complete"); // 회원가입 성공시 홈페이지로 이동
      })
    } catch (e) {
      if (e.response.status === 409) {
        const { key } = e.response.data;
        const message = "회원 가입한 이메일이 아닙니다.";
        return this.setError(message, key);
      }
    }
  };

  checkEmailExists = debounce(async (email: string) => {
    const { AuthActions } = this.props;
    try {
      await AuthActions.checkEmailExists(email);
      if (this.props.exists.get("email")) {
        this.setState({ error: { email: "" } });
      } else {
        this.setState({ error: { email: "회원 가입한 이메일이 아닙니다." } });
      }
    } catch (e) {
      console.log(e);
    }
  }, 300);

  handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ email: e.currentTarget.value }, () => {
      this.checkForm();
      this.checkEmailExists(this.state.email);
    });
  };
  render() {
    const { email, error, isMailSending} = this.state;
    return (
      <Container>
        <Dimmer active={isMailSending} inverted>
          <Loader content='회원 가입 인증 메일 발송중...' />
        </Dimmer>
        <div className="wrapC">
          <h1 className="title">회원 가입 메일 인증을 완료해주세요!</h1>
          <Form size="large">
              <Segment stacked>
                <AuthError error={error.email} />
                <Form.Input
                  fluid
                  icon="user"
                  id="email"
                  value={email}
                  iconPosition="left"
                  placeholder="이메일을 입력하세요."
                  onChange={this.handleInput}
                  onKeyDown={(event:any) => {
                    if (event.key === "Enter") {
                      this.handleSend();
                    }
                  }}
                />
                <Button
                  className="login"
                  inverted
                  valuex="true"
                  fluid
                  size="large"
                  onClick={this.handleSend}
                  disabled={!this.state.isSubmit}
                >
                메일 재전송
                </Button>
              </Segment>
            </Form>
            </div>
      </Container>
    );
  }
}

export default connect(
  ({ auth }: any) => ({
    email: auth.getIn(["login", "form", "email"]),
    form: auth.getIn(["join", "form"]),
    error: auth.getIn(["join", "error"]),
    exists: auth.getIn(["join", "exists"]),
    result: auth.get("result")
  }),
  dispatch => ({
    AuthActions: bindActionCreators(authActions, dispatch)
  })
)(MailReSend);
