import React, { Component } from "react";
// 직접 제작한 Component
import Map from "components/map/Map";

// redux 관련
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as volActions from "redux/modules/vol";
interface Props {
  VolActions: any;
}
interface State {
  height: number;
  width: number;
}

//constructor -> render -> componentDidMount -> render
class Location extends Component<Props, State> {
  render() {
    return (
      <div >
        <Map />
      </div>
    );
  }
}

export default connect(
  ({ vol }: any) => ({
    showVolInfo: vol.get('showVolInfo'),
  }),
  dispatch => ({
    VolActions: bindActionCreators(volActions, dispatch),
  })
)(Location);
