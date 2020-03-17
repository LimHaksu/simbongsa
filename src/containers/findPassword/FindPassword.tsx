import React from "react";
import { Link } from "react-router-dom";
// import "assets/css/style.scss";
// import "assets/css/user.scss";
// import "assets/mycss/error.scss";
import * as EmailValidator from "email-validator";
import * as AuthApi from "lib/api/AuthApi";
import ActionButton from "components/button/ActionButton";
// import UserApi from "apis/UserApi";
import { Container, Dimmer, Loader, Form, Segment, Button } from "semantic-ui-react";
import AuthError from 'components/error/AuthError'

interface Props {
  history: any;
  AuthActions : any;
}

class FindPassword extends React.Component<Props> {
  state = {
    email: "",
    error: {
      email: ""
    },
    isSubmit: false,
    component: this,
    isMailSending : false,
  };
  componentDidMount() { }
  checkForm = () => {
    let error = { ...this.state.error };
    if (
      this.state.email.length >= 0 &&
      !EmailValidator.validate(this.state.email)
    ) {
      error.email = "이메일 형식이 아닙니다.";
    } else {
      error.email = "";
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
  handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ email: e.currentTarget.value }, () => {
      this.checkForm();
    });
  };

  sendEmail = async () => {
    const { email} = this.state;
    const { history, AuthActions } = this.props;
    this.setState({isMailSending : true }, async ()=>{
      await AuthApi.changePasswordEmailSend(email);
      this.setState({isMailSending : false},)
      history.push("/findpasswordmailsend"); 
    })
  };
  render() {
    const { sendEmail } = this;
    const { email , isMailSending, error} = this.state;
    return (
      <Container>
      <Dimmer active={isMailSending} inverted>
        <Loader content='비밀번호 찾기 메일 발송중...' />
      </Dimmer>
        <div className="wrapC">
          <h1 className="title">비밀번호 찾기</h1>
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
                    this.sendEmail();
                  }
                }}
              />
              <Button
                className="login"
                inverted
                valuex="true"
                fluid
                size="large"
                onClick={this.sendEmail}
                disabled={!this.state.isSubmit}
              >
              비밀번호 찾기 메일 전송
              </Button>
            </Segment>
          </Form>
        </div>
      </Container>
    );
  }
}

export default FindPassword;