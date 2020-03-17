import React, { Component } from "react";
import { Pie } from "react-chartjs-2";
import {Container} from 'semantic-ui-react';
// @ts-ignore
var palette = require("google-palette");
var convert = require("color-convert");
interface Props {
  labels: string[];
  data: number[];
  width: any;
  height: any;
  title: string;
  setUpdateFlag? : (flag : boolean) => void
  setSelectedElementIndex? : (index : number) => void
}
interface State {
  updateFlag : boolean
  data : any;
}

export default class PieGraph extends Component<Props, State> {
  state = {
    data: {
      labels: [],
      datasets: [
        {
          label: "",
          data: [],
          backgroundColor: [],
          borderWidth: 3
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      responsive: false,
      legend: {
        position: 'bottom',
        fullWidth: true,
        width:60,
        labels: {
          boxWidth: 10
        }
      }
    },
    updateFlag : false
  };

  shouldComponentUpdate(nextProps: any) {
    const { updateFlag } = this.state;
    if (updateFlag || this.state.data.datasets[0].data.length === 0) {
      this.setState({updateFlag: false},
        ()=>{
          const propsData = this.props.data;
          const { generateBackgroundColor } = this;
          const { data } = this.state;
          const { labels } = this.props;
          const len = propsData.length;
          this.setState({
            data: {
              ...data,
              labels: labels,
              datasets: [
                {
                  ...data.datasets[0],
                  data: propsData,
                  backgroundColor: generateBackgroundColor(len)
                }
              ]
            }
          });
        })
    }
    return this.state.data.datasets[0].data.length > 0;
  }

  generateBackgroundColor = (numberOfItems: number): string[] => {
    // 아래 두 가지 라이브러리 사용, 첫 번째 : 무지개 색 만들기, 두 번째 : rgb->hsv 변환 후 s값을 반으로 줄여서 연하게 만들기
    // https://www.npmjs.com/package/google-palette
    // https://www.npmjs.com/package/color-convert
    let list = palette(["rainbow"], numberOfItems);
    list = list.map(
      (item: string) =>
        "#" + convert.hsv.hex([convert.hex.hsv(item)[0], 50, 100])
    );
    return list;
  };
  handleItemClick = (elems : any) => {
    const { setUpdateFlag , setSelectedElementIndex } = this.props;
    if(typeof elems[0] !=='undefined' 
    && typeof setUpdateFlag !== 'undefined' 
    && typeof setSelectedElementIndex !== 'undefined'){
      this.setState({updateFlag:true});
      setUpdateFlag(true);
      setSelectedElementIndex(elems[0]._index);
    }
  }
  render() {
    const { data, options } = this.state;
    const { width, height, title } = this.props;
    return (
      <div>
        <div style={{fontWeight:700, fontSize:"20px"}}> {title} </div>
        {data.datasets[0].data.length === 0 && (
          <Container style={{height:height, lineHeight:`${height}px`}}>
                봉사 기록이 없어요. 이제 시작 해볼까요?
          </Container>
        )}
        {data.datasets[0].data.length > 0 && (
          <div style={{height:height, width:width, position:"relative", margin:"auto"}}>
          <Pie
            data={data}
            width={width}
            height={height}
            options={options} // width, height 커스텀 사이즈로 하기 위해선 옵션에서 maintainAspectRatio: false 설정
            getElementAtEvent={this.handleItemClick}
          />
          </div>
        )}
      </div>
    );
  }
}
