import React from "react";
import Vol from "components/vol/Vol";
import InfiniteScroll from "react-infinite-scroll-component";
// import "./VolList.css"
interface Props {
  volunteers: any[];
  width?: number;
  height: string;
  appendList: () => void; // volunteers 에 10개를 더 붙여주는 함수.
  loadingMessage: string;
}
interface State { }

export default class VolList extends React.Component<Props, State> {
  state = {
    pageNum: 1
  };
  loadMoreData = () => {
    this.setState({ pageNum: this.state.pageNum + 1 });
    this.props.appendList();
  };
  render() {
    const { volunteers } = this.props;
    const { loadMoreData } = this;
    const PrintArray = volunteers.map((vol: any, i: any) => {
      return <Vol volunteer={vol} v_id={vol.v_id} key={i} />;
    });

    return (
      <InfiniteScroll
        dataLength={volunteers.length}
        // height={height}
        next={loadMoreData}
        hasMore={volunteers.length >= this.state.pageNum * 10}
        loader={<p>봉사활동 목록을 불러오는중</p>}
        endMessage={volunteers.length > 0 && <p>모든 정보를 확인했습니다.</p>}
      >
        {PrintArray}
        {volunteers.length === 0 && <h3>해당되는 봉사활동 정보가 없어요.</h3>}
      </InfiniteScroll>
    );
  }
}
