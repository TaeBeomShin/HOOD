import React, { useState, useEffect, useRef } from 'react'; // import 로 useState 를 불러온다!
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { database } from '../firebase';
import './Chat.css';
import * as actionType from '../modules/action';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Close from '@material-ui/icons/Close';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Search from '@material-ui/icons/Search';
/*
*chat DB
*messageObj
* - chat_id     (string): 채팅 메시지의 고유값
* - chatroom_id (string): 채팅 메시지가 사용된 채팅방의 고유값
* - type        (string): 메시지의 타입 (text, image(아직 미반영)) 
* - time        (string): 메시지가 전송된 시간, (형식: Wed Nov 14 2020 13:30:00 GMT+0900 (대한민국 표준시))
* - user_key    (string): 메시지를 보낸 사람의 고유값
* - nickname    (string): user의 nickname
* - content     (string?): 메시지의 내용
*
*function
*getTime(time)          : Date.toString()의 값을 인자로 전달받아 HH:MM형태로 반환해준다.
*                       : 과거 메시지의 시간을 표시하기 위해 사용된다.
*sendMessage(e)         : event trigger을 인자로 받으며, 채팅창에 입력된 메시지를 socketio를 통해 전송한다.
*receiveMessage(messageObj): messageObj를 인자로 받으며, messages state에 Object를 배열의 형태로 저장한다. 
*handleChange(e)        : 채팅창에 입력된 내용이 message state에 string형태로 저장된다.
*
*
*
*/
const Chat = (props) => {

  const [messagelist, setMessagelist] = useState([]);//모든 메시지(server로부터 받은 모든 메시지)
  const [message, setMessage] = useState("");//내가 입력한 메시지

  const chatroom = useSelector(state => state.statereducer.chatroom); // 현재 채팅중인 chatroomid
  const chatroomname = useSelector(state => state.statereducer.chatroomname); // 현재 채팅중인 채팅방 지역 이름
  const chatroomlist = useSelector(state => state.userreducer.chatroomlist); // 유저가 들어가있는 채팅방 목록  
  const user = useSelector(state => state.userreducer); //유저정보
  const socketRef = useRef();

  const dispatch = useDispatch();


  function submitOnEnter(event) {
    if (event.which === 13 && !event.shiftKey) {
      event.target.form.dispatchEvent(new Event("submit", { cancelable: true }));
      event.preventDefault();
    }
  }

  function writeMsgData(messageObject) {
    //chat db에 저장
    let chat = database.ref('chat/').push(messageObject).key;

    //chatroom db에 저장          
    database.ref('/chatroom/' + chatroom + '/chatlist').push({ key: chat });

    database.ref('chatroom/' + chatroom + '/chatlist').once('value', Snap=>{
      database.ref('chatroom/' + chatroom + '/chatnum').set(Snap.numChildren());
    })

    //chatroom db의 lastchat 갱신
    database.ref('chatroom/' + chatroom + '/lastchat').set(chat);

    //user db에 저장하는 부분

    dispatch(actionType.sendChat(chatroom, chat));
    database.ref('user/' + user.key + '/chatlist').set(user.chatlist);
    //setMessagelist(oldMsgs => [...oldMsgs, messageObject]);
  }


  function getTime(time) {
    var dateObj = new Date(time);
    let h = '0' + dateObj.getHours();
    let m = '0' + dateObj.getMinutes();
    return h.slice(-2) + ':' + m.slice(-2);
  }

  function receivedMessage(messageObj) {
    setMessagelist(before => [messageObj, ...before]);
  }

  function sendMessage(e) {
    e.preventDefault();
    const messageObject = {
      chatroom_id: chatroom,
      type: "text",
      time: (new Date()).toString(),
      user_key: user.key,
      nickname: user.nickname,
      content: message,
    };

    setMessage("");
    socketRef.current.emit("send message", messageObject);
    writeMsgData(messageObject);
  }

  function leaveRoom() {
    const dataObject = {
      user_id: user.ID,
      chatroom_id: chatroom,
    };
    socketRef.current.emit("leave room", dataObject);
    dispatch(actionType.removeChatroom(chatroom));
    database.ref('user/' + user.key + '/chatroomlist/' + chatroom).remove();
  }

  function handleChange(e) {
    setMessage(e.target.value);
  }

  function sendMarker(e){
    dispatch(actionType.setMarkerX(null));
    dispatch(actionType.setMarkerY(null));
  }

  //

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:3001");  //나중에 서버에 Server.js를 올리게 되면 바꿔야함.
    let time = String(new Date());
    const dataObject = {
      user_id: user.ID,
      chatroom_id: chatroom,
    };
    if (chatroomlist !== undefined) {
      if (chatroom in chatroomlist) {//chat목록에 있는 방인 경우
        socketRef.current.emit("rejoin room", dataObject);
        let entertime = null;
        if (chatroomlist !== undefined && chatroomlist[chatroom] !== undefined) {
          entertime = new Date(chatroomlist[chatroom].time);
        }
        database.ref('chatroom/' + chatroom + '/chatlist').once('value', Snap => {
          const dbchatlist = Snap.val();
          if (dbchatlist === null) return;
          Object.keys(dbchatlist).forEach(key => {
            var chat = dbchatlist[key].key;
            database.ref('chat/' + chat).once('value', Snap => {
              chat = Snap.val();
              if (chat === null) return;
              if (new Date(chat.time) >= entertime) {
                if (chat.type === 'text') {
                  setMessagelist(before => [chat, ...before]);
                }
                else if(chat.type === 'coord'){
                  setMessagelist(before => [ chat, ...before]);
                }
              }
            })
          })
        })
      }
      else if (chatroom !== -1) {
        socketRef.current.emit("join room", dataObject);
        dispatch(actionType.insertChatroom(chatroom, time));
        database.ref('user/' + user.key + '/chatroomlist/' + chatroom).set({ time: time });
      }
    }
    else if (chatroom !== -1) {
      socketRef.current.emit("join room", dataObject);
      dispatch(actionType.insertChatroom(chatroom, time));
      database.ref('user/' + user.key + '/chatroomlist/' + chatroom).set({ time: time });
    }

    socketRef.current.on("message", (message) => {
      console.log('here');
      receivedMessage(message);
    })
  }, [dispatch, chatroom, user.ID, user.key]);

  const ClickExit = () => {
    confirmAlert({
      title: `채팅방 나가기`,
      message: `채팅방을 나가시겠습니까?`,
      buttons: [
        {
          label: 'YES',
          onClick : () =>{
            leaveRoom();
            dispatch(actionType.setSidebar('near'));   
            dispatch(actionType.setChatroom(-1)); 
          }
        },
        {
          label: 'NO'
        }
      ]
    })
  }

  const ClickBack = () => {
    dispatch(actionType.setSidebar('chatlist'));
    dispatch(actionType.setChatroom(-1));
  }

  const ClickSearch = () => {
    dispatch(actionType.setSidebar('search'));   
  }
  function setMarker(lat, lng){
    dispatch(actionType.setMarker(true));
    dispatch(actionType.setMarkerX(lat));
    dispatch(actionType.setMarkerY(lng));
  };
  return (
    <div className='SidebarContent'>
      <div className="Sidebarhead" >
        <div className = 'chatHead'>
        <ArrowBack style = {{'marginRight' : '20px'}} onClick={() => { ClickBack() }}/>
        {chatroomname}
        <Close style = {{'marginLeft' : '20px'}} onClick={() => { ClickExit() }}/>
        </div>
      </div>
      <div className="chatBody">
        {messagelist.map((message, index) => {
          if(message.type === "text"){
            if(message.user_key === user.key){
              return ( 
                <div className="MyRow" key={index}>
                  <div className="MyTime">{getTime(message.time)}</div>
                  <div className="MyMsg" >
                    {message.content}
                  </div>
                </div>
              )
            }
            return (
              <div className="PeerRow" key={index}>
                <div className="PeerInfo">
                  <div className="PeerName">{message.nickname}</div>
                </div>
                <div className="PeerMsgInfo">
                  <div className="PeerMsg">
                    {message.content}
                  </div>
                  <div className="PeerTime">{getTime(message.time)}</div>
                </div>
              </div>
            )
          }
          else if(message.type === "coord"){
            if(message.user_key=== user.key){
              return ( 
                <div className="MyRow" key={index}>
                  <div className="MyTime">{getTime(message.time)}</div>
                  <div className="Coord" onClick={setMarker(message.content.lat, message.content.lng)}>
                    <div className="desc">
                        <div className="title" dangerouslySetInnerHTML={{__html: message.content.title}}></div>
                        <div className="category">{message.content.category}</div>
                    </div>
                  </div>
                </div>
              )
            }
            return (
              <div className="PeerRow" key={index}>
                <div className="PeerInfo">
                  <div className="PeerName">{message.nickname}</div>
                </div>
                <div className="PeerMsgInfo">
                  <div className="Coord" onClick={setMarker(message.content.lat, message.content.lng)}>
                    <div className="desc">
                        <div className="title" dangerouslySetInnerHTML={{__html: message.content.title}}></div>
                        <div className="category">{message.content.category}</div>
                    </div>
                  </div>
                  <div className="PeerTime">{getTime(message.time)}</div>
                </div>
              </div>
            )
          }
        })}
      </div>
      <div className="chatUnder">
        <div className="tool">
          <div className="toolicon" id="searchtool" onClick={ClickSearch}><Search></Search></div>
        </div>
        <form className = 'chat_form' onSubmit={sendMessage}>
          <textarea className="inputtext" value={message} onChange={handleChange} placeholder="메시지 입력" onKeyPress={submitOnEnter}></textarea>
          <button className='sendbutton' onClick={sendMessage}>전송</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;