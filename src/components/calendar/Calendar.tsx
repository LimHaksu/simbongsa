import React, { Fragment } from 'react';
import { Button } from 'semantic-ui-react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import moment, { Moment as MomentTypes } from 'moment';
import './Calendar.scss';

interface Props {
    dayVolList: Function
    date: MomentTypes
    changeDate: Function
    changeToggle: Function
    toggle: boolean
    volunteers: any
    calActions: any
}
const Calendar = (props: Props) => {
    const { date, changeDate, toggle, volunteers, changeToggle, dayVolList, calActions } = props;
    return (
        <div className="Calendar">
            <Head date={date} changeDate={changeDate} toggle={toggle} volunteers={volunteers} changeToggle={changeToggle} dayVolList={dayVolList} calActions={calActions} />
            <Body date={date} changeDate={changeDate} toggle={toggle} volunteers={volunteers} changeToggle={changeToggle} dayVolList={dayVolList} calActions={calActions} />
        </div>
    )
}
const Head = (props: Props) => {
    const { calActions, changeDate, date } = props;
    return (
        <div className="Head">
            <button onClick={() => calActions(date.clone().subtract(1, 'month'), false)}><MdChevronLeft /></button>
            <span className="title" onClick={() => changeDate(moment())}>{date.format('MMMM YYYY')}</span>
            <button onClick={() => calActions(date.clone().add(1, 'month'), false)}><MdChevronRight /></button>
        </div>
    )
}

const Body = (props: Props) => {
    const { date, volunteers, calActions } = props;
    function generate() {
        const startWeek = date.clone().startOf('month').week();
        const endWeek = date.clone().endOf('month').week() === 1 ? 53 : date.clone().endOf('month').week();
        let calendar = [] as any;
        let idx = 0;
        for (let week = startWeek; week <= endWeek; week++, idx++) {
            calendar.push(
                <div className="row" key={week} id={'id' + idx.toString()}>
                    {
                        Array(7).fill(0).map((n, i) => {
                            let current = date.clone().week(week).startOf('week').add(n + i, 'day')
                            let isSelected = date.format('YYYYMMDD') === current.format('YYYYMMDD') ? 'selected' : '';
                            let isToday = moment().format('YYYYMMDD') === current.format('YYYYMMDD') ? 'today' : '';
                            let isGrayed = current.format('MM') === date.format('MM') ? '' : 'grayed';
                            let isVol = volunteers.filter((volunteer: any) => volunteer.v_pBgnD == current.format('YYYY-MM-DD'));
                            if (isSelected === 'selected') {
                            }
                            let isCounted = isVol.size
                            let Expressed = true
                            if (isCounted === 0) {
                                Expressed = false
                            }
                            return (
                                <Fragment key={i}>
                                    <div className={`box`} onClick={() => calActions(current, true, isVol)}>
                                        {Expressed && <Button className={`count`} size='mini' onClick={() => calActions(current, true, isVol)}>{isCounted}개</Button>}
                                        <span className={`text ${isSelected} ${isGrayed} ${isToday}`}>{current.format('D')}</span>
                                    </div>
                                </Fragment>
                            )
                        })
                    }
                </div >
            )
        }
        return calendar;
    }
    return (
        <div className="Body">
            <div className="row">
                <div className="box"><span className="text">SUN</span></div>
                <div className="box"><span className="text">MON</span></div>
                <div className="box"><span className="text">TUE</span></div>
                <div className="box"><span className="text">WED</span></div>
                <div className="box"><span className="text">THU</span></div>
                <div className="box"><span className="text">FRI</span></div>
                <div className="box"><span className="text">SAT</span></div>
            </div>
            {generate()}
        </div>
    )
}

export default Calendar