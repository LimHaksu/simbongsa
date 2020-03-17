import React, { Component } from "react";
import { Label, Icon } from 'semantic-ui-react';
import "./CertLabel.css";

interface IProps {
  // v_Auth: number;
  v_pStatus: number;
  v_mBgnD: string;
  v_mEndD: string;
  volunteer: any;
}

export default class CertLabel extends Component<IProps & any, any> {
  state = {
    visibility: "",
    isCert: "",
    isCertClass: "",
    isFull: "",
    isFullClass: "",
  };

  printFunc(): void {
    var fullDate = this.dateFunc();
    var mBgnD= this.props.volunteer.v_mBgnD.replace(/-/g,'');
    var mEndD= this.props.volunteer.v_mEndD.replace(/-/g,'');

    if (this.props.volunteer.v_Auth > 0) {
      this.setState({ isCert: "시간인증" });
      this.setState({ isCertClass: "iscert" });
      this.setState({ visibility: "true" });
    } else if (this.props.volunteer.v_Auth === null) {
      this.setState({ visibility: "false" });
    }
    if (this.props.volunteer.v_pStatus === '3') {
      this.setState({ isFull: "모집완료" });
      this.setState({ isFullClass: "full" });
    } else if (this.props.volunteer.v_pStatus === '2') {
      if (mBgnD > fullDate) {
        this.setState({ isFull: "모집대기" });
        this.setState({ isFullClass: "w-full" });
      } else if (mEndD < fullDate){
        this.setState({ isFull: "모집완료" });
        this.setState({ isFullClass: "full" });
      } else {
        this.setState({ isFull: "모집중" });
        this.setState({ isFullClass: "n-full" })};
    } else if (this.props.volunteer.v_pStatus === '1') {
      this.setState({ isFull: "모집대기" });
      this.setState({ isFullClass: "w-full" });
    }
  }

  dateFunc() {
    var date = new Date();
    var year = date.getFullYear();
    var month: string | number = (1 + date.getMonth())
    month = month >= 10 ? month : '0' + month;
    var day: string | number = date.getDate();
    day = day >= 10 ? day : '0' + day;
    return  year + '' + month + '' + day;
  }

  componentDidMount() {
    this.printFunc();
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.volunteer !== this.props.volunteer) {
      this.printFunc();
    }
}
  render() {
    return (
      <div style={{ display: "inline" }}>
        <Label className={this.state.isCertClass} size='tiny' as='a' id={this.state.visibility}><Icon name="time" />{this.state.isCert}</Label>
        <Label className={this.state.isFullClass} size='tiny' as='a'><Icon name='user' />{this.state.isFull}</Label>
      </div>
    );
  }
}
