import React from "react";
import { Container, Responsive, Menu, Visibility, Segment, Button, Image, Dropdown } from "semantic-ui-react";
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as authActions from "redux/modules/auth";
import * as pageActions from 'redux/modules/page';
import * as volActions from "redux/modules/vol";
import * as userActions from "redux/modules/user";
import storage from "lib/storage";
interface Props {}

interface IState {
  activeItem: string;
}
export interface IAppProps {
  loginCheck : boolean;
  history: any;
  PageActions : any;
  VolActions : any;
  UserActions : any;
  AuthActions : any;
}

class HeaderForDesktop extends React.Component<
  IAppProps,
  IState
> {
  state = { activeItem: ""};
  handleLogout = async () => {
    const { AuthActions, history } = this.props;
    storage.remove("token");
    AuthActions.loginCheck(false);
    window.location.href = `${process.env.REACT_APP_FRONT_URI}`;
  };
  handleItemClick = (e: any, { name }: any) => {
    this.setState({ activeItem: name });
    const { history, PageActions, VolActions, UserActions } = this.props;
    PageActions.setCurrentTab(0);
    if (name === "HOME") {
      UserActions.resetFeedList();
      window.scrollTo(0, 0);
      history.push("/mainpage");
    } else if (name === "FEED") {
      VolActions.resetVolunteerForList();
      window.scrollTo(0, 0);
      history.push("/feed");
    } else if (name === "MY") {
      UserActions.resetFeedList();
      VolActions.resetVolunteerForList();
      window.scrollTo(0, 0);
      history.push("/mypage");
    }
  };

  public render() {
    const { activeItem } = this.state;
    const { loginCheck } = this.props;
    const url = window.location.href.split(
      `${process.env.REACT_APP_FRONT_URI!}/`
    )[1];
    return (
      <div>
        <Responsive minWidth={1001}>
        <Menu
              fixed={"top"}
              pointing
              secondary
              style={{backgroundColor:"white"}}
              // size='large'
            >
              <Container>
              <Menu.Item position="left"></Menu.Item>
              <Menu.Item name="HOME" className="goHome">
                <Link to="/"><Image src="/images/logo2.png" style={{ width: "6rem", padding: "0.3rem", marginLeft: "0.2rem" }} /></Link>
              </Menu.Item>
              {loginCheck && <Menu.Item
                name="HOME"
                active={activeItem === "HOME"}
                onClick={this.handleItemClick}
              >
                HOME
              </Menu.Item>}
              {loginCheck && <Menu.Item
                name="FEED"
                active={activeItem === "FEED"}
                onClick={this.handleItemClick}
              >
                FEED
              </Menu.Item>}
              {loginCheck && <Menu.Item
                name="MY"
                active={activeItem === "MY"}
                onClick={this.handleItemClick}
              >
                MY
              </Menu.Item>}
              {loginCheck &&   <Menu.Item className="located" style={{fontWeight:600, fontSize:"17px", width:"250px"}}>
                {url === "mainpage" && ("봉사활동 맞춤검색")}
                {url === "feed" && ("피드")}
                {(url === "mypage" || url === "usersetting") && ("마이페이지")}
                {url === "" && ("")}
                {url === "login" && ("로그인")}
                {url === "join" && ("회원가입")}
                {window.location.href.includes("detail") && ("봉사활동 상세정보")}
                {window.location.href.includes("write") && ("글 작성하기")}
                {window.location.href.includes("postinglist") && ("모집 & 후기")}
              </Menu.Item>}
              {!loginCheck &&
              <Menu.Item style={{width:"445.23px"}}></Menu.Item>
              }
              <Menu.Item className="icons" >
                <Dropdown compact icon="user" style={{ marginRight: "2.5rem" }}>
                  <Dropdown.Menu>
                    {!loginCheck ? (
                      <Dropdown.Item >
                        <Link to="/login">
                          로그인
                          </Link>
                      </Dropdown.Item>
                    ) : (
                        <div>                 
                          <Dropdown.Item onClick={this.handleLogout}>
                          로그아웃
                        </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item>
                            <Link to="/usersetting">
                              회원정보수정
                      </Link>
                          </Dropdown.Item>
                        </div>)}

                  </Dropdown.Menu>
                </Dropdown>
                </Menu.Item>
                
              <Menu.Item position="right"></Menu.Item>
              </Container>
            </Menu>
        </Responsive>
      </div>
    );
  }
}

export default connect(
  (state: any) => ({
    loginCheck: state.auth.get("loginCheck")
  }),
  dispatch => ({
    AuthActions: bindActionCreators(authActions, dispatch),
    PageActions: bindActionCreators(pageActions, dispatch),
    VolActions: bindActionCreators(volActions, dispatch),
    UserActions: bindActionCreators(userActions, dispatch)
  })
)(HeaderForDesktop);
