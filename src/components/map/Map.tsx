import React, { Component } from "react";
import normalIcon from "assets/images/location_marker.png";
import selectedIcon from "assets/images/selected_marker.png";

import { List } from "immutable";
// redux 관련
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as volActions from "redux/modules/vol";
import * as searchActions from "redux/modules/search";
import * as VolApi from "lib/api/VolApi";
import * as userActions from "redux/modules/user";
import * as pageActions from "redux/modules/page";
import { Dimmer, Loader } from 'semantic-ui-react'

import "components/map/map.scss";

declare global {
  interface Window {
    kakao: any;
  }
}

interface IProps {
  volunteers: any;
  VolActions: any;
  currentLocation: any;
  volMap: any;
  selectedMarker: any;
  isSearchSubmit: boolean;
  SearchActions: any;
  volunteersForMap: any;
  showVolInfo: boolean;
  UserActions: any;
  PageActions : any;
  currentMapInfo : any;
}

interface IState {
  myLocation: { y: number; x: number };
  isMyLocationClicked: boolean;
  isMarkerRenderingNeed: boolean;
  isViewAllClicked : boolean;
  isZoomClicked : boolean;
  clusterer: any;
  height?: number;
  width?: number;
}

class Map extends Component<IProps, IState> {
  state = {
    clusterer: {clear : ()=>{}},
    myLocation: { y: 0, x: 0 },
    isMyLocationClicked: false,
    isMarkerRenderingNeed: true,
    isViewAllClicked : false,
    isZoomClicked : false,
    // height: window.innerHeight - 435,
    // width: window.innerWidth
  };
  componentDidMount() {
    const {
      VolActions,
      UserActions
    } = this.props;
    let currentLocation = this.props.currentLocation;
    const { currentMapInfo } = this.props;
    let level = currentMapInfo.get("level");
    if(currentMapInfo.getIn(["location","y"]) !== 0){
      currentLocation = currentMapInfo.get("location");
    }
    const el = document.getElementById("map");
    const volMap = new window.kakao.maps.Map(el, {
      center: new window.kakao.maps.LatLng(
        currentLocation.y,
        currentLocation.x
      ), // 지도의 중심좌표.
      level: level, // 지도의 레벨(확대, 축소 정도)
      scrollwheel: false // 마우스 휠 확대/축소 금지
    });
    window.kakao.maps.event.addListener(volMap, "click", () => {
      // 맵에서 마커가 아닌 곳을 찍었을 때 선택 정보 초기화
      VolActions.resetSelectedVol();
      VolActions.setVolunteersForMap([]);
      this.resetSelectedMarker();
      VolActions.setShowVolInfo(false);
    });
    // 맵의 위치가 바뀌었을때 현재 중심좌표를 저장하는 이벤트 리스너
    const { PageActions } = this.props;
    window.kakao.maps.event.addListener(volMap, 'dragend', function() {        
      // 지도 중심좌표를 얻어옵니다 
      let latlng = volMap.getCenter(); 
      let y = latlng.getLat();
      let x = latlng.getLng();
      let level = volMap.getLevel();
      PageActions.setCurrentMapInfo({y:y,x:x,level:level});
    });
    // 지도가 확대 또는 축소되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
    window.kakao.maps.event.addListener(volMap, 'zoom_changed', function() {        
      // 지도의 현재 레벨을 얻어옵니다 
      let latlng = volMap.getCenter(); 
      let y = latlng.getLat();
      let x = latlng.getLng();
      let level = volMap.getLevel();
      PageActions.setCurrentMapInfo({y:y,x:x,level:level});
    });


    VolActions.setVolMap(volMap);
    // getVols(VolActions); // volunteers 업데이트 하면서 업데이트 완료시점에 componentDidUpdate() 한번 호출함.
    
    // PageActions.setVolListForMap(volunteersForMap.toJS());
    // window.addEventListener("resize", this.updateDimensions); // 화면 크기를 바꿀 때 높이 동적 반영에 필요한 코드
  }

  shouldComponentUpdate(nextProps: any) {
    const { volunteers, showVolInfo } = this.props;
    this.resetSelectedMarker();
    if (volunteers !== nextProps.volunteers) {
      this.setState({ isMarkerRenderingNeed: true });
    }
    if (showVolInfo !== nextProps.showVolInfo) {
      if (nextProps.showVolInfo) {
        // resizeMap(volMap, window.innerHeight - 735); // 지도 크기 재조정
        // resizeMap(volMap, "60vh"); // 지도 크기 재조정
      } else {
        // resizeMap(volMap, window.innerHeight - 435); // 지도 크기 재조정
        // resizeMap(volMap, "60vh"); // 지도 크기 재조정
      }
    }
    return true;
  }

  componentDidUpdate() {
    const {
      volunteers,
      VolActions,
      selectedMarker,
      volunteersForMap,
      UserActions,
    } = this.props;
    const { volMap, isSearchSubmit, SearchActions } = this.props;
    const {
      myLocation,
      isMyLocationClicked,
      isMarkerRenderingNeed,
    } = this.state;

    // 내 위치를 클릭했을 때
    if (isMyLocationClicked) {
      const moveLatLon = new window.kakao.maps.LatLng(
        myLocation.y,
        myLocation.x
      );
      volMap.setLevel(4);
      volMap.panTo(moveLatLon);
      const { PageActions } = this.props;
      PageActions.setCurrentMapInfo({y:myLocation.y, x:myLocation.x, level : 4})
      this.setState({ isMyLocationClicked: false });
    }

    // 마커를 재 렌더링 할 필요가 있을 때
    // ex : 검색을 다시 한 경우, 위치를 이동한 경우 등 이벤트 발생시 isMarkerRenderingNeed 를 true로 체크해 줌
    if (isMarkerRenderingNeed) {
      this.resetMarkers();
      const { PageActions } = this.props;
      window.setTimeout(()=>{
        let clusterer = makeMarker(
          volunteers.toJS(),
          volMap,
          VolActions,
          selectedMarker,
          volunteersForMap,
          PageActions,
          this.promiseSetIsZoomClicked
        );
        this.setState({ clusterer: clusterer, isMarkerRenderingNeed: false });
      }, 100);
    }

    // 검색 버튼을 눌렀을 때 화면을 대한민국을 다 보이게 바꿈
    if (isSearchSubmit) {
      const moveLatLon = new window.kakao.maps.LatLng(35.888013, 127.791075);
      volMap.setLevel(14);
      volMap.panTo(moveLatLon);
      const { PageActions } = this.props;
      PageActions.setCurrentMapInfo({y:35.888013, x:127.791075, level : 14})
      SearchActions.searchSubmit(false);
    }
  }

  resetSelectedMarker = () => {
    const { selectedMarker } = this.props;
    const { kakao } = window;
    var normalIconSrc = normalIcon, // 마커이미지의 주소입니다
      normalIconSize = new kakao.maps.Size(20, 30), // 마커이미지의 크기입니다
      normalIconOption = { offset: new kakao.maps.Point(10, 15) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
    let markerImage = new kakao.maps.MarkerImage(
      normalIconSrc,
      normalIconSize,
      normalIconOption
    );
    if (selectedMarker !== null) selectedMarker.setImage(markerImage);
  };
  resetMarkers = () => {
    const { clusterer } = this.state;
    clusterer!.clear();
  };
  // 지도 확대, 축소 컨트롤에서 확대 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
  zoomIn = (map: any) => {
    let level = map.getLevel();
    if(level <= 8){
      map.setLevel(map.getLevel() - 1, {animate : true});
    }else{
    this.promiseSetIsZoomClicked(true).then(()=>{
      window.setTimeout(()=>{
        map.setLevel(map.getLevel() - 1);
        this.setState({isZoomClicked : false});
      },
      10)
    })
    }
  };
  // 지도 확대, 축소 컨트롤에서 축소 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
  zoomOut = (map: any) => {
    let level = map.getLevel();
    if(level <= 7){
      map.setLevel(map.getLevel() + 1, {animate : true});
    }else{
    this.promiseSetIsZoomClicked(true).then(()=>{
      window.setTimeout(()=>{
        map.setLevel(map.getLevel() + 1);
      this.setState({isZoomClicked : false});
      },
      10)
    })
    }
  };

  promiseSetIsZoomClicked = (flag : boolean) =>{
    return new Promise((resolve : any, reject : any)=>{
      this.setState({isZoomClicked : flag}, ()=>{
        resolve();
      });
    })
  }

  setMyLocation = () => {
    const { volMap, VolActions } = this.props;
    this.setState({isViewAllClicked : true},()=>{
      window.setTimeout(()=>{
        const moveLatLon = new window.kakao.maps.LatLng(35.888013, 127.791075);
      volMap.setLevel(14);
      volMap.panTo(moveLatLon);
      const { PageActions } = this.props;

      // 상세정보 보고 되돌아 왔을 경우를 대비한 정보 저장.
      PageActions.setCurrentMapInfo({y:35.888013, x:127.791075, level : 14})
      VolActions.resetSelectedVol();
      VolActions.setVolunteersForMap([]);
    
      this.resetSelectedMarker();
      VolActions.setShowVolInfo(false);
      this.setState({isViewAllClicked : false});
      },100)
    })
  };
  render() {
    const { zoomIn, zoomOut, setMyLocation } = this;
    const { isMarkerRenderingNeed , isViewAllClicked, isZoomClicked} = this.state;
    // const { height } = this.state;
    const { volMap } = this.props;
    return (
      <div className="map_wrap" id="map_wrap" style={{ height: "40vh" }}>
        <Dimmer active={isMarkerRenderingNeed || isViewAllClicked || isZoomClicked} inverted>
          <Loader content='봉사 지도 불러오는 중' />
        </Dimmer>
        <div id="map" style={{ width: "100%", height: "40vh" }} />
        {/* 내 위치는 HTTPS 를 사용해야합니다. */}
        <div className="custom_typecontrol radius_border">
          <span
            id="btnRoadmap"
            className="mylocation_btn"
            onClickCapture={() => {
              setMyLocation();
            }}
          >
            전체 보기
          </span>
        </div>
        <div className="custom_zoomcontrol radius_border">
          <span
            onClickCapture={() => {
              zoomIn(volMap);
            }}
          >
            <img
              src="http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_plus.png"
              alt="확대"
            />
          </span>
          <span
            onClickCapture={() => {
              zoomOut(volMap);
            }}
          >
            <img
              src="http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_minus.png"
              alt="축소"
            />
          </span>
        </div>
      </div>
    );
  }
}

// const getVols = (VolActions: any) => {
//   try {
//     VolActions.getVolList(); // 성공하면 store의 volunteers에 저장돼있음
//   } catch (e) {
//     console.log(e);
//   }
// };


const makeMarker = (
  volunteers: { v_id: string; v_x: number; v_y: number }[],
  volMap: any,
  VolActions: any,
  selectedMarker: any,
  volunteersForMap: any,
  PageActions : any,
  promiseSetIsZoomClicked : any
) => {
  // console.log("Map.tsx의 makeMarker 봉사지역들 : ", volunteers);
  const { kakao } = window;
  let positions: List<{
    content: any;
    latlng: any;
  }> = List([]);
  volunteers.forEach((volunteer: any) => {
    positions = positions.push({ content: volunteer, latlng: null });
  });

  // 마커 클러스터러를 생성합니다
  let clusterer = new kakao.maps.MarkerClusterer({
    map: volMap, // 마커들을 클러스터로 관리하고 표시할 지도 객체
    averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
    minLevel: 1, // 클러스터 할 최소 지도 레벨
    disableClickZoom: true, // 클러스터 클릭 level 9 -> 6 -> 이후에는 리스트
    calculator: [2, 10, 50, 100, 1000], // 클러스터의 크기 구분 값, 각 사이값마다 설정된 text나 style이 적용된다
    styles: [
      {
        // calculator 각 사이 값 마다 적용될 스타일을 지정한다
        width: "30px",
        height: "30px",
        background: "rgb(255, 162, 99, 0.9)",
        borderRadius: "15px",
        color: "#000",
        textAlign: "center",
        fontWeight: "bold",
        lineHeight: "31px"
      },
      {
        width: "35px",
        height: "35px",
        background: "rgb(255, 162, 99, 0.9)",
        borderRadius: "18px",
        color: "#000",
        textAlign: "center",
        fontWeight: "bold",
        lineHeight: "36px"
      },
      {
        width: "40px",
        height: "40px",
        background: "rgb(255, 162, 99, 0.9)",
        borderRadius: "20px",
        color: "#000",
        textAlign: "center",
        fontWeight: "bold",
        lineHeight: "41px"
      },
      {
        width: "45px",
        height: "45px",
        background: "rgb(255, 162, 99, 0.9)",
        borderRadius: "23px",
        color: "#000",
        textAlign: "center",
        fontWeight: "bold",
        lineHeight: "46px"
      },
      {
        width: "50px",
        height: "50px",
        background: "rgb(255, 162, 99, 0.9)",
        borderRadius: "25px",
        color: "#000",
        textAlign: "center",
        fontWeight: "bold",
        lineHeight: "51px"
      }
    ]
  });
  clusterer.setMinClusterSize(2);
  // 마커 이미지 정보들
  var normalIconSrc = normalIcon, // 마커이미지의 주소입니다
    normalIconSize = new kakao.maps.Size(20, 30), // 마커이미지의 크기입니다
    normalIconOption = { offset: new kakao.maps.Point(10, 15) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
  let markerImage = new kakao.maps.MarkerImage(
    normalIconSrc,
    normalIconSize,
    normalIconOption
  );
  var selectedIconSrc = selectedIcon,
    selectedIconSize = new kakao.maps.Size(20, 30),
    selectedIconOption = { offset: new kakao.maps.Point(10, 15) };
  let selectedMarkerImage = new kakao.maps.MarkerImage(
    selectedIconSrc,
    selectedIconSize,
    selectedIconOption
  );
  let markers = [] as any;
  for (var i = 0; i < positions.size; i++) {
    // 마커를 생성합니다
    let id = volunteers[i].v_id;
    var marker = new kakao.maps.Marker({
      // map: volMap, // 마커를 표시할 지도
      position: new kakao.maps.LatLng(volunteers[i].v_y, volunteers[i].v_x), // 마커의 위치
      image: markerImage,
      title: id
    });
    markers.push(marker);
    // 클릭 이벤트 리스터 생성
    window.kakao.maps.event.addListener(
      marker,
      "click",
      makeClickListener(
        volMap,
        marker,
        markerImage,
        selectedMarker,
        selectedMarkerImage,
        VolActions,
        id, 
        PageActions
      )
    );
    // 지도 움직일 경우 현재 위치 받아오는 이벤트 리스너
  }
  clusterer.addMarkers(markers);
  // 마커 클러스터러에 클릭이벤트를 등록합니다
  // 마커 클러스터러를 생성할 때 disableClickZoom을 true로 설정하지 않은 경우
  // 이벤트 헨들러로 cluster 객체가 넘어오지 않을 수도 있습니다
  kakao.maps.event.addListener(clusterer, "clusterclick", function (
    cluster: any
  ) {
    // 기존에 선택한 봉사정보가 있으면 초기화
    VolActions.resetSelectedVol();

    // 지도를 클릭된 클러스터의 마커의 위치를 기준으로 확대합니다
    let level = volMap.getLevel();

    if (level > 9) {
      level -=2 ;
      promiseSetIsZoomClicked(true).
      then(()=>{
      window.setTimeout(()=>{
        volMap.setLevel(level, {   anchor: cluster.getCenter() });
        promiseSetIsZoomClicked(false);
      },10)
    });
    } else if (level > 7) {
      level = 7;
      volMap.setLevel(level, {  anchor: cluster.getCenter(), animate: true});
    } else if (level > 5) {
      level = 5;
      volMap.setLevel(level, { anchor: cluster.getCenter(), animate : true });
    } else {
      // 리스트 보여주기
      VolActions.setShowVolInfo(true);
      let center = cluster.getCenter();
      volMap.panTo(center);
      PageActions.setCurrentMapInfo({y:center.getLat(), x:center.getLng(), level : level})
      let clusterMarkers = cluster.getMarkers();
      let promise = getNewVolunteersForMap(clusterMarkers);
      promise.then(response => {
        VolActions.setVolunteersForMap(response);
      });
    }

    
  });
  return clusterer;
};

async function getNewVolunteersForMap(clusterMarkers: any) {
  let newVolunteersForMap: any[] = [];
  for (const marker of clusterMarkers) {
    let response = await VolApi.getVolDetail(marker.getTitle());
    if (typeof response === "object") {
      newVolunteersForMap.push(response.data.data);
    }
  }
  return newVolunteersForMap;
}

// 클릭 이벤트를 처리하는 클로저를 만드는 함수입니다
function makeClickListener(
  volMap: any,
  marker: any,
  markerImage: any,
  selectedMarker: any,
  selectedMarkerImage: any,
  VolActions: any,
  id: string,
  PageActions : any
) {
  return function () {
    // 클릭된 마커가 없고, click 마커가 클릭된 마커가 아니면
    // 마커의 이미지를 클릭 이미지로 변경합니다
    if (!selectedMarker || selectedMarker !== marker) {
      // 클릭된 마커 객체가 null이 아니면
      // 클릭된 마커의 이미지를 기본 이미지로 변경하고
      // console.log("이미선태됨", selectedMarker);
      // !!selectedMarker && selectedMarker.setImage(markerImage);

      // 현재 클릭된 마커의 이미지는 클릭 이미지로 변경합니다
      // marker.setImage(selectedMarkerImage);
    }
    let currentLocationLatLng = marker.getPosition();
    volMap.panTo(currentLocationLatLng);
    PageActions.setCurrentMapInfo({y:currentLocationLatLng.getLat(), x:currentLocationLatLng.getLng(), level : volMap.getLevel()})
    // // 클릭된 마커를 현재 클릭된 마커 객체로 설정합니다
    // VolActions.setSelectedMarker(marker);
    VolActions.setSelectedVolunteer(id);
    VolActions.setShowVolInfo(true);
  };
}

export default connect(
  ({ vol, search, user, page }: any) => {
    return {
      volunteers: vol.get("volunteers"), // store에 있는 state를 this.pros로 연결
      volunteersForMap: vol.get("volunteersForMap"),
      currentLocation: vol.get("currentLocation"),
      volMap: vol.get("volMap"),
      selectedMarker: vol.get("selectedMarker"),
      isSearchSubmit: search.get("isSearchSubmit"),
      showVolInfo: vol.get("showVolInfo"),
      currentMapInfo : page.get("currentMapInfo")
    };
  },
  dispatch => ({
    VolActions: bindActionCreators(volActions, dispatch),
    SearchActions: bindActionCreators(searchActions, dispatch),
    PageActions: bindActionCreators(pageActions, dispatch),
    UserActions: bindActionCreators(userActions, dispatch)
  })
)(Map);
