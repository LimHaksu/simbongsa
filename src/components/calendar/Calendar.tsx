import React, { Fragment } from 'react';
import { Button } from 'semantic-ui-react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import moment, { Moment as MomentTypes } from "moment";
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
function Calendar(props: Props) {
    return (
        <div className="Calendar">
            <Head date={props.date} changeDate={props.changeDate} toggle={props.toggle} volunteers={props.volunteers} changeToggle={props.changeToggle} dayVolList={props.dayVolList} calActions={props.calActions} />
            <Body date={props.date} changeDate={props.changeDate} toggle={props.toggle} volunteers={props.volunteers} changeToggle={props.changeToggle} dayVolList={props.dayVolList} calActions={props.calActions} />
        </div>
    )
}
function Head(props: Props) {
    return (
        <div className="Head">
            <button onClick={() => props.calActions(props.date.clone().subtract(1, 'month'), false)}><MdChevronLeft /></button>
            <span className="title" onClick={() => props.changeDate(moment())}>{props.date.format('MMMM YYYY')}</span>
            <button onClick={() => props.calActions(props.date.clone().add(1, 'month'), false)}><MdChevronRight /></button>
        </div>
    )
}

function Body(props: Props) {
    function generate() {
        const startWeek = props.date.clone().startOf('month').week();
        const endWeek = props.date.clone().endOf('month').week() === 1 ? 53 : props.date.clone().endOf('month').week();
        let calendar = [] as any;
        let idx = 0;
        for (let week = startWeek; week <= endWeek; week++ , idx++) {
            calendar.push(
                <div className="row" key={week} id={'id' + idx.toString()}>
                    {
                        Array(7).fill(0).map((n, i) => {
                            let current = props.date.clone().week(week).startOf('week').add(n + i, 'day')
                            let isSelected = props.date.format('YYYYMMDD') === current.format('YYYYMMDD') ? 'selected' : '';
                            let isToday = moment().format('YYYYMMDD') === current.format('YYYYMMDD') ? 'today' : '';
                            let isGrayed = current.format('MM') === props.date.format('MM') ? '' : 'grayed';
                            let isVol = props.volunteers.filter((volunteer: any) => volunteer.v_pBgnD == current.format('YYYY-MM-DD'));
                            if (isSelected === 'selected') {
                            }
                            let isCounted = isVol.size
                            let Expressed = true
                            if (isCounted === 0) {
                                Expressed = false
                            }
                            return (
                                <Fragment key={i}>
                                    <div className={`box`} onClick={() => props.calActions(current, true, isVol)}>
                                        {Expressed && <Button className={`count`} size='mini' onClick={() => props.calActions(current, true, isVol)}>{isCounted}개</Button>}
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