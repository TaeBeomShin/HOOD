import React, { useState, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import * as actionType from '../modules/action';
import './Navigation.css';
import Login from './login';

/*
추가해야 할 사항:
클릭시 색깔이 변하여 현재 내가 무슨 작업을 하고 있는지 보여주게 한다.
*/
const Navigation = () =>{    
    function copy(result){        
        this.state.id = result.id;
    }
    const sidebarstate = useSelector(state => state.reducer, []);
    const dispatch = useDispatch();
    return (
        <div className="navigation">
            <div id="login"><Login/></div>
            <div id="mypage" className="NavigationIcon" onClick={()=>dispatch(actionType.sidebarmypageObject)}>M</div>
            <div id="list" className="NavigationIcon" onClick={()=>dispatch(actionType.sidebarlistObject)}>List</div>
            <div id="chat" className="NavigationIcon" onClick={()=>dispatch(actionType.sidebarchatObject)}>Chat</div>
            <div id="test" className="NavigationIcon" onClick={()=>dispatch(actionType.sidebartestObject)}>Test</div>
        </div>
    );
};
  
export default Navigation;