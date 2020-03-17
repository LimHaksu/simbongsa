import React, { Component } from "react";
import * as postingAction from "redux/modules/posting";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from 'components/posting/PostCard';
interface Props {
  userId: string;
  PostingAction: any;
  postList: any;
}
interface State { }

class MyPost extends Component<Props, State> {
  state = {
    pageNum: 1,
    cardList: [],
    flag: false
  };

  async componentDidMount() {
    const { PostingAction, userId } = this.props;
    const { pageNum } = this.state;
    await PostingAction.resetPostByUser();
    await PostingAction.getPostByUser(userId, pageNum);
    this.setState({ pageNum: pageNum + 1 });
  }

  async componentWillUnmount(){
    const { PostingAction } = this.props;
    await PostingAction.resetPostByUser();
  }

  async loadMoreData() {
    const { userId, PostingAction } = this.props;
    const { pageNum } = this.state;
    await PostingAction.getPostByUser(userId, pageNum);
    this.setState({ pageNum: pageNum + 1 });
  }

  setFlag = (flag : boolean) =>{
    this.setState({ flag : flag });
  }

  async componentDidUpdate() {
    if (this.state.flag) {
      this.setState({
        pageNum: 1,
        flag: false},
        async ()=>{
          const { PostingAction, userId } = this.props;
          const { pageNum } = this.state;
          await PostingAction.resetPostByUser();
          await PostingAction.getPostByUser(userId, pageNum);
          this.setState({ pageNum: pageNum + 1 });
      })
    }
  }

  render() {
    const { postList } = this.props;
    const PrintArray = postList.map((post: any, i: any) => {
      return <PostCard color="white" post={post} key={i} setFlag={this.setFlag} />
    });
    return (
      <InfiniteScroll
        style={{ overflow: "none"}}
        dataLength={postList.length}
        next={this.loadMoreData.bind(this)}
        hasMore={postList.length >= this.state.pageNum * 10}
        loader={<p>게시글 목록을 불러오는 중</p>}
        endMessage={<p>모든 정보를 확인했습니다.</p>}
      >
        {PrintArray}
      </InfiniteScroll>
    );
  }
}

export default connect(
  ({ user, posting, vol }: any) => ({
    postList: posting.get("postsByUser").toJS()
  }),
  dispatch => ({
    PostingAction: bindActionCreators(postingAction, dispatch)
  })
)(MyPost);
