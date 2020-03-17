import React, { Component } from 'react'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'
import { MdFilterTiltShift } from 'react-icons/md'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as searchActions from "redux/modules/search";
import * as userActions from "redux/modules/user";
interface IProps {
  locations: any;
  categorys: any;
  times: any;
  ages: any;
  SearchActions: any;
  UserActions: any;
  isRegister: boolean
  userId: string
}
interface IState {
  modalOpen: boolean
}
class CurationModal extends Component<IProps, IState> {
  state = { modalOpen: false }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  action = async () => {
    await this.handleLocalRegister()
    this.handleOpen()
  }

  handleLocalRegister = async () => {

    const {
      locations,
      categorys,
      times,
      ages,
      UserActions,
      SearchActions,
      userId,
      isRegister
    } = this.props;
    if (isRegister) {
      const preferRegion = locations.toJS().map((location: any) => location.key);
      const preferCategory = categorys
        .toJS()
        .map((category: any) => category.key);
      let age = "";
      if (ages.toJS().adult === true) {
        age = "1992-01-01";
      } else if (ages.toJS().youth === true) {
        age = "2005-01-01";
      }
      try {
        await SearchActions.preferRegister({
          age: age,
          bgnTm: times.toJS().bgnTm,
          endTm: times.toJS().endTm,
          preferRegion: preferRegion,
          preferCategory: preferCategory,
          userId: userId
        });
        // const loggedInfo = this.props.result.toJS();
        // // TODO: 로그인 정보 저장 (로컬스토리지/스토어)
        // storage.set("loggedInfo", loggedInfo);
        // UserActions.setLoggedInfo(loggedInfo);
        // UserActions.setValidated(true);
        //history.push("/mainpage"); // 회원가입 성공시 홈페이지로 이동
      }
      catch (e) {
        // TODO: 실패시 실패 ERROR 표현
        // if (e.response.status === 409) {
        //   const { key } = e.response.data;
        //   return this.setError(message, key);
      }
    }
  };
  render() {
    const { handleLocalRegister } = this
    return (
      <Modal
        trigger={<Button onClick={this.action} color='orange'>저장하기</Button>}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic
        size='mini'
      >
        <Header icon='browser' content='선호정보 저장' />
        <Modal.Content>
          <h3>선호정보가 저장되었습니다.</h3>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={this.handleClose} inverted>
            <Icon name='checkmark' /> 확인
            </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default connect(
  ({ search, user }: any) => ({
    locations: search.get("locations"),
    categorys: search.get("categorys"),
    times: search.get("times"),
    ages: search.get("ages"),
    userId: user.get("loggedInfo").get("userId"),
    preferInfo: user.getIn(["loggedInfo", "preferInfo"]),
    isRegister: search.get('isRegister')
  }),
  dispatch => ({
    SearchActions: bindActionCreators(searchActions, dispatch),
    UserActions: bindActionCreators(userActions, dispatch)
  })
)(CurationModal);