import React, { Component } from "react";

import { connect } from "react-redux";
import * as AuthApi from 'lib/api/AuthApi';
import ActionButton from 'components/button/ActionButton'

interface Props {
  email: string;
}
interface State {
  message: string;
}

class ChangePassword extends Component<Props, State> {
  state = {
    message: ``
  };

  sendEmail = () => {
    const { email } = this.props;
    AuthApi.changePasswordEmailSend(email);
    this.setState({ message: `${email}로 메일 발송 완료.\n메일을 확인해주세요!` });
  }

  render() {
    const { sendEmail } = this;
    const { message } = this.state;
    return (
      <div >
        <ActionButton action={sendEmail} placeholder="비밀번호 변경 메일 발송" />
        {
          message.split('\n').map((line, i) => {
            return (<span key={i}>{line}<br /></span>)
          })
        }
      </div>
    );
  }
}

export default connect(
  (state: any) => ({
    email: state.user.getIn(["loggedInfo", "username"])
  }),
  dispatch => ({})
)(ChangePassword);
