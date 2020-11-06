import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Sidebar from '../components/Sidebar';

const SidebarContainer = () =>{
    const sidebarstate = useSelector(state => state.reducer, []);
    console.log(sidebarstate.chatname);
    return <Sidebar sidebarstate={sidebarstate.sidebarstate}></Sidebar>;
};

export default SidebarContainer;