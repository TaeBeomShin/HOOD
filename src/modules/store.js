import * as actionType from './action';
import product from "immer";

const initialState = {
    id: undefined,
    pw: undefined,
    user_id: -1,
    sidebarstate: "home",
    chatid: undefined,
    mypageselecterstate: 'login',
    loggedin: false,
    chatname: undefined,
    newchat: true,
    chatroomlist: [],
    map: undefined,
    maploaded: false,
    profile:{
        age: '',
        birthday: '',
        email: '',
        gender: '',
        id: "-1",
        name: "Guest",
        nickname: '',
        profile_image: ''
    },
}

export default initialState;