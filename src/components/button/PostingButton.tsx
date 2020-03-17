import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";


interface IProps {
  v_id: string;
}

class PostingButton extends Component<IProps, {}> {
  state = {};

  render() {
    return (
      <Link
        to={{
          pathname: `write`,
          state: this.props.v_id
        }}
      >
        <Button className="post">글 작성하기</Button>
      </Link>
    );
  }
}

export default PostingButton;
