import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button } from "semantic-ui-react";

interface Props {
  v_id: string;
}

const PostingButton = (props: Props) => {
  return (
    <Link
      to={{
        pathname: `write`,
        state: props.v_id
      }}
    >
      <Button className="post">글 작성하기</Button>
    </Link>
  );
}

export default PostingButton;
