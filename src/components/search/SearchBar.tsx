// import _ from 'lodash'
import React, { Fragment } from 'react'
import SearchPresenter from 'components/search/SearchPresenter';
// redux 관련
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "redux/modules/user";
import * as volActions from "redux/modules/vol";
import * as searchActions from "redux/modules/search";
interface Iprops {
    input: string
    SearchActions: any
    VolActions: any
    loading: boolean
    UserActions: any
    volunteers: any
    locations: any
    categorys: any
    times: any
    ages: any
}
interface Istate {
    error: string
}
class SearchBar extends React.Component<Iprops, Istate> {
    state = {
        error: "",
    }
    handleSubmit = (event: any) => {
        const {  SearchActions } = this.props
        event.preventDefault()

        this.searchByTerm();
        SearchActions.searchSubmit(true);

    }

    updateTerm = (event: any) => {
        const { SearchActions } = this.props
        const { target: { value } } = event
        SearchActions.changeInput({ input: value, key: "" })
    }
    searchByTerm = async () => {
        const { input, VolActions, locations, categorys, times, ages, UserActions, SearchActions } = this.props
        let preferLocate = locations.toJS().map((location: any) => location.text)
        let preferCategory = categorys.toJS().map((category: any) => category.text)
        const locateSize = preferLocate.length
        const categorySize = preferCategory.length
        for (let i = 0; i < 3 - locateSize; i++) {
            preferLocate.push("null null")
        }
        for (let i = 0; i < 3 - categorySize; i++) {
            preferCategory.push(null)
        }
        const firstLocation = preferLocate[0].split(" ")
        const secondLocation = preferLocate[1].split(" ")
        const thirdLocation = preferLocate[2].split(" ")

        const firstCategory = preferCategory[0]
        const secondCategory = preferCategory[1]
        const thirdCategory = preferCategory[2]
        let age = "";
        if (ages.toJS().adult === true) {
            age = "1992-01-01";
        } else if (ages.toJS().youth === true) {
        age = "2005-01-01";
        }
        UserActions.changeLoading(true)
        try {
            VolActions.getVolList({ input: input, firstLocation: firstLocation, secondLocation: secondLocation, thirdLocation: thirdLocation, firstCategory: firstCategory, secondCategory: secondCategory, thirdCategory: thirdCategory, bgnTm: times.toJS().bgnTm, endTm: times.toJS().endTm, age:age })
            VolActions.getInitailList({ input: input, firstLocation: firstLocation, secondLocation: secondLocation, thirdLocation: thirdLocation, firstCategory: firstCategory, secondCategory: secondCategory, thirdCategory: thirdCategory, bgnTm: times.toJS().bgnTm, endTm: times.toJS().endTm, age:age, pageNum: 1 })
        } catch{
            this.setState({ error: "Can't find result." })
        } finally {
            UserActions.changeLoading(false)
            SearchActions.lastInput(input)
        }

    }

    render() {
        const { volunteers, input } = this.props
        const { error } = this.state
        return (
            <Fragment>
                <SearchPresenter
                    volResults={volunteers}
                    input={input}
                    error={error}
                    handleSubmit={this.handleSubmit}
                    updateTerm={this.updateTerm}
                ></SearchPresenter>
            </Fragment >

        )
    }
}


export default connect(
    ({ vol, search, user }: any) => {
        return {
            volunteers: vol.get("volunteers"), // store에 있는 state를 this.pros로 연결
            input: search.get("input"),
            loading: user.get('loading'),
            locations: search.get("locations"),
            categorys: search.get("categorys"),
            times: search.get("times"),
            ages: search.get("ages")
        };
    },
    dispatch => ({
        VolActions: bindActionCreators(volActions, dispatch),
        SearchActions: bindActionCreators(searchActions, dispatch),
        UserActions: bindActionCreators(userActions, dispatch),
    })
)(SearchBar);
