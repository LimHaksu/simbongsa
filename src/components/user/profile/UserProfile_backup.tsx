import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "redux/modules/user";
import * as UserAPI from "lib/api/UserApi";

import ActionButton from "components/button/ActionButton";

// import "assets/mycss";

interface Props {
  UserActions: any;
  profileUserId: string; // 프로필을 표시할 유저 아이디
  userProfile: any;
  loginUserId: string; // 현재 로그인한 유저의 아이디, 자동으로 세팅된다.
}
enum page {
  PROFILE,
  FOLLOWER,
  FOLLOWING
}
interface State {
  followerList: string[];
  followingList: string[];
  isProfileUserFollowedByLoginUser: boolean;
  showPage: page;
}

class UserProfile extends Component<Props, State> {
  state = {
    followerList: [],
    followingList: [],
    isProfileUserFollowedByLoginUser: false,
    showPage: page.PROFILE
  };
  componentDidMount() {
    this.updateProfile();
  }
  updateProfile = async () => {
    // const { profileUserId, loginUserId } = this.props;
    // this.setState({
    //   followerList: await UserAPI.getUserFollower(profileUserId)
    // });
    // this.setState({
    //   followingList: await UserAPI.getUserFollowing(profileUserId)
    // });
    // this.setState({
    //   isProfileUserFollowedByLoginUser: await UserAPI.checkFollow(
    //     loginUserId,
    //     profileUserId
    //   )
    // });
  };

  handleFollow = async () => {
    // const { loginUserId, profileUserId } = this.props;
    // await UserAPI.followUser({
    //   followee_userid: profileUserId,
    //   follower_userid: loginUserId
    // });
    this.updateProfile();
  };
  handleUnfollow = async () => {
    // const { loginUserId, profileUserId } = this.props;
    // await UserAPI.unfollowUser({
    //   follower_userid: loginUserId,
    //   followee_userid: profileUserId
    // });
    this.updateProfile();
  };
  handleFollowingClick = (e: any) => {
    this.setState({ showPage: page.FOLLOWING });
  };
  handleFollowerClick = (e: any) => {
    this.setState({ showPage: page.FOLLOWER });
  };
  render() {
    // const userProfile = this.props.userProfile.toJS();
    const { loginUserId, profileUserId } = this.props;
    const {
      followerList,
      followingList,
      isProfileUserFollowedByLoginUser,
      showPage
    } = this.state;
    const {
      handleFollow,
      handleUnfollow,
      handleFollowingClick,
      handleFollowerClick
    } = this;
    return (
      <div className="user-profile">
        {showPage === page.PROFILE && (
          <div>
            아이디 : {profileUserId}
            <div className="cursor" onClick={handleFollowerClick}>
              팔로워 : {followerList.length} 명
            </div>
            <div className="cursor" onClick={handleFollowingClick}>
              팔로잉 : {followingList.length} 명
            </div>
            {loginUserId !== profileUserId &&
              !isProfileUserFollowedByLoginUser && (
                <ActionButton action={handleFollow} placeholder="팔로우" />
              )}
            {loginUserId !== profileUserId &&
              isProfileUserFollowedByLoginUser && (
                <ActionButton
                  action={handleUnfollow}
                  placeholder="팔로우 취소"
                />
              )}
          </div>
        )}
        {showPage === page.FOLLOWER && (
          <div>
            <ActionButton
              placeholder="뒤로"
              action={() => {
                this.setState({ showPage: page.PROFILE });
              }}
            />{" "}
            팔로워 리스트
          </div>
        )}
        {showPage === page.FOLLOWING && (
          <div>
            <ActionButton
              placeholder="뒤로"
              action={() => {
                this.setState({ showPage: page.PROFILE });
              }}
            />
            팔로잉 리스트
          </div>
        )}
      </div>
    );
  }
}

export default connect(
  ({ user }: any) => {
    return {
      userProfile: user.get("userProfile"), // store에 있는 state를 this.pros로 연결
      loginUserId: user.getIn(["loggedInfo", "userId"])
    };
  },
  dispatch => ({
    UserActions: bindActionCreators(userActions, dispatch)
  })
)(UserProfile);
