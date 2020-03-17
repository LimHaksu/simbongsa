import React, { Component } from "react";
// import "assets/mycss";
import iconSrc from "assets/images/location_marker.png";
import './map.scss';
//직접 만든 컴포넌트
import VolList from "components/vol/VolList";
//redux 관련
import { connect } from "react-redux";

interface Props {
  selectedVolunteer: any;
  volunteersForMap: any;
}

interface State {
  volunteers: any[];
  volunteersForList: any[];
}

class VolInfo extends Component<Props, State> {
  state = { volunteers: [] as any, volunteersForList: [] as any };
  componentDidMount(){
    const { volunteersForMap } = this.props;
    if(volunteersForMap.size > 0){
      let volunteers = volunteersForMap.toJS();
      let volunteersForList: any[] = [];
      let idx = 0;
      volunteersForMap.toJS().forEach((vol: any) => {
        if (idx >= 10) {
          return;
        }
        volunteersForList.push(vol);
        volunteers.shift();
        idx = idx + 1;
      });
      this.setState({
        volunteers: volunteers,
        volunteersForList: volunteersForList
      });
    }
  }
  shouldComponentUpdate(nextProps: any) {
    const { volunteersForMap } = this.props;
    if (volunteersForMap !== nextProps.volunteersForMap) {
      let volunteers = nextProps.volunteersForMap.toJS();
      let volunteersForList: any[] = [];
      let idx = 0;
      nextProps.volunteersForMap.toJS().forEach((vol: any) => {
        if (idx >= 10) {
          return;
        }
        volunteersForList.push(vol);
        volunteers.shift();
        idx = idx + 1;
      });
      this.setState({
        volunteers: volunteers,
        volunteersForList: volunteersForList
      });
    }
    return true;
  }
  appendList = () => {
    const { volunteersForList, volunteers } = this.state;
    let idx = 0;
    let newVolunteersForList: any[] = volunteersForList;
    let newVolunteers: any[] = volunteers;
    volunteers.forEach((volunteer: any) => {
      if (idx >= 10) {
        return;
      }
      newVolunteersForList.push(volunteer);
      idx = idx + 1;
    });
    for (let i = 0; i < idx; ++i) {
      newVolunteers.shift();
    }
    this.setState({
      volunteers: newVolunteers,
      volunteersForList: newVolunteersForList
    });
  };
  render() {
    const { selectedVolunteer } = this.props;
    const { volunteersForList } = this.state;
    const { appendList } = this;
    // if(selectedVolunteer !=)
    return (
      <div className="main--text" style={{}}>
        {!selectedVolunteer.v_id && volunteersForList.length === 0 && (
          <div id="text">
            지도에서<span> </span>
            <b id="bold">
              위치<span> </span>
              <span id="image">
                <img id="marker-icon" src={iconSrc} alt="마커아이콘" width="20px" height="30px" />
              </span>
            </b>
            또는<span> </span>
            <b id="bold">
              숫자<span> </span>
              <span className="circle">1365</span>
            </b>
            를 눌러<br/> 자세한 정보를 알아보세요.
          </div>
        )}
        {/* {selectedVolunteer.v_id && (
          <div className="vol--info">
            <div>봉사활동명 : {selectedVolunteer.v_title}</div>
            <div>
              봉사일정: {selectedVolunteer.v_pBgnD} ~{" "}
              {selectedVolunteer.v_pEndD} / {selectedVolunteer.v_bgnTm} ~{" "}
              {selectedVolunteer.v_endTm}
            </div>
            <div>봉사장소: {selectedVolunteer.v_location}</div>
            <div>
              모집정보: {selectedVolunteer.v_mBgnD} ~{" "}
              {selectedVolunteer.v_mEndD}
            </div>
            <LinkButton
              link={`vol/detail/${selectedVolunteer.v_id}`}
              placeholder="상세보기"
            />
          </div>
        )} */}
        {selectedVolunteer.v_id && (
          <VolList
            volunteers={[selectedVolunteer]}
            appendList={appendList}
            height={"30vh"}
            loadingMessage="봉사 활동 정보 불러오는 중"
          />
        )}
        {!selectedVolunteer.v_id && volunteersForList.length > 0 && (
          <VolList
            volunteers={volunteersForList}
            appendList={appendList}
            height={"30vh"}
            loadingMessage="봉사 활동 정보 불러오는 중"
          />
        )}
      </div>
    );
  }
}

export default connect(({ vol }: any) => {
  return {
    selectedVolunteer: vol.get("selectedVolunteer"),
    volunteersForMap: vol.get("volunteersForMap")
  };
})(VolInfo);
