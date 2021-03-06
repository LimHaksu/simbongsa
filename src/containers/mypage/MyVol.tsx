import React, { Component } from "react";
import * as volActions from "redux/modules/vol"
import { List } from "immutable";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import VolList from "components/vol/VolList";

interface Props {
  userId: string;
  VolActions: any;
  volListByUserId: List<any>;
}
interface State { }

class MyVol extends Component<Props, State> {
  state = {
    pageNum: 1
  };

  componentDidMount() {
    const { VolActions, userId, volListByUserId } = this.props;
    if (volListByUserId.size === 0) {
      VolActions.getVolListByUserId(userId);
    }
  }

  render() {
    const { volListByUserId } = this.props;
    return <div>
      <VolList height={"300px"} loadingMessage="봉사 리스트를 불러오는 중" volunteers={volListByUserId.toJS()} />
    </div>;
  }
}

export default connect(
  ({ vol }: any) => ({
    volListByUserId: vol.get("volListByUserId")
  }),
  dispatch => ({
    VolActions: bindActionCreators(volActions, dispatch)
  })
)(MyVol);
