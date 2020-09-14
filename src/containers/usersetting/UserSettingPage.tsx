import React, { Component } from "react";
import UserSettingTab from "containers/usersetting/UserSettingTab";
import { Container } from "semantic-ui-react";
interface Props {
  history: any;
}
interface State {
  image: string;
  activeItem: string;
}

export default class UserSettingPage extends Component<Props, State> {
  state = { image: "", activeItem: "" };
  handleFileSelect = (e: any) => {
    var value = e.target.files;
    this.setState({ image: value });
  };

  render() {
    const { image, activeItem } = this.state;
    return <Container style={{ width: "600px" }}><UserSettingTab /></Container>;
  }
}
