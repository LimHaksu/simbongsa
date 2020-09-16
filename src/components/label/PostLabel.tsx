import React, { Component } from "react";
import { Label, Icon } from 'semantic-ui-react';
import "./PostLabel.scss";

interface Props {
  pStats: string;
}

interface State {
  message: string;
}

export default class CertLabel extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.setState({ message: "" });
  }
  componentDidMount() {
    const { pStats } = this.props;
    if (pStats === "1") {
      this.setState({ message: "모집" });
    } else if (pStats === "2") {
      this.setState({ message: "후기" });
    }
  }

  render() {
    const { pStats } = this.props;
    const { message } = this.state;
    return (
      <div style={{ display: "inline" }}>
        <Label className={pStats === "1" ? "recruit" : "review"} size='tiny' as='a'>{message}</Label>
      </div>
    );
  }
}
