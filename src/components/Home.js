import React, { useState, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import * as actionType from '../modules/action';
import './Home.css';

import * as firebase from 'firebase/app';
import 'firebase/database';
import {database} from '../firebase.js';


const Home = () =>{
    const [profile, loadProfile] = useState({});
    const dispatch = useDispatch();
    const profilesaved = useSelector(state => state.profilereducer, {});
    useEffect( () => {
        loadProfile(a => profilesaved.profile);
        
    });
    const b = profilesaved.profile;
    //console.log('b is : ' + JSON.stringify(b));
    //console.log(b);

    return (
        <div>
            <div id="homehead" className="head">Home</div>
            <div id="homebody" className="body">
                My name : {profile.name}
            </div>
        </div>
    );
};

export default Home;