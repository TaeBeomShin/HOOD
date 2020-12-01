import React, { useState, useEffect } from 'react';
import './Map.css';
import { RenderAfterNavermapsLoaded, NaverMap, Polygon } from 'react-naver-maps'; // 패키지 불러오기
import SeoulDong from "./SeoulDong.json";
import { useSelector, useDispatch } from 'react-redux';
import * as actionType from '../modules/action';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'
import Theme from '../modules/Theme.js';

const PolyMap = (props) => {
  function MakePolygon(geojson, polyList) {
    var data = props.nearlist;
    data.forEach((feature,index) => {
      let coordinates = feature.coordinates;
      let name = feature.name;
      DisplayArea(coordinates, polyList, name, feature.chatroom);      
    })
  }

  function DisplayArea(coordinates, polyList, name, index) {
    var path = [];
    coordinates[0].forEach(data => {
      data.forEach(Coordinate => {
        path.push(new window.naver.maps.LatLng(Coordinate[1], Coordinate[0]))
      })
    })

    const Theme = useSelector(state => state.themereducer.polygondesign);
    const color1 = Theme.color[0]; const opacity1 = Theme.opacity[0];
    const color2 = Theme.color[1]; const opacity2 = Theme.opacity[1];
    const color3 = Theme.color[2]; const opacity3 = Theme.opacity[2];
    const [color, setColor] = useState(color1);
    const [opacity, setOpacity] = useState(opacity1);
    const scolor = '#FFFFFF';
    const sopacity = 1.0;
    const dispatch = useDispatch();

    const loggedin = useSelector(state => state.flagreducer.loggedin);
    const chatroom = useSelector(state => state.statereducer.chatroom);
    const sidebarstate = useSelector(state => state.statereducer.sidebarstate);

    const YesClick=()=>{
      dispatch(actionType.setSidebar('chat'));
      dispatch(actionType.setChatroom(index));
      dispatch(actionType.setChatroomname(name));
    }
    const polyClick = () => {
      if (loggedin === true) {
        setColor(color3);
        setOpacity(opacity3);
        dispatch(actionType.setSidebar('near'));
        dispatch(actionType.setChatroom(null));
        
        confirmAlert({
          title: '채팅방입장',
          message: `${name} 채팅방에 입장하시겠습니까?`,
          buttons: [
            {
              label: 'YES',
              onClick : () => YesClick()
            },
            {
              label: 'NO',
              onClick : () => {
                setColor(color1)
                setOpacity(opacity1)
              }
            }
          ]
        })
      }
      else{
        confirmAlert({
          title: '채팅방입장',
          message: '로그인 후 입장가능합니다.',
          buttons: [{ label: 'OK', }]
        })
      }
    }

    const polyOver = () => {
      if (color === color3) return;
      setColor(color2)
      setOpacity(opacity2)
    }

    const polyOut = () => {
      if (color === color3) return;
        setColor(color1)
        setOpacity(opacity1)
    }

    useEffect(()=>{
      if(chatroom === index && sidebarstate === 'chat'){
        setColor(color3);
        setOpacity(opacity3);
      }    
      else{
        setColor(color1)
        setOpacity(opacity1)
      }
    },[chatroom, sidebarstate, index])

    polyList.push(
      <Polygon
        id = {name}
        key = {name}
        paths={path}
        fillColor={color}
        fillOpacity={opacity}
        strokeColor={scolor}
        strokeOpacity={sopacity}
        strokeWeight={2}
        clickable={true}
        onClick={ () => polyClick()}
        onMouseover={polyOver}
        onMouseout={polyOut}
        style = {{transition : '0.3s'}}
      />
    );
  }


  function NaverMapAPI() {
    var polyList = [];
    MakePolygon(SeoulDong, polyList)
    return (
      <NaverMap
        mapDivId={'maps-getting-started-uncontrolled'} 
        style={{
          width: '100%', 
          height: '100%' 
        }}
        defaultCenter={{ lat: props.Geo['latitude'], lng: props.Geo['longitude'] }}     
        defaultZoom={14} 
        minZoom={13}
        maxZoom={16}
      >
        {polyList}
      </NaverMap>
    );
  }
  return (
    <NaverMapAPI />
  );
}


const Map = () => {
  const location = useSelector(state => state.datareducer.location);
  const nearlist = useSelector(state => state.datareducer.nearlist);

  return (
    <div className="Map">
      <RenderAfterNavermapsLoaded ncpClientId={'5blqxkrbsw'}>
        <PolyMap nearlist={nearlist} Geo={location} />
      </RenderAfterNavermapsLoaded>
    </div>
  );
};

export default Map;
