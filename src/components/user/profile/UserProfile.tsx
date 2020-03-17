import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "redux/modules/user";
import * as pageActions from 'redux/modules/page';
import { Image } from 'semantic-ui-react'
import ActionButton from "components/button/ActionButton";
import profile_default from 'assets/images/profile_default.png';
import "./UserProfile.scss";

interface Props {
  UserActions: any;
  profileUserId: string; // 프로필을 표시할 유저 아이디
  loginUserId: string; // 현재 로그인한 유저의 아이디, 자동으로 세팅된다.
  userProfileMap: any; // 현재 표시중인 모든 유저들의 프로필 정보를 저장한 맵. key : 유저아이디, value : 팔로워, 팔로잉, 현재팔로우중여부
  history: any;
  profileSize: string;
  PageActions : any;
}
enum page {
  PROFILE,
  FOLLOWER,
  FOLLOWING
}
interface State {
  showPage: page;
  isProfileUpdateFinished : boolean;
}

class UserProfile extends Component<Props, State> {
  state = {
    showPage: page.PROFILE,
    isProfileUpdateFinished : false
  };
  componentDidMount(){
    this.setProfile();
  }
  setProfile = async () => {
    const { profileUserId, loginUserId, UserActions, userProfileMap } = this.props;
    if (typeof userProfileMap.get(profileUserId) === 'undefined' ||
          (typeof userProfileMap.get(profileUserId) !== 'undefined'
          && typeof userProfileMap.get(profileUserId).get('followerList') === 'undefined')) {
      this.setState({isProfileUpdateFinished:false},async()=>{
        await UserActions.setUserFollowerList(profileUserId);
        await UserActions.setUserFollowingList(profileUserId);
        await UserActions.setUserFollowTag(loginUserId, profileUserId);
        await UserActions.setUserProfileImage(profileUserId);
        this.setState({isProfileUpdateFinished: true});
      })
    }
  }
  updateProfile = async () => {
    const { profileUserId, UserActions, loginUserId, userProfileMap } = this.props;
    this.setState({isProfileUpdateFinished:false},async()=>{
      await UserActions.setUserFollowerList(profileUserId);
      await UserActions.setUserFollowingList(profileUserId);
      await UserActions.setUserFollowerList(loginUserId);
      await UserActions.setUserFollowingList(loginUserId);
      this.setState({isProfileUpdateFinished:true});
    })
  };

  handleFollow = async () => {
    const { loginUserId, profileUserId, UserActions } = this.props;
    await UserActions.followUser(loginUserId, profileUserId);
    this.updateProfile();
  };
  handleUnfollow = async () => {
    const { loginUserId, profileUserId, UserActions } = this.props;
    await UserActions.unfollowUser(loginUserId, profileUserId);
    this.updateProfile();
  };
  handleFollowingClick = (e: any) => {
    const { history, profileUserId } = this.props;
    history.push(`/following/${profileUserId}`);
  };
  handleFollowerClick = (e: any) => {
    const { history, profileUserId } = this.props;
    history.push(`/follower/${profileUserId}`);
  };

  shouldComponentUpdate(nextProps: any, nextState : any) {
    const { userProfileMap } = this.props;
    const { isProfileUpdateFinished } = nextState;
    if(isProfileUpdateFinished){
      this.setState({isProfileUpdateFinished:false});
      return true;
    }
    if(userProfileMap !== nextProps.userProfileMap){
      return true;
    }
    return false;
    // const { profileUserId } = this.props;
    // const { userProfileMap } = nextProps;
    // if(typeof userProfileMap.get(profileUserId) === 'undefined'){
    //   return false;
    // }
    // if(userProfileMap.get(profileUserId).size !== 4){
    //   return false;
    // }
    // if (typeof userProfileMap.get(profileUserId).get('followerList') === 'undefined'
    // || typeof userProfileMap.get(profileUserId).get('followingList') === 'undefined') {
    //   return false;
    // }
    // return true;
  }

  handleIdClick = async (e: any) => {
    const { history, profileUserId, PageActions} = this.props;
    await PageActions.setCurrentTab(0);
    history.push(`/user/${profileUserId}`);
  }

  render() {
    const { loginUserId, profileUserId, userProfileMap, profileSize } = this.props;

    // 첫 렌더링때 아직 유저프로필 맵이 세팅 안된 상태에서 우선 빈화면 출력
    if (typeof userProfileMap.get(profileUserId) === 'undefined') {
      return (<div></div>);
    }
    const followerList = userProfileMap.get(profileUserId).get('followerList');
    const followingList = userProfileMap.get(profileUserId).get('followingList');
    if (typeof followerList === 'undefined' || typeof followingList === 'undefined') {
      return (<div></div>);
    }
    const isProfileUserFollowedByLoginUser = userProfileMap.get(profileUserId).get('isProfileUserFollowedByLoginUser');
    let profileImage = userProfileMap.get(profileUserId).get('profileImage');
    const profileImageFlag = profileImage ? profileImage.split(`${process.env.REACT_APP_REST_BASE_API}/uploads/`)[1] : "null";
    profileImage = profileImageFlag !== "null" ? profileImage : profile_default;
    // let followerList = [], followingList = [],  isProfileUserFollowedByLoginUser = false;
    const {
      handleFollow,
      handleUnfollow,
      handleFollowingClick,
      handleFollowerClick
    } = this;
    return (
      <div className="user-profile">
        {/* {showPage === page.PROFILE && ( */}
        <div id={profileSize === 'mini' ? "userpage-mini" : "userpage"}>
          <div id="profileImage" onClick={this.handleIdClick} >
            {profileSize === 'mini' ?
              <Image src={profileImage} avatar style={{ fontSize: '20px' }} verticalAlign="bottom" />
              :
              <Image src={profileImage} avatar style={{ fontSize: '60px', marginBottom : '10px' }} verticalAlign="middle" />
            }
          </div>
          <div id={profileSize === 'mini' ? "userId-mini" : "userId"}>
            <div onClick={this.handleIdClick}>
              {profileUserId}
            </div>
            <div id="follow">
              <div onClick={handleFollowerClick}>
                <span>팔로워 </span> <span style={{ fontWeight: "bold" }}>{followerList.length}</span>
              </div>
              <div onClick={handleFollowingClick}>
                <span style={{ marginLeft: "1rem" }}>팔로잉</span> <span style={{ fontWeight: "bold" }}>{followingList.length}</span>
              </div>
            </div>
            <div id={profileSize === 'mini'?"follow-button-mini":"follow-button"}>
            {loginUserId !== profileUserId &&
              !isProfileUserFollowedByLoginUser && (
                
                <ActionButton  action={handleFollow} placeholder="팔로우" />
                
              )}
            {loginUserId !== profileUserId &&
              isProfileUserFollowedByLoginUser && (
                <ActionButton
                  action={handleUnfollow}
                  placeholder="팔로우 취소"
                />
              )}
              </div>
          </div>
        </div>
        {/* )} */}
      </div>
    );
  }
}

export default withRouter(connect(
  ({ user }: any, ownProps: any) => {
    return {
      loginUserId: user.getIn(["loggedInfo", "userId"]),
      userProfileMap: user.get("userProfileMap"),
    };
  },
  dispatch => ({
    UserActions: bindActionCreators(userActions, dispatch),
    PageActions: bindActionCreators(pageActions, dispatch)
  })
)(UserProfile));
