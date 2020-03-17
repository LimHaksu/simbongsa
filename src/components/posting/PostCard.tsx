import React from "react";
import { Card, Icon, Confirm, Loader } from "semantic-ui-react";
import PostDetail from "components/posting/PostDetail";
import "./PostCard.scss";
import UserProfile from "components/user/profile/UserProfile"
import { connect } from "react-redux";
import * as PostingApi from 'lib/api/PostingApi'
import PostLabel from 'components/label/PostLabel'

interface Props {
  post: {
    p_id: 0;
    p_content: "";
    v_id: 0;
    m_id: 0;
    p_status: string;
    userId: "";
    files: [];
  };
  color: string;
  user : any;
  setFlag: (flag : boolean) => void;
}

class PostCard extends React.Component<Props, {}> {
  state = {
    post: {
      p_content: "",
      v_id: -1,
      m_id: 0,
      p_id: this.props.post.p_id,
      post_vote_members: [],
      vote_cnt: 0,
      p_status: "",
      userId: "",
      files: []
    },
    open: false,
    result: false,
    updateFlag : false
  };

  show = () => this.setState({ open: true })

  handleConfirm = () => this.setState({ result: true, open: false })

  handleCancle = () => this.setState({ result: false, open: false })

  loadPost = () =>{
    let id = this.props.post.p_id;
    PostingApi.getPosts(id)
      .then((res: any) => {
        const resData = res.data.data;
        let temp = []
        if (resData.post_vote_members.length > 0) {
          for (let i = 0; i < resData.post_vote_members.length; i++) {
            temp.push(resData.post_vote_members[i].m_id.toString())
          }
        }
        this.setState({
          post: {
            p_content: resData.p_content,
            v_id: resData.v_id,
            m_id: resData.m_id,
            p_status: resData.p_status,
            files: resData.files,
            p_id: resData.p_id,
            post_vote_members: temp,
            vote_cnt: temp.length
          }
        });
      })
      .catch((err: any) => console.log(err));
  }

  componentDidMount() {
    this.loadPost();
  }

  componentDidUpdate(){
    const { updateFlag } = this.state;
    if(updateFlag){
      this.setState({updateFlag : false});
      this.loadPost();
    }
  }

  setUpdateFlag = (flag : boolean) => {
    this.setState({updateFlag: flag});
  }

  handleDelete(id: number) {
    PostingApi.deletePost(id)
      .then((res: any) => {
        // console.log(res)
        this.props.setFlag(true);
      })
      .catch((err: any) => console.log(err))
  }

  render() {
    const { post } = this.state;
    if(post.v_id===-1){
      return(<div/>)
    }
    const { m_id } = this.props.user.toJS()
    const { color } = this.props;
    if (this.state.result === true) {
      this.handleDelete(this.props.post.p_id)
      this.setState({ result: false })
    }
    return (

      <Card>
        <Card.Content style={{ backgroundColor: color}}>
          <Card.Header>
            <PostLabel pStats={post.p_status}/>
            {color !== "white" &&
            <div id="prefer" >선호설정 기반 추천 게시물입니다.</div>}
            {m_id === this.props.post.m_id &&
            <span style={{ float: 'right', right : "50px", position:'relative', zIndex: 10}}>
                <Icon name="x" onClick={this.show}/>
                {/* <span>글 삭제</span> */}
            </span>}
            <UserProfile profileSize="mini" profileUserId={this.props.post.userId} />
          </Card.Header>
              <Confirm
                content='작성한 글을 삭제하시겠습니까?'
                cancelButton='아니오'
                confirmButton='네'
                open={this.state.open}
                onCancel={this.handleCancle}
                onConfirm={this.handleConfirm}
                size='tiny'
              />

        </Card.Content>
        <Card.Content extra>
          <PostDetail
            post={this.state.post}
            setUpdateFlag={this.setUpdateFlag}
          />
        </Card.Content>
      </Card>
    )
  }
}

export default connect((state: any) => ({
  user: state.user.get("loggedInfo")
}))(PostCard);