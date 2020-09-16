import React from "react";
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button } from "semantic-ui-react";

interface Props extends RouteComponentProps {
  text: string;
}
const GoBackButton = (props: Props) => {
  const { text, history } = props;
  return (
    <Button color="orange" onClick={history.goBack}>
      {text}
    </Button>
  );
}

export default withRouter(GoBackButton);
