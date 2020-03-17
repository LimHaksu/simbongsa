import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as searchActions from "redux/modules/search";
import * as userActions from "redux/modules/user";
import "./SearchContainer.css"
import {
  AgeContainer,
  CategoryContainer,
  LocationContainer,
  TimeContainer
} from "containers/usersetting";

import { Container, Grid } from "semantic-ui-react";
import CurationModal from './CurationModal'
interface Iprops {
  locations: any;
  categorys: any;
  times: any;
  ages: any;
  SearchActions: any;
  UserActions: any;
  history: any;
  isRegister: boolean
  userId: string
}
class SearchContainer extends Component<any, any> {

  render() {
    const { isRegister } = this.props
    return (
      <Fragment>
        <Container>
          <Grid>
            <Grid.Row>
              <Grid.Column width={16}>
                <h1>선호지역</h1>
                <LocationContainer />
              </Grid.Column>
              <Grid.Column width={16}>
                <h1>선호 시간대</h1>
                <TimeContainer />

              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={16}>
                <h1>선호 봉사</h1>
                <CategoryContainer />

              </Grid.Column>
              <Grid.Column width={16}>
                <h1>나이</h1>
                <AgeContainer />
              </Grid.Column>
            </Grid.Row>
          </Grid>








          <div style={{ justifyContent: 'center', display: 'flex' }}>
            {isRegister && <CurationModal />}
          </div>


        </Container>
      </Fragment>
    );
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
)(SearchContainer);
