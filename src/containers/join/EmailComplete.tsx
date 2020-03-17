import React, { Component } from "react";

// redux 관련
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "redux/modules/user";
import * as AuthApi from "lib/api/AuthApi";
import {Container} from 'semantic-ui-react';
interface Props {
  match: any;
  history : any;
}
interface State { 
  emailValidate: boolean;
}

// http://13.124.127.232:8080/A205/email/enter?m_email=pjh5929@naver.com&m_key=m7OSjPN0jpGOTlTCM0QR
class EmailComplete extends Component<Props, State> {
  state = {emailValidate : false};

  componentDidMount() {
    const { email, key } = this.props.match.params;
    const { history } = this.props;
    let returnedAxios = AuthApi.emailValidate(email, key);
    returnedAxios.then((res:any)=>{
      let emailValidate = res.data.data;
      this.setState({emailValidate : emailValidate})
      if(emailValidate){
        window.setTimeout(()=>{
          history.push("/login");
        },5000)
      }
    }).catch((error:any)=>{
      console.log(error);
    })
  }
  render() {
    const { emailValidate } = this.state;
    return (
      <Container>
        {emailValidate && <div>메일 인증 완료. 5초 후 로그인 페이지로 이동합니다.</div>}
        {!emailValidate && <div>메일 미인증. 잠시만 기다려주세요. 1분 이상 화면이 바뀌지 않으면 인증을 다시해주세요.</div>}
      </Container>
    );
  }
}

export default EmailComplete;
