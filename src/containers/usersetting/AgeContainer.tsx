import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as searchActions from "redux/modules/search";
import { Checkbox } from 'semantic-ui-react'
import './AgeContainer.css'
interface Props {
    ages: any
    SearchActions: any


}
interface State { }
class AgeContainer extends Component<Props, State> {
    state = {};

    handleToggle = (first: string, second: string) => {
        const { SearchActions } = this.props;

        SearchActions.toggle({ id: "ages", value: first, othervalue: second });
    };
    render() {
        const { handleToggle } = this;
        const { ages } = this.props;
        const { youth, adult } = ages.toJS();
        return (
            <Fragment>
                <div id="age">
                    <Checkbox
                        radio
                        label='청소년'
                        checked={youth}
                        onChange={() => handleToggle('youth', 'adult')}
                    />
                    <Checkbox
                        radio
                        label='성인'
                        checked={adult}
                        onClick={() => handleToggle('adult', 'youth')}
                    />
                </div>
            </Fragment>
        );
    };
}
export default connect(
    ({ search }: any) => ({
        ages: search.get('ages'),

    }),
    dispatch => ({
        SearchActions: bindActionCreators(searchActions, dispatch)
    })
)(AgeContainer);
