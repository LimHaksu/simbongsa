import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Button } from "semantic-ui-react";

interface IProps extends RouteComponentProps {
  text: string;
}

class GoBackButton extends React.Component<IProps, {}> {
  render() {
    return (
      <Button color="orange" onClick={this.props.history.goBack}>
        {this.props.text}
      </Button>
    );
  }
}

export default withRouter(GoBackButton);
