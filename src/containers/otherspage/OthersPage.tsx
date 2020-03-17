import React, { Component } from "react";

// redux 관련
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as volActions from "redux/modules/vol";
import TabforMypage from "containers/mypage/TabforMypage";
import { Container } from "semantic-ui-react";
import UserProfile from "components/user/profile/UserProfile";

interface Props {
  VolActions: any;
  userId: string;
  match: any;
}
interface State {
}

class Mypage extends Component<Props, State> {
  componentDidMount() {
    window.scrollTo(0, 0);
    const { VolActions } = this.props;
    const userId = this.props.match.params.id;
    VolActions.getVolListByUserId(userId);
  }

  render() {
    const userId = this.props.match.params.id;
    return (
      <div id='tab'>
        <Container>
          <UserProfile profileUserId={userId} />
        </Container>
        <TabforMypage userId={userId} />
      </div >
    );
  }
}

export default connect(
  ({ user }: any) => ({
  }),
  dispatch => ({
    VolActions: bindActionCreators(volActions, dispatch)
  })
)(Mypage);
