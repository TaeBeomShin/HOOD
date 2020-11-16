import React, { useState, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import * as actionType from '../modules/action';
import './Navigation.css';
import { database } from '../firebase';
import NLogin from './NLogin.js';

/*
추가해야 할 사항:
클릭시 색깔이 변하여 현재 내가 무슨 작업을 하고 있는지 보여주게 한다.
*/
const Navigation = () =>{    
    const [NavList, setNavList] = useState([]);
    const sidebarstate = useSelector(state => state.reducer, []);
    const profilesaved = useSelector(state => state.profilereducer, {});
    const dispatch = useDispatch();
    
    useEffect(()=>{
        //가입되어 있는 사람인지를 확인->user db에 있는 사람인지로 파악.
        console.log('here');
        setNavList([]);
        if(profilesaved.loggedin == false){
            setNavList(oldList => [...oldList, {id: "Login", func: ()=>dispatch(actionType.sidebarloginObject)}]);
        }
        else{
            setNavList(oldList => [...oldList, {id: "Mypage", func: ()=>dispatch(actionType.sidebarmypageObject)}]);
            setNavList(oldList => [...oldList, {id: "Near", func: ()=>dispatch(actionType.sidebarnearObject)}]);
            setNavList(oldList => [...oldList, {id: "Chat", func: ()=>dispatch(actionType.sidebarchatObject)}]);
        }
    },[profilesaved, profilesaved.loggedin]);
 
    return (
        <div className="navigation">      
        <div id="home" className="NavigationIcon" onClick={()=>dispatch(actionType.sidebarhomeObject)}>Home</div>
            {NavList.map((element,index) => {
                return ( 
                    <div id={element.id} className="NavigationIcon" onClick={element.func}>{element.id}</div>
                )
            })}
        </div>
    );
};

export default Navigation;