import React from 'react'
import { Label } from 'semantic-ui-react'
import './VolWeekday.css'
interface Props {
    weekday: any;
}

class VolWeekday extends React.Component<Props, {}>{

    render() {
        return (
            <div>
                {this.props.weekday &&
                (
                <div>
                <Label className={this.props.weekday[0] === "1" ? 'working' : 'nw'}>월</Label>
                <Label className={this.props.weekday[1] === "1" ? 'working' : 'nw'}>화</Label>
                <Label className={this.props.weekday[2] === "1" ? 'working' : 'nw'}>수</Label>
                <Label className={this.props.weekday[3] === "1" ? 'working' : 'nw'}>목</Label>
                <Label className={this.props.weekday[4] === "1" ? 'working' : 'nw'}>금</Label>
                <Label className={this.props.weekday[5] === "1" ? 'working' : 'nw'}>토</Label>
                <Label className={this.props.weekday[6] === "1" ? 'working' : 'nw'}>일</Label>
                </div>)
                }
            </div>
        )
    }
}

export default VolWeekday