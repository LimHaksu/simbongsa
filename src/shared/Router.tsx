import React, { Component } from "react";
import { Route, BrowserRouter,Switch } from "react-router-dom";
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import 'shared/Router.scss';
// auth
import Join from "containers/join/Join";
import JoinComplete from "containers/join/JoinComplete";
import EmailComplete from "containers/join/EmailComplete";

import MailReSend from "containers/mailresend/MailReSend";

import Login from "containers/login/Login";

import FindPassword from "containers/findPassword/FindPassword";
import FindPasswordMailSend from "containers/findPassword/FindPasswordMailSend";

// user
import Mypage from "containers/mypage/Mypage";
import FindPasswordMailRecieve from "containers/findPassword/FindPasswordMailRecieve";

// curation
import Intro from "containers/intro/Intro";
import MainPage from "containers/mainpage/MainPage";
import UserSettingPage from "containers/usersetting/UserSettingPage";
import CalendarContainer from "containers/calendar/CalendarContainer";

import VolDetail from "components/vol/VolDetail";

import Feed from "containers/feed/Feed";
import PostingList from "containers/posting/PostingList";
import PostingForm from "containers/posting/PostForm";
import HeaderForMobile from "components/header/HeaderForMobile";
import Withdraw from "containers/usersetting/Withdraw";
import FooterForDesktop from "components/footer/FooterForDesktop";
import FooterForMobile from "components/footer/FooterForMobile";
import HeaderForDesktop from "components/header/HeaderForDesktop";
import LoginChecker from "components/loginchecker/LoginChecker";
import WithdrawComplete from "containers/usersetting/WithdrawComplete";
import OthersPage from "containers/otherspage/OthersPage";
import FollowingPage from "containers/followpage/FollowingPage"
import FollowerPage from "containers/followpage/FollowerPage"


class Router extends Component {
  direction = (history : any) => {
    // POP은 뒤로가기버튼을 눌렀을때 혹은 history.goBack을 호출했을때
    if (history.action === "POP") {
      return 'transiton-page-right'
    }else{
      return 'transiton-page-left'
    }
  };
  render() {
    return (
      <BrowserRouter>
      {/* 로그인 해야 접근 가능 페이지 ooo 표시 */}
      
      {/* 로그인체크  */}
      <Route path="/" component={LoginChecker} />

      {/* 헤더 */}
      <Route path="/" component={HeaderForDesktop} />
      <Route path="/" component={HeaderForMobile} /> 
      
      {/* 시작페이지 */}
      <Route exact path="/" component={Intro} />

      {/* 로그인 */}
      <Route exact path="/login" component={Login} />

      {/* 회원가입 */}
      <Route exact path="/join" component={Join} />
      <Route exact path="/join/complete" component={JoinComplete} />

      {/* 이메일 인증 */}
      <Route path="/email/:email/:key" component={EmailComplete} />
      <Route path="/mailresend" component={MailReSend} />

      {/* 비밀번호찾기 */}
      <Route exact path="/findpassword" component={FindPassword} />
      <Route exact path="/findpasswordmailsend" component={FindPasswordMailSend} />
      <Route exact path="/changepassword/:token" component={FindPasswordMailRecieve} />

      {/* 회원탈퇴 */}
      <Route exact path="/withdraw" component={Withdraw} /> 
      <Route exact path="/withdrawcomplete" component={WithdrawComplete} />

      {/* 동적으로 화면 전환이 일어나는 페이지 */}
      <Route render={({location, history})=>{
        return(
        <TransitionGroup id="transition-group">
        {/* classNames 에 들아가는 값에 따라 Router.scss 에서 클래스에 적용한 css가 동작합니다 */}
        <CSSTransition key={location.pathname} classNames={this.direction(history)} timeout={300}>
          <Switch location={location}>
          {/* 이 안에 <Route />를 넣으면 됩니다. */}

          {/* 메인페이지 ooo */}
          <Route exact path="/mainpage" component={MainPage} />
          <Route exact path="/calendar" component={CalendarContainer} />
          <Route exact path="/:id/postinglist" component={PostingList} />
          <Route exact path="/vol/:id/write" component={PostingForm} />

          {/* 피드페이지 ooo */}
          <Route exact path="/feed" component={Feed} />

          {/* 봉사 상세정보 페이지 ooo */}
          <Route exact path="/vol/:id/detail" component={VolDetail} /> 

          {/* 마이페이지 ooo */}
          <Route exact path="/mypage" component={Mypage} />

          {/* 다른회원 정보 ooo */}
          <Route exact path="/user/:id" component={OthersPage}/>
          <Route exact path="/follower/:id" component={FollowerPage}/>
          <Route exact path="/following/:id" component={FollowingPage}/>

          {/* 세팅 페이지 ooo */}
          <Route exact path="/usersetting" component={UserSettingPage} />

          </Switch>
          </CSSTransition>
        </TransitionGroup>
        )
      }}/>

      {/* footer */}
      <Route path="/" component={FooterForDesktop} />
      <Route path="/" component={FooterForMobile} />
      
      </BrowserRouter>
    );
  }
}

export default Router;
