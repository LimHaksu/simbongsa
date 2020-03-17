import React from "react";
import PV from "password-validator";
import {
  Grid,
  Image,
  Header,
  Form,
  Segment,
  Button,
  Message,
  Container
} from "semantic-ui-react";
import locationAllList from "lib/json/temp.json";
import categoryAllList from "lib/json/searchCategory.json";
import "./Login.css";

// import KakaoLogin from "components/user/snsLogin/Kakao";
// import GoogleLogin from "components/user/snsLogin/Google";
import GoogleLogin from "react-google-login";

import ReactCountUp from "react-countup";
import ScrollAnimation from "react-animate-on-scroll";
//@ts-ignore
import ReactPageScroller from "react-page-scroller"; // @types/react-page-scroller 가 없어서 위에 // @ts-ignore 를 추가

// 직접 제작한 Components
import LinkButton from "components/button/LinkButton";
import ActionButton from "components/button/ActionButton";
import Input from "components/input/Input";
import AuthError from "components/error/AuthError";
// local storage에 저장하는 component

// redux 관련
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as authActions from "redux/modules/auth";
import * as userActions from "redux/modules/user";
import * as baseActions from "redux/modules/base";
import * as volActions from "redux/modules/vol";
import * as searchActions from "redux/modules/search";
import storage from "lib/storage";
import validator from "validator";
import { Link } from "react-router-dom";

// jwt
import jwt from "jsonwebtoken";

interface validate {
  [name: string]: (value: string) => boolean;
}

class Login extends React.Component<any, any> {
  validate: validate = {
    email: (value: string) => {
      if (!validator.isEmail(value)) {
        this.setError("잘못된 이메일 형식 입니다.", "email");
        return false;
      }
      this.setError(null, "email");
      return true;
    },
    password: (value: string) => {
      if (!validator.isLength(value, { min: 8 })) {
        this.setError("비밀번호를 8자 이상 입력하세요.", "password");
        return false;
      }
      this.setError(null, "password"); // 이메일과 아이디는 에러 null 처리를 중복확인 부분에서 하게 됩니다
      return true;
    }
  };
  isLogedIn = (): boolean => {
    const token = storage.get('token');
    if (token !== 'undefined' && token !== null) {
      return true;
    }
    return false;
  }
  async componentDidMount() {
    if (this.isLogedIn()) {
      this.props.history.push('/mainpage')
    }
    const { SearchActions, AuthActions, UserActions } = this.props;
    // const { id_token } = this.props.match.params;
    // 구글 로그인을 하고 성공했을 경우 url로 구글 id_token이 같이 넘어옴. 이를 사용하여 로그인 처리를 함
    const hash = window.location.hash;
    if (hash.length > 0) {
      const splitedHash = hash.split("id_token=");
      if (splitedHash.length > 1) {
        const id_token = splitedHash[1].split("&")[0];
        await AuthActions.googleLogin(id_token);
        const token = this.props.result.toJS().token;
        const loggedIinfo = jwt.decode(token);
        storage.set("token", token);
        await UserActions.setLoggedInfo(loggedIinfo);
        const { userId } = this.props;
        await UserActions.setPreferInfo(userId);
        const { preferInfo } = this.props;
        this.initializePreferInfo(preferInfo);
        await this.initialSearch();
      }
      const token = storage.get("token");
      if (token !== null && token !== "undefined") {
        this.props.history.push("/mainpage");
      }
    }
  }

  componentDidUpdate() {
    if (this.isLogedIn()) {
      this.props.history.push('/mainpage')
    }
  }

  handleChange = (e: any) => {
    const { AuthActions } = this.props;
    const { id, value } = e.target;
    AuthActions.changeInput({
      id,
      value,
      form: "login"
    });

    const validation = this.validate[id](value);
    if (!validation) return;
  };

  // 컴포넌트가 종료될때 로그인 폼을 초기화 시킨다.
  componentWillUnmount() {
    const { AuthActions } = this.props;
    AuthActions.initializeForm("login");
  }

  // 에러 메세지 설정

  setError = (message: any, name: string) => {
    const { AuthActions } = this.props;
    AuthActions.setError({
      form: "login",
      message,
      name
    });
    return false;
  };

  // 로그인 처리

  handleLocalLogin = async () => {
    const { form, AuthActions, UserActions, history } = this.props;
    const error = this.props.error.toJS();
    const { email, password } = form.toJS();
    // 로그인을 시도
    try {
      // id 로그인인경우
      if(error.email){
        await AuthActions.localLoginById({ email, password });
      }else{
      // email 로그인인경우
        await AuthActions.localLogin({ email, password });
      }
      if (this.props.result === "EmailAuthenticateNeed") {
        history.push("/mailresend");
        return;
      }
      const token = this.props.result.toJS().token;
      const loggedInfo = jwt.decode(token);
      UserActions.setLoggedInfo(loggedInfo);
      storage.set("token", token);
      const { userId } = this.props;
      await UserActions.setPreferInfo(userId);
      const { preferInfo } = this.props;
      this.initializePreferInfo(preferInfo);
      await this.initialSearch();
      history.push("/mainpage");
    } catch (e) {
      // error 발생시
      console.log(e);
      this.setError("잘못된 계정정보입니다.", "auth");
    }
  };
  initialSearch = async () => {
    const { input, VolActions, locations, categorys, times } = this.props;
    let preferLocate = locations.toJS().map((location: any) => location.text);
    let preferCategory = categorys.toJS().map((category: any) => category.text);
    const locateSize = preferLocate.length;
    const categorySize = preferCategory.length;
    for (let i = 0; i < 3 - locateSize; i++) {
      preferLocate.push("null null");
    }
    for (let i = 0; i < 3 - categorySize; i++) {
      preferCategory.push(null);
    }
    const firstLocation = preferLocate[0].split(" ");
    const secondLocation = preferLocate[1].split(" ");
    const thirdLocation = preferLocate[2].split(" ");

    const firstCategory = preferCategory[0];
    const secondCategory = preferCategory[1];
    const thirdCategory = preferCategory[2];

    VolActions.getVolList({
      input: input,
      firstLocation: firstLocation,
      secondLocation: secondLocation,
      thirdLocation: thirdLocation,
      firstCategory: firstCategory,
      secondCategory: secondCategory,
      thirdCategory: thirdCategory,
      bgnTm: times.toJS().bgnTm,
      endTm: times.toJS().endTm
    });
    VolActions.getInitailList({
      input: input,
      firstLocation: firstLocation,
      secondLocation: secondLocation,
      thirdLocation: thirdLocation,
      firstCategory: firstCategory,
      secondCategory: secondCategory,
      thirdCategory: thirdCategory,
      bgnTm: times.toJS().bgnTm,
      endTm: times.toJS().endTm,
      pageNum: 1
    });
  };
  initializePreferInfo = (preferInfo: any) => {
    const { SearchActions } = this.props;
    if (preferInfo) {
      const info = preferInfo.toJS();

      // 시간 관련
      if(info.bgnTm === null){
        SearchActions.initialInsert({
          form: "times",
          key: "bgnTm",
          value: "00:00:00"
        });
      }
      else{
        SearchActions.initialInsert({
          form: "times",
          key: "bgnTm",
          value: info.bgnTm
        });
      }
      if(info.endTm === null){
        SearchActions.initialInsert({
          form: "times",
          key: "endTm",
          value: "24:00:00" 
        });
    }
    else{
      if(info.endTm === "23:59:59"){
        SearchActions.initialInsert({
          form: "times",
          key: "endTm",
          value: "24:00:00" 
        });
      }
      else{
      SearchActions.initialInsert({
        form: "times",
        key: "endTm",
        value: info.endTm 
      });
      }
    }
      // 나이 관련
      const today = new Date();
      const year = today.getFullYear();
      if (!info.age) {
        SearchActions.initialInsert({
          form: "ages",
          key: "adult",
          value: false
        });
        SearchActions.initialInsert({
          form: "ages",
          key: "youth",
          value: false
        });
      } else {
        const age = Number(info.age.split("-")[0]);
        const result = Math.abs(age - year);
        if (result > 18) {
          SearchActions.initialInsert({
            form: "ages",
            key: "adult",
            value: true
          });
          SearchActions.initialInsert({
            form: "ages",
            key: "youth",
            value: false
          });
        } else if (0 < result && result <= 18) {
          SearchActions.initialInsert({
            form: "ages",
            key: "adult",
            value: false
          });
          SearchActions.initialInsert({
            form: "ages",
            key: "youth",
            value: true
          });
        } else {
          SearchActions.initialInsert({
            form: "ages",
            key: "adult",
            value: false
          });
          SearchActions.initialInsert({
            form: "ages",
            key: "youth",
            value: false
          });
        }
      }

      for (let j = 0; j < info.preferRegion.length; j++) {
        //지역 관련
        const splitValue = locationAllList[
          info.preferRegion[j] - 1
        ].value.split("/");
        SearchActions.insert({
          form: "location",
          text: splitValue[1],
          key: splitValue[0]
        });
      }

      // 봉사활동 카테고리 관련
      for (let j = 0; j < info.preferCategory.length; j++) {
        const number: keyof typeof categoryAllList = info.preferCategory[j];
        SearchActions.insert({
          form: "category",
          text: categoryAllList[number],
          key: number
        });
      }
    }
  };


  /* ☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★
     handleGoogleLogin 함수는 구글 로그인 버튼에서 uxMode가 popup 일때만 작동함.
     redirect 모드일때는 아래 함수는 작동하지 않고 redirect 지정 주소로 바로 이동하므로 사용시 주의
     ☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★*/
  handleGoogleLogin = async (response: any) => {
    const { AuthActions, UserActions, history } = this.props;
    // 구글로그인 성공할 경우 response로 로그인 정보가 담긴 객체 하나를 준다.
    const id_token = response.getAuthResponse().id_token;
    // 그 중 id_token 에 담긴 구글 로그인 정보를 백엔드에 전달해 줌.
    await AuthActions.googleLogin(id_token);
    const token = this.props.result.toJS().token;
    const userEmail = jwt.decode(token);
    UserActions.setLoggedInfo(userEmail);
    storage.set("token", token);
    const { userId } = this.props;
    await UserActions.setPreferInfo(userId);
    const { preferInfo } = this.props;
    this.initializePreferInfo(preferInfo);

    await this.initialSearch();
    history.push("/mainpage");
  };

  render() {
    const { email, password } = this.props.form.toJS(); // form 에서 email 과 password 값을 읽어옴
    const { handleChange, handleLocalLogin, handleGoogleLogin } = this;
    const error = this.props.error.toJS();
    // const pagesNumbers = this.getPagesNumbers();
    return (
      <Container>
        <Grid
          textAlign="center"
          style={{ height: "70vh" }}
          verticalAlign="middle"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            {/* <Header as="h2" color="orange" textAlign="center"> */}
            <Image centered size="tiny" src="/images/logo1.png" />
            {/* </Header> */}
            <Form size="large">
              <Segment stacked>
                <AuthError error={error.auth} />
                {/* <AuthError error={error.email} /> */}
                <Form.Input
                  fluid
                  icon="user"
                  id="email"
                  value={email}
                  iconPosition="left"
                  placeholder="이메일또는 아이디를 입력하세요."
                  onChange={handleChange}
                  autoCapitalize="none"
                />
                <AuthError error={error.password} />
                <Form.Input
                  fluid
                  id="password"
                  icon="lock"
                  value={password}
                  iconPosition="left"
                  placeholder="비밀번호를 입력하세요."
                  type="password"
                  onChange={handleChange}
                />

                <Button
                  className="login"
                  inverted
                  valuex="true"
                  fluid
                  size="large"
                  onClick={handleLocalLogin}
                >
                  로그인
                </Button>
              </Segment>
            </Form>
            <Container textAlign="right">
              <GoogleLogin
                icon={true}
                clientId={process.env.REACT_APP_GOOGLE_LOGIN_CLIENT_ID!}
                onSuccess={handleGoogleLogin}
                onFailure={result => console.log(result)}
                cookiePolicy={"single_host_origin"}
                responseType="id_token"
                buttonText="구글 계정으로 로그인"
                uxMode="redirect"
                redirectUri={process.env.REACT_APP_FRONT_URI + "/login"}
              />
            </Container>
            <div className="authlink">
              <div>
                <span className="message">비밀번호를 잊으셨나요?</span>
                <Link to="/findpassword">
                  <a className="link">비밀번호 찾기</a>
                </Link>
                <br />
              </div>
              <div>
                <span className="message">아직 심봉사의 회원이 아니세요?</span>
                {/* <LinkButton placeholder="회원가입" link="/join" /> */}
                <Link to="/join">
                  <a className="link">회원가입</a>
                </Link>
              </div>
            </div>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
// State와 action을 연결짓는 connect
export default connect(
  (state: any) => ({
    // props로 받아오는 정보들...
    form: state.auth.getIn(["login", "form"]),
    error: state.auth.getIn(["login", "error"]),
    result: state.auth.get("result"),
    logged: state.user.get("logged"),
    loggedInfo: state.user.get("loggedInfo"),
    initialNumber: state.base.get("initialNumber"),
    userId: state.user.getIn(["loggedInfo", "userId"]),
    preferInfo: state.user.getIn(["loggedInfo", "preferInfo"]),
    volunteers: state.vol.get("volunteers"), // store에 있는 state를 this.pros로 연결
    input: state.search.get("input"),
    loading: state.user.get("loading"),
    locations: state.search.get("locations"),
    categorys: state.search.get("categorys"),
    times: state.search.get("times")
  }),
  dispatch => ({
    AuthActions: bindActionCreators(authActions, dispatch),
    UserActions: bindActionCreators(userActions, dispatch),
    BaseActions: bindActionCreators(baseActions, dispatch),
    SearchActions: bindActionCreators(searchActions, dispatch),
    VolActions: bindActionCreators(volActions, dispatch)
  })
)(Login);
