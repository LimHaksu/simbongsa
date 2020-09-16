import React, { Component } from "react";
import { List } from "immutable";
import VolList from "components/vol/VolList";
import { connect } from "react-redux";
import * as volActions from "redux/modules/vol";
import * as searchActions from "redux/modules/search";
import * as userActions from "redux/modules/user";
import { bindActionCreators } from "redux";

interface Props {
  volunteersForList: List<any>;
  input: string;
  SearchActions: any;
  VolActions: any;
  UserActions: any;
  locations: any;
  categorys: any;
  times: any;
}

class VolListPage extends Component<Props> {
  state = {
    pageNum: 1
  };

  shouldComponentUpdate(nextProps: any) {
    const { volunteersForList } = nextProps;
    return volunteersForList.size > 0;
  }
  loadMoreData = async () => {
    const {
      VolActions,
      input,
      locations,
      categorys,
      times,
      UserActions
    } = this.props;
    let preferLocate = locations.toJS().map((location: any) => location.text);

    let preferCategory = categorys.toJS().map((category: any) => category.text);
    const locateSize = preferLocate.length;
    const categorySize = preferCategory.length;

    for (let i = 0; i < 3 - locateSize; i++) {
      preferLocate.push("null null");
    }
    for (let i = 0; i < 3 - categorySize; i++) {
      preferCategory.push(null);
    }

    const firstLocation = preferLocate[0].split(" ");
    const secondLocation = preferLocate[1].split(" ");
    const thirdLocation = preferLocate[2].split(" ");

    const firstCategory = preferCategory[0];
    const secondCategory = preferCategory[1];
    const thirdCategory = preferCategory[2];

    let bgnTm = "";
    let endTm = "";

    if (times.toJS().morning === true) {
      bgnTm = "00:00:00";
    } else if (times.toJS().morning === false) {
      bgnTm = "12:00:01";
    }
    if (times.toJS().afternoon === true) {
      endTm = "23:59:59";
    } else if (times.toJS().afternoon === false) {
      endTm = "12:00:00";
    }
    if (times.toJS().afternoon === false && times.toJS().morning === false) {
      bgnTm = "00:00:01";
      endTm = "23:59:58";
    }
    UserActions.changeLoading(true);
    this.setState({ pageNum: this.state.pageNum + 1 });
    try {
      VolActions.appendList({
        input: input,
        firstLocation: firstLocation,
        secondLocation: secondLocation,
        thirdLocation: thirdLocation,
        firstCategory: firstCategory,
        secondCategory: secondCategory,
        thirdCategory: thirdCategory,
        bgnTm: bgnTm,
        endTm: endTm,
        pageNum: this.state.pageNum
      });
    } catch (e) {
      console.log(e);
    } finally {
      UserActions.changeLoading(false);
    }
  };

  render() {
    const { volunteersForList } = this.props;
    const { loadMoreData } = this;
    return (
      <VolList
        loadingMessage="봉사활동 목록을 불러오는중"
        volunteers={volunteersForList.toJS()}
        appendList={loadMoreData}
        height={"52vh"}
      />
    );
  }
}

export default connect(
  ({ vol, search, page }: any) => {
    return {
      volunteersForList: vol.get("volunteersForList"), // store에 있는 state를 this.pros로 연결
      input: search.get("input"),
      locations: search.get("locations"),
      categorys: search.get("categorys"),
      times: search.get("times"),
    };
  },
  dispatch => ({
    VolActions: bindActionCreators(volActions, dispatch),
    SearchActions: bindActionCreators(searchActions, dispatch),
    UserActions: bindActionCreators(userActions, dispatch),
  })
)(VolListPage);
