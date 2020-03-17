import React, { Component } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import PostCard from 'components/posting/PostCard'
import './PostingList.css'
import * as VolApi from 'lib/api/VolApi'
import { Flag, Container } from 'semantic-ui-react'

class PostingList extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      posts: [],
      pgNum: 1,
      flag: false
    };
  }

  // v_id & 팔로우 여부로
  v_id = this.props.match.params.id;
  componentDidMount() {
    VolApi.getVolFeed(this.v_id, this.state.pgNum)
      .then((res: any) => {
        const data = res.data.data;
        this.setState({
          posts: data,
          pgNum: this.state.pgNum + 1
        });
      })
      .catch((err : any) => console.log(err));
  }

  loadMoreData() {
    VolApi.getVolFeed(this.v_id, this.state.pgNum)
      .then((res : any) => {
        const data = res.data.data;
        this.setState({
          posts: this.state.posts.concat(data),
          pgNum: this.state.pgNum + 1
        });
      })
      .catch((err : any) => console.log(err));
  }

  setFlag = (flag : boolean) =>{
    this.setState({ flag : flag });
  }

  componentDidUpdate() {
    if (this.state.flag) {
      this.setState({
        posts: [],
        pgNum: 1,
        flag: false},
        ()=>{
          VolApi.getVolFeed(this.v_id, this.state.pgNum)
          .then((res: any) => {
            const data = res.data.data;
            if (res.data.data.length > 0) {
            this.setState({
              posts: data,
              pgNum: this.state.pgNum + 1,
            });
          } else {
            this.setState({
              posts: [],
              pgNum: 1
            })
          }
          })
          .catch((err : any) => console.log(err));
      })
    }
  }

  render() {
    const { posts } = this.state;
    var postingList = posts.map((post: any, i: any) => {
      return <PostCard color="white" post={post} key={i} setFlag={this.setFlag} />;
    });
    return (
      <Container>
      <InfiniteScroll
        dataLength={posts.length}
        next={this.loadMoreData.bind(this)}
        hasMore={posts.lehgth >= this.state.pgNum * 10}
        loader={<p>게시글 목록을 불러오는 중</p>}
        endMessage={<p>모든 정보를 확인했습니다.</p>}
      >
        {postingList}
      </InfiniteScroll>
      </Container>
    );
  }
}

export default PostingList;