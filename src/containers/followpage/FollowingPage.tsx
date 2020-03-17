import React, { Component, Fragment } from 'react'
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as UserApi from 'lib/api/UserApi'
import * as userActions from "redux/modules/user";
import UserProfile from 'components/user/profile/UserProfile';
import { List,  Responsive, Container  } from 'semantic-ui-react';
interface Props {
    match : any;
    loginUserId : any;
    userProfileMap : any;
}
interface State {
    followingList : string[];
    userId : string;
}

class FollowingList extends Component<Props, State> {
    state = { followingList : [] , userId : ""}
    componentDidMount(){
        const userId = this.props.match.params.id;
        let returnAxios = UserApi.getUserFollowing(userId);
        let followingList = [];
        returnAxios.then(
            (response : any)=>{
                followingList = response.data.data.map((item:any)=>item.m_userid)
                this.setState({followingList : followingList, userId : userId})
            }
        )
    }
    getProfileList(list : string[]){
        return list.map((userId:string, i)=>{
            return <List.Item style={{height: "70px"}} key={i}>
                <UserProfile profileSize="mini" profileUserId={userId} />
            </List.Item>
        })
    }
    componentDidUpdate(){
      const userId = this.props.match.params.id;
      if(this.state.userId !== userId){
        this.setState({userId : this.props.match.params.id})
        let returnAxios = UserApi.getUserFollowing(userId);
        let followingList = [];
        returnAxios.then(
            (response : any)=>{
                followingList = response.data.data.map((item:any)=>item.m_userid)
                this.setState({followingList : followingList, userId : userId})
            }
        )
      }
    }
    render() {
        const { followingList} = this.state;
        const { getProfileList } = this;
    // const followingList = userProfileMap.get(profileUserId).get('followingList');
    // let followerList = [], followingList = [],  isProfileUserFollowedByLoginUser = false;
        const userId = this.props.match.params.id;
    return (
        <Container style={{width:"100vw"}}>
        <UserProfile profileUserId={userId} />
          
          <Responsive minWidth={Responsive.onlyMobile.minWidth} maxWidth={1000}>
                {userId} 님의 팔로잉
              <List celled style={{width:"92vw"}}>
                {getProfileList(followingList)}
              </List>
            </Responsive>
            <Responsive minWidth={1001}>
              <Container style={{width:"700px"}}>
                {userId} 님의 팔로잉
              <List celled relaxed>
                {getProfileList(followingList)}
              </List>
              </Container>
            </Responsive>
        </Container>
    );
    }
}

export default connect(
    ({ user }: any, ownProps: any) => {
      return {
        loginUserId: user.getIn(["loggedInfo", "userId"]),
      };
    },
    dispatch => ({
      UserActions: bindActionCreators(userActions, dispatch)
    })
  )(FollowingList);
  