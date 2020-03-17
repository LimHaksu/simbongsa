import React, { Component } from "react";
// 직접 제작한 Component
import Map from "components/map/Map";
import VolInfo from "components/map/VolInfo";

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
  // state = { width: window.innerWidth, height: window.innerHeight - 345 };
  // componentDidMount() {
    // window.addEventListener("resize", this.updateDimensions);
  // }
  // updateDimensions = () => {
  //   this.setState({
  //     // width: window.innerWidth,
  //     // height: window.innerHeight - 345
  //   });
  // };
  // componentWillUnmount() {
  //   window.removeEventListener("resize", this.updateDimensions);
  // }
  render() {
    return (
      <div >
        <Map />
        {/* <VolInfo /> */}
      </div>
    );
  }
}

export default connect(
  ({ vol, user }: any) => ({
    showVolInfo: vol.get('showVolInfo'),
  }),
  dispatch => ({
    VolActions: bindActionCreators(volActions, dispatch),
  })
)(Location);
