import React from "react";
import { Tab, Responsive, Container } from "semantic-ui-react";
import Statistics from "containers/mypage/Statistics";
import MyVol from "containers/mypage/MyVol";
import MyPost from "containers/mypage/MyPost";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as volActions from "redux/modules/vol";
import * as pageActions from "redux/modules/page";

const panes = (userId :string) =>{ return [
  {
    menuItem: {
      key: "vollist",
      content: "봉사활동",
      icon: "group",
      style: {fontSize : "12px"}
    },
    render: () => <Tab.Pane><MyVol userId={userId}/></Tab.Pane>
  },
  {
    menuItem: {
      key: "posting", content: "게시글",
      icon: "write",
      style: {fontSize : "12px"}
    },
    render: () => <Tab.Pane><MyPost userId={userId}/></Tab.Pane>
  },
  {
    menuItem: {
      key: "calendar",
      content: "봉사통계",
      icon: "pie graph",
      style: {fontSize : "12px"}
    },
    render: () => (
      <Tab.Pane>
        <Statistics userId={userId}/>
      </Tab.Pane>
    )
  }
]
};

interface Props {
  VolActions: any;
  PageActions: any;
  userId: string;
  currentTab : number;
}
interface State {

}
class TabForMypage extends React.Component<Props, State> {
  state = { activeIndex : 0 }
  componentDidMount() {
    const { VolActions, userId, currentTab} = this.props;
    VolActions.getVolListByUserId(userId);
    this.setState({activeIndex : currentTab}) // store에 저장해 둔 탭을 불러옴
  }
  handleTabChange = (e :any , { activeIndex } : any) => {
    const { PageActions } = this.props;
    PageActions.setCurrentTab(activeIndex); // 클릭한 탭을 store에 저장해 둠
    this.setState({activeIndex}); // 클릭한 탭으로 바꿔줌
  }
  public render() {
    const{ userId } = this.props;
    const { activeIndex } = this.state;
    return (
      <div id="tab">
        {/* 데스크탑용 */}
        <Responsive minWidth={1001}>
          <Container style={{width:"700px"}}>
          <Tab
          panes={panes(userId)}
          activeIndex={activeIndex}
          onTabChange={this.handleTabChange}/>
          </Container>
        </Responsive>
        {/* 모바일 용 */}
        <Responsive minWidth={Responsive.onlyMobile.minWidth} maxWidth={1000}>
          <Tab
          panes={panes(userId)}
          activeIndex={activeIndex}
          onTabChange={this.handleTabChange}/>
          </Responsive>
      </div>
    );
  }
}


export default connect(
  ({ vol, page }: any) => ({
    volListByUserId: vol.get("volListByUserId"),
    currentTab : page.get("currentTab")
  }),
  dispatch => ({
    VolActions: bindActionCreators(volActions, dispatch),
    PageActions: bindActionCreators(pageActions, dispatch)
  })
)(TabForMypage);

