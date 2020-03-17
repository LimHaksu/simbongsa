import React, { Component } from "react";
import * as AuthApi from "lib/api/AuthApi";
import Input from "components/input/Input";
import AuthError from "components/error/AuthError";
import validator from "validator";
import ActionButton from "components/button/ActionButton";
import { Container, Dimmer, Loader, Form, Segment, Button } from "semantic-ui-react";

interface Props {
  match: any;
  history: any;
}
interface State {
  password: string;
  passwordConfirm: string;
  error: { password: any; passwordConfirm: any };
}

interface validate {
  [name: string]: (value: string) => boolean;
}
export default class FindPasswordMailRecieve extends Component<Props, State> {
  state = {
    password: "",
    passwordConfirm: "",
    error: { password: false, passwordConfirm: false }
  };
  validate: validate = {
    password: (value: string) => {
      const { error } = this.state;
      if (!validator.isLength(value, { min: 8 })) {
        this.setState({
          error: { ...error, password: "비밀번호를 8자 이상 입력하세요." }
        });
        return false;
      }
      this.setState({
        error: { ...error, password: null }
      });
      return true;
    },
    passwordConfirm: (value: string) => {
      const { error } = this.state;
      if (this.state.password !== value) {
        this.setState({
          error: {
            ...error,
            passwordConfirm: "비밀번호확인이 일치하지 않습니다."
          }
        });
        return false;
      }
      this.setState({
        error: { ...error, passwordConfirm: null }
      });
      return true;
    }
  };
  componentDidMount() { }

  handleChange = (e: any) => {
    const { id, value } = e.target;
    if (id === "password") {
      this.setState({ password: value });
    } else {
      this.setState({ passwordConfirm: value });
    }
    // 검증작업 진행
    const validation = this.validate[id](value);
    if (id.indexOf("password") > -1 || !validation) return; // 비밀번호 검증이거나, 검증 실패하면 여기서 마침
  };

  clickConfirmButton = () => {
    const { passwordConfirm } = this.state;
    const { history } = this.props;
    const { token } = this.props.match.params;
    AuthApi.changePassword(token, passwordConfirm);
    history.push("/");
  };

  render() {
    const { password, passwordConfirm, error } = this.state;
    const { handleChange, clickConfirmButton } = this;
    return (
      <Container>
        <div>비밀번호 변경 페이지</div>
        <AuthError error={error.password} />
        <Input
          value={password}
          onChange={handleChange}
          id="password"
          placeholder="비밀번호를 입력하세요"
          type="password"
          nametag="비밀번호"
        />
        <AuthError error={error.passwordConfirm} />
        <Input
          value={passwordConfirm}
          onChange={handleChange}
          id="passwordConfirm"
          placeholder="비밀번호를 다시한번 입력하세요"
          type="password"
          nametag="비밀번호 확인"
        />
        <br/>
        <ActionButton action={clickConfirmButton} placeholder="비밀번호 변경" />
      </Container>
    );
  }
}
