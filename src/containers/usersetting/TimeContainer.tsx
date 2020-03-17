import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as searchActions from "redux/modules/search";
import "./TimeContainer.scss"
import { withStyles, makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';
const IOSSlider = withStyles({
  root: {
    color: '#3880ff',
    height: 2,
    padding: '15px 0',
  },
  thumb: {
    height: 27,
    width: 27,
    backgroundColor: '#fff',
    boxShadow: iOSBoxShadow,
    marginTop: -14,
    marginLeft: -14,
    '&:focus,&:hover,&$active': {
      boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow,
      },
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 11px)',
    top: -22,
    '& *': {
      background: 'transparent',
      color: '#000',
    },
  },
  track: {
    height: 2,
  },
  rail: {
    height: 2,
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
  },
  mark: {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 1,
    marginTop: -3,
  },
  markActive: {
    opacity: 1,
    backgroundColor: 'currentColor',
  },
})(Slider);
const marks = [
    {
      value: 0,
      label: '0시',
    },
    {
      value: 12,
      label: '12시',
    },
    {
      value: 24,
      label: '24시',
    },
  ];
class TimeContainer extends Component<any, any> {
  state = {value: [0, 24]};
    componentDidMount(){
      const { times } =  this.props
      const { bgnTm, endTm } = times.toJS()
      let bgnTmInit = Number(bgnTm.split(":")[0])
      let endTmInit= 24
      if (endTm === "23:59:59"){
        endTmInit = Number(endTm.split(":")[0]) + 1
      }
      else{
        endTmInit = Number(endTm.split(":")[0]) 
      }
      this.setState({value:[bgnTmInit,endTmInit]})
    }
  
  
  handleChange = async (event: any, newValue: number | number[]) => {
    await this.setState({value: newValue as number[]});
    const { value } = this.state
    const { SearchActions } = this.props
    const bgnTm = this.valueToText(value[0])
    const endTm = this.valueToText(value[1])
    SearchActions.changeTime({time: 'bgnTm', value:bgnTm})
    SearchActions.changeTime({time: 'endTm', value:endTm})
  }
  valueToText = (value: number) => {
    if (-1 < value && value < 10){
    return `0${value}:00:00`;
    }
    else if(value=== 24){
      return `23:59:59`;
    }
    else{
      return `${value}:00:00`;
    }
  }
  valuetext(value: number) {
    if (value < 12){
      return `오전 ${value}시`;
    }
    else{
      const newVal = value - 12
      return `오후 ${newVal}시`;
    }
  }
  render(){
    const { value } = this.state
    const { handleChange } = this
  return (
    <Fragment >
    <div id="time-bar" style={{ marginTop: 25 }}>
      <IOSSlider value={value}
        min={0}
        max={24}
        onChange={handleChange}
        defaultValue={[0, 24]}
        marks={marks}
        aria-labelledby="non-linear-slider"
        valueLabelDisplay="on"
        getAriaValueText={this.valuetext}
        valueLabelFormat={this.valuetext} />
     </div>
    </Fragment>
  );
}
}
export default connect(
    ({ search }: any) => ({
      times:search.get('times')
    }),
    dispatch => ({
        SearchActions: bindActionCreators(searchActions, dispatch)
    })
)(TimeContainer);

