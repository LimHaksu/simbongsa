import React, { Component } from "react";
import { Label, Icon } from 'semantic-ui-react';
import "./PostLabel.scss";

interface IProps {
  // v_Auth: number;
  pStats: string;
}

export default class CertLabel extends Component<IProps, any> {
  state = { message: "" };
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
    return (
      <div style={{ display: "inline" }}>
        <Label className={pStats==="1"?"recruit":"review"} size='tiny' as='a'>{this.state.message}</Label>
      </div>
    );
  }
}
