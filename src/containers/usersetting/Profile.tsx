import React, { Component } from "react";
import { Container, Button, Image, Form } from "semantic-ui-react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { List } from "immutable";
import * as PostingApi from "lib/api/PostingApi";
import * as UsergApi from "lib/api/UserApi";
import * as userActions from 'redux/modules/user';
import FloatingMessage from "components/message/FloatingMessage"
import profile_default from 'assets/images/profile_default.png';

interface Props {
  mId: string;
  userId: string;
  userProfileMap : any;
  UserActions : any;
}
interface State {
  selectedFiles: any[];
  isSubmit: boolean;
  isDelete : boolean;
  preview : any;
}

class Profile extends Component<Props, State> {
  state = { selectedFiles: [], isSubmit: false, isDelete : false,  preview: null };
  componentDidMount() {
    const { userId, UserActions} = this.props;
    UserActions.setUserProfileImage(userId);
    // let data = UsergApi.getUserInfo(userId);
  }
  componentWillUnmount(){
    this.setState({isSubmit:false, isDelete: false})
  }
  handleFileSelect = (e: any) => {
    var id = e.target.id;
    var value = e.target.files[0];
    if(value){
      this.setState({ selectedFiles: [value], preview : URL.createObjectURL(value)});
    }
    // this.setState({ selectedFiles: newFileList });
  };

  handleSubmit = async (e: any) => {
    e.preventDefault();
    const { selectedFiles } = this.state;
    const { mId,userId, UserActions } = this.props;
    const file = new FormData();
    if (selectedFiles.length > 0) {
      file.append("file", selectedFiles[0]);
    }
    let data = await PostingApi.uploadProfileImage(mId, file);
    this.setState({isSubmit: true, isDelete: false}, ()=>{
      UserActions.setUserProfileImage(userId);
    })
    // this.props.history.push(`/${v_id}/postinglist`);
    // this.goListPage();
  };

  handleDelete = async (e: any) => {
    e.preventDefault();
    const { mId , userId, UserActions} = this.props;
    const file = new FormData();
    let data = await PostingApi.uploadProfileImage(mId, file);
    this.setState({isDelete: true},()=>{
      UserActions.setUserProfileImage(userId);
    });
    // this.props.history.push(`/${v_id}/postinglist`);
    // this.goListPage();
  };
  render() {
    // 첫 렌더링때 아직 유저프로필 맵이 세팅 안된 상태에서 우선 빈화면 출력
    const { userProfileMap, userId } = this.props;
    if (typeof userProfileMap.get(userId) === 'undefined') {
      return (<div></div>);
    }
    const { isSubmit,isDelete, preview } = this.state;
    const profileImage = userProfileMap.get(userId).get('profileImage');
    const profileImageFlag = profileImage ? profileImage.split(`${process.env.REACT_APP_REST_BASE_API}/uploads/`)[1] : "null";
    return (
      <div>
        <Container style={{width:"700px"}}>
          <Image src={isDelete? profile_default : (preview === null? (profileImageFlag === "null" ? profile_default : profileImage ): preview )} avatar style={{ fontSize: '60px', marginBottom : '10px' }}/>
          <div>프로필 사진 선택</div>
          <Form>
            <input
              type="file"
              id="files"
              multiple
              accept="image/*"
              onChange={this.handleFileSelect}
              style={{marginBottom : '10px'}}
            />
            <Button onClick={this.handleSubmit} style={{margin:"10px", backgroundColor:"orange"}} disabled={!preview}>프로필 사진 등록하기</Button>
            {isSubmit && <FloatingMessage message="저장되었습니다!"/>}
            <Button onClick={this.handleDelete} style={{margin:"10px"}}>프로필 사진 삭제하기</Button>
            {isDelete && <FloatingMessage message="삭제되었습니다!"/>}
          </Form>
        </Container>
      </div>
    );
  }
}

export default connect(
  ({ user }: any) => ({
    mId: user.get("loggedInfo").get("m_id"),
    userId: user.getIn(["loggedInfo", "userId"]),
    userProfileMap: user.get("userProfileMap"),
  }),
  dispatch => ({
    UserActions: bindActionCreators(userActions, dispatch)
  })
)(Profile);
