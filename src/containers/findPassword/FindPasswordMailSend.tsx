import React from "react";
import { Link } from "react-router-dom";
import { Container, Button } from "semantic-ui-react";

interface Props {
  location: {
    state: {
      email: "string";
    };
  };
}

class FindPasswordMailSend extends React.Component<
  Props> {
  state = {
    email: null
  };
  render() {
    return (
      <Container>
        <div className="wrapC">
          <h1 className="title">비밀번호 재설정 메일 전송</h1>
          <div className="input-with-label">
            <h3>
              비밀번호 재설정 메일을 다시 보냈습니다. 메일함을 확인해 주세요.
            </h3>
          </div>
          <Link to={"/"} className="btn--back">
            <Button inverted className="login">로그인 화면으로</Button>
          </Link>
        </div>
      </Container>
    );
  }
}

export default FindPasswordMailSend;