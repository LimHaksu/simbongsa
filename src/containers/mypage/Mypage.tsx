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
}
interface State {
}

class Mypage extends Component<Props, State> {
  componentDidMount() {
    window.scrollTo(0, 0);
    const { VolActions, userId } = this.props;
    VolActions.getVolListByUserId(userId);
  }

  render() {
    const { userId } = this.props;
    return (
      <div id="tab" style={{width:"100vw"}}>
        <Container>
          <UserProfile profileUserId={userId} />
        </Container>
          <TabforMypage userId={userId} />
      </div>
    );
  }
}

export default connect(
  ({ user }: any) => ({
    userId: user.getIn(["loggedInfo", "userId"]),
  }),
  dispatch => ({
    VolActions: bindActionCreators(volActions, dispatch)
  })
)(Mypage);
