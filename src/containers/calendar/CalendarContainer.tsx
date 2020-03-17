import React from "react";
import { Moment as MomentTypes } from "moment";
import { List } from "immutable";
import { connect } from "react-redux";
import { changeDate, changeToggle } from "redux/modules/calendar";
import { bindActionCreators } from "redux";
import Calendar from "components/calendar/Calendar";
import * as volActions from "redux/modules/vol";
import VolList from "components/vol/VolList";
import './CalendarContainer.css'
interface Props {
  date: MomentTypes;
  changeDate: typeof changeDate;
  changeToggle: typeof changeToggle;
  toggle: boolean;
  volunteers: List<any>;
  VolActions: any;
  volunteersForCal: any;
}
class CalendarContainer extends React.Component<Props, any> {
  state = {
    pageNum: 1,
    width: window.innerWidth,
    height: window.innerHeight - 345
  };
  componentDidMount() {
    //this.props.changeDate(moment().add(1, 'month'))
  }
  loadMoreData = () => {
    this.setState({ pageNum: this.state.pageNum + 1 });
    const { VolActions } = this.props;
    VolActions.appendList(this.state.pageNum);
  };
  calActions = (date: any, toggle: any, vol?: any) => {
    const { changeDate, changeToggle, VolActions } = this.props;
    changeDate(date);
    changeToggle(toggle);
    VolActions.dayVolList(vol);
  };
  render() {
    const { props, loadMoreData } = this;

    return (
      <div>
        <Calendar
          date={props.date}
          changeDate={props.changeDate}
          changeToggle={props.changeToggle}
          dayVolList={props.VolActions.dayVolList}
          toggle={props.toggle}
          volunteers={props.volunteers}
          calActions={this.calActions}
        />
        <div className="calendarVolList">
          {props.toggle && (
            <VolList
              loadingMessage="봉사활동 정보 불러오는 중"
              volunteers={props.volunteersForCal.toJS()}
              appendList={loadMoreData}
              height={"59vh"}
            />
          )}
        </div>
      </div>
    );
  }
}

export default connect(
  ({ calendar, vol }: any) => ({
    date: calendar.date,
    toggle: calendar.toggle,
    volunteers: vol.get("volunteers"),
    volunteersForCal: vol.get("volunteersForCal")
  }),
  dispatch => ({
    changeDate: bindActionCreators(changeDate, dispatch),
    changeToggle: bindActionCreators(changeToggle, dispatch),
    VolActions: bindActionCreators(volActions, dispatch)
  })
)(CalendarContainer);
