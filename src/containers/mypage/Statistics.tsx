import React, { Component } from "react";

import { List } from "immutable";

// redux 관련
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import PieGraph from "components/graph/PieGraph";
import * as volActions from "redux/modules/vol";
import RegionList from "lib/json/region.json";
import CategoryList from "lib/json/category.json";
import {Container} from 'semantic-ui-react'

interface Props {
  VolActions: any;
  userId: string;
  volListByUserId: List<any>;
}
interface State {
  isMainLocationGraph : boolean;
  isMainCategoryGraph : boolean;
  locationUpdateFlag : boolean;
  categoryUpdateFlag : boolean;
  selectedElementIndex : number;
  preferlocationDataList: number[];
  preferlocationLabelList: string[];
  preferCategoryDataList: number[];
  preferCategoryLabelList: string[];
}

class Statistics extends Component<Props, State> {
  state = {
    isMainLocationGraph : true,
    isMainCategoryGraph : true,
    locationUpdateFlag : false,
    categoryUpdateFlag : false,
    selectedElementIndex : 0,
    preferlocationDataList: [],
    preferlocationLabelList: [],
    preferCategoryDataList: [],
    preferCategoryLabelList: []
  };
  componentDidMount() {
    // TODO : volListByUser에서 봉사지역, 봉사 시간등을 추출해서 통계 자료 data, labels 만들기...
    const { volListByUserId } = this.props;
    let preferlocationDataList : number[] = [];
    let preferlocationLabelList : string[] = [];
    let preferCategoryDataList : number[] = [];
    let preferCategoryLabelList : string[] = [];
    // 봉사 리스트에 대해서 작업
    let list = volListByUserId.toJS();
    let preferLocationMap = new Map<string, number>();
    let preferCategoryMap = new Map<string, number>();
    if (typeof list !== "undefined") {
      list.forEach((item: any) => {
        // 지역 뽑아내기 (시, 구)
        let r_id = item.r_id - 1;
        let region1 = RegionList[r_id].r_sidoNm; // 시, 도
        // let region2 = RegionList[r_id].r_gugunNm; // 구, 군

        // 선호 시간 뽑아내기 (시작 시간, 끝 시간)
        // let beginTime = item.v_bgnTm; // 17:00:00 양식
        // let endTime = item.v_endTm;

        // 같은 시 갯수 세기
          if (typeof preferLocationMap.get(region1) === "undefined") {
            preferLocationMap.set(region1, 1);
          } else {
            preferLocationMap.set(region1, preferLocationMap.get(region1)! + 1);
          }
        // 카테고리 뽑아내기
        let ca_id = item.ca_id - 1;
        let bigCategory = CategoryList[ca_id].ca_highNm; // 생활편의지원

        // 같은 카테고리 갯수 세기
        if (typeof preferCategoryMap.get(bigCategory) === "undefined") {
          preferCategoryMap.set(bigCategory, 1);
        } else {
          preferCategoryMap.set(
            bigCategory,
            preferCategoryMap.get(bigCategory)! + 1
          );
        }
      });
      preferLocationMap.forEach((regionCount, regionName) => {
        preferlocationDataList.push(regionCount);
        preferlocationLabelList.push(regionName);
      });
      preferCategoryMap.forEach((categoryCount, categoryName) => {
        preferCategoryDataList.push(categoryCount);
        preferCategoryLabelList.push(categoryName);
      });
      // let preferTimeDataList = [],
      // let preferTimeLabelList = []
      if (preferlocationDataList.length > 0 && preferlocationLabelList.length > 0) {
        this.setState({ preferlocationDataList: preferlocationDataList });
        this.setState({ preferlocationLabelList: preferlocationLabelList });
      }
      if (preferCategoryDataList.length > 0 && preferCategoryLabelList.length > 0) {
        this.setState({ preferCategoryDataList: preferCategoryDataList });
        this.setState({ preferCategoryLabelList: preferCategoryLabelList });
      }
    }
  }

  componentDidUpdate(){
    // TODO : volListByUser에서 봉사지역, 봉사 시간등을 추출해서 통계 자료 data, labels 만들기...
    const { isMainLocationGraph, isMainCategoryGraph, locationUpdateFlag, categoryUpdateFlag, selectedElementIndex } = this.state;
    if(locationUpdateFlag){
      this.setState({locationUpdateFlag: false, isMainLocationGraph : !isMainLocationGraph},
        ()=>{
          const { volListByUserId } = this.props;
          let preferlocationDataList : number[] = [];
          let preferlocationLabelList : string[] = [];
          let mainLocationIndexMap = new Map<string, number>();
          // 봉사 리스트에 대해서 작업
          let list = volListByUserId.toJS();
          let preferLocationMap = new Map<string, number>();
          let locationIndex = 0;
          list.forEach((item: any) => {
            // 지역 뽑아내기 (시, 구)
            let r_id = item.r_id - 1;
            let region1 = RegionList[r_id].r_sidoNm; // 시, 도
            let region2 = RegionList[r_id].r_gugunNm; // 구, 군
    
            // 선호 시간 뽑아내기 (시작 시간, 끝 시간)
            // let beginTime = item.v_bgnTm; // 17:00:00 양식
            // let endTime = item.v_endTm;
    
            // 시의 인덱스 구하기
            if(!mainLocationIndexMap.has(region1)){
              mainLocationIndexMap.set(region1,locationIndex);
              locationIndex++;
            }
            // 같은 시 갯수 세기
            if(this.state.isMainLocationGraph){
              if (typeof preferLocationMap.get(region1) === "undefined") {
                preferLocationMap.set(region1, 1);
              } else {
                preferLocationMap.set(region1, preferLocationMap.get(region1)! + 1);
              }
            }
            else{
              //시에 해당하는 인덱스인 경우에만 같은 구 갯수 세기
              if(mainLocationIndexMap.get(region1)===selectedElementIndex){
                if (typeof preferLocationMap.get(region2) === "undefined") {
                  preferLocationMap.set(region2, 1);
                } else {
                  preferLocationMap.set(region2, preferLocationMap.get(region2)! + 1);
                }
              }
            }
            
          });
          preferLocationMap.forEach((regionCount, regionName) => {
            preferlocationDataList.push(regionCount);
            preferlocationLabelList.push(regionName);
          });
          if (preferlocationDataList.length > 0 && preferlocationLabelList.length > 0) {
            this.setState({ preferlocationDataList: preferlocationDataList });
            this.setState({ preferlocationLabelList: preferlocationLabelList });
          }
        });
    }
    if(categoryUpdateFlag){
      this.setState({categoryUpdateFlag: false, isMainCategoryGraph : !isMainCategoryGraph},
        ()=>{
          const { volListByUserId } = this.props;
          let preferCategoryDataList : number[] = [];
          let preferCategoryLabelList : string[] = [];
          let mainCategoryIndexMap = new Map<string, number>();
          // 봉사 리스트에 대해서 작업
          let list = volListByUserId.toJS();
          let preferLocationMap = new Map<string, number>();
          let preferCategoryMap = new Map<string, number>();
          let categoryIndex = 0;
          list.forEach((item: any) => {
            
            // 카테고리 뽑아내기
            let ca_id = item.ca_id - 1;
            let bigCategory = CategoryList[ca_id].ca_highNm; // 생활편의지원
            let smallCategory = CategoryList[ca_id].ca_lowNm; // 청결 지도  <<<--- 이걸 쓴다.
    
            // 메인 카테고리의 인덱스 구하기
            if(!mainCategoryIndexMap.has(bigCategory)){
              mainCategoryIndexMap.set(bigCategory,categoryIndex);
              categoryIndex++;
            }
            // 같은 카테고리 갯수 세기
            if(this.state.isMainCategoryGraph){
              if (typeof preferCategoryMap.get(bigCategory) === "undefined") {
                preferCategoryMap.set(bigCategory, 1);
              } else {
                preferCategoryMap.set(
                  bigCategory,
                  preferCategoryMap.get(bigCategory)! + 1
                );
              }
            }else{
              //메인 카테고리에 해당하는 인덱스인 경우에만 같은 서브 카테고리 갯수 세기
              if(mainCategoryIndexMap.get(bigCategory)===selectedElementIndex){
                if (typeof preferCategoryMap.get(smallCategory) === "undefined") {
                  preferCategoryMap.set(smallCategory, 1);
                } else {
                  preferCategoryMap.set(smallCategory, preferCategoryMap.get(smallCategory)! + 1);
                }
              }
            }
          });
          preferCategoryMap.forEach((categoryCount, categoryName) => {
            preferCategoryDataList.push(categoryCount);
            preferCategoryLabelList.push(categoryName);
          });
          if (preferCategoryDataList.length > 0 && preferCategoryLabelList.length > 0) {
            this.setState({ preferCategoryDataList: preferCategoryDataList });
            this.setState({ preferCategoryLabelList: preferCategoryLabelList });
          }
        });
    }
  }

  setLocationUpdateFlag = (flag : boolean) => {
    this.setState({locationUpdateFlag : flag});
  }
  setCategoryUpdateFlag = (flag : boolean) =>{
    this.setState({categoryUpdateFlag : flag});
  }
  setSelectedElementIndex = (index : number) => {
    this.setState({selectedElementIndex : index});
  }
  render() {
    const {
      preferlocationDataList,
      preferlocationLabelList,
      preferCategoryDataList,
      preferCategoryLabelList
    } = this.state;
    return (
      <Container textAlign='center'>
          <PieGraph
            title={"봉사 선호 지역 통계"}
            data={preferlocationDataList}
            labels={preferlocationLabelList}
            width={270}
            height={270}
            setUpdateFlag={this.setLocationUpdateFlag}
            setSelectedElementIndex={this.setSelectedElementIndex}
          />
          <PieGraph
          title={"선호 봉사 분야 통계"}
          data={preferCategoryDataList}
          labels={preferCategoryLabelList}
          width={270}
          height={270}
          setUpdateFlag={this.setCategoryUpdateFlag}
          setSelectedElementIndex={this.setSelectedElementIndex}
          />
      </Container>
    );
  }
}

export default connect(
  ({ user, vol }: any) => ({
    volListByUserId: vol.get("volListByUserId")
  }),
  dispatch => ({
    VolActions: bindActionCreators(volActions, dispatch)
  })
)(Statistics);
