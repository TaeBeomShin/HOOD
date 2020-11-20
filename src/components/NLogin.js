import React, { useEffect, useState } from 'react';
import NaverLogin from './RNL';
import { useDispatch } from 'react-redux';
import * as actionType from '../modules/action';
import { database } from '../firebase.js';
import { setEmitFlags } from 'typescript';

const NLogin = (props) => {
    const dispatch = useDispatch();
    const [profile, setprofile] = useState({});
    const [nickname, setnickname] = useState();
    const [flag, setflag] = useState(false);

    useEffect(() => {
        if (flag == true) {
            dispatch(actionType.insertprofile(profile));
            dispatch(actionType.insertnickname(nickname));
            dispatch(actionType.sidebarmypageObject);
            dispatch(actionType.loggedinObject);
        }
    }, [flag]);

    const CheckExist = async (Nuser) => {
        let exist = false;
        let user = null;
        let nickname = null;
        await database.ref('/user').once('value').then((Snap) => {
            const Accounts = Snap.val();
            const Arr = Object.keys(Accounts);
            Arr.forEach(key => {
                if (Accounts[key]['profile']['id'] == Nuser['id']) {
                    exist = true;
                    user = Accounts[key]['profile'];
                    nickname = Accounts[key]['nickname'];
                }
            })
        })
        return [exist, user, nickname];
    }
    const Login = (User) => {
        //if result matches with an account in DB, user is set and goes to mypage
        CheckExist(User).then((ret) => {
            if (ret[0]) { // ret[0] = exist
                console.log('exists!');
                setprofile(ret[1]); //ret[1] = user;
                setnickname(ret[2]); //ret[2] = nickname;
                setflag(true);
            }
            else {
                console.log('no match!')
                const Arr = Object.keys(User);
                Arr.forEach(key => {
                    if (User[key] == undefined) {
                        User[key] = '';
                    }
                })
                setprofile(User);
                dispatch(actionType.insertprofile(User));
                dispatch(actionType.sidebarnsigninObject);
            }
        })
        //else if it doesn't, the page redirects to NSignin, 
    }
    return (
        <NaverLogin onSuccess={(result) => Login(result)} />
    );
};

export default NLogin;