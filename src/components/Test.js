import React, { useState, useEffect, useRef} from 'react'; // import 로 useState 를 불러온다!
import {useSelector, useDispatch} from 'react-redux';
import io from 'socket.io-client';
import { database } from '../firebase';
import "./Test.css";
import * as actionType from '../modules/action';
//지금은 채팅방이 1개인 임시지만, 후에 socket.join을 이용해서 여러개의 방을 만들 생각임 
const Test = (props) =>{
  const [yourID, setYourID] = useState();//나의 아이디
  const [socketID, setSocketID] = useState();
  const [messages, setMessages] = useState([]);//모든 메시지(server로부터 받은 모든 메시지)
  const [message, setMessage] = useState("");//내가 입력한 메시지
  
  const socketRef = useRef();
  const dispatch = useDispatch();
  const chat = useSelector(state => state.chatreducer, []);
  const profilesaved = useSelector(state => state.profilereducer, {});
  const login = useSelector(state => state.loginreducer, {});
  const date = new Date();
//
  function writeMsgData(name, msg, chatroom_id) {
    /*var chatID;
    database.ref('chat').once('value', (snapshot) =>{
      chatID = snapshot.numChildren();
      database.ref('chat/' + chatroomname + '/' + chatID).set({
        chat_id: chatID,
        chatroom_id: chatroom_id,
        message: msg,
        time: date,
        user_id: profilesaved.profile.id,
      });
    });
    database.ref('chatroom/' + chatroom_id + '/chatlist').once('value', (snapshot) =>{
      var id = snapshot.numChildren();
      database.ref('chatroom/' + chatroom_id + '/chatlist/' + id).set({
        chat_id: chatID,
      });
      database.ref('chatroom/' + chatroom_id + '/chatlastlist/' + id).update({
        chat_id: chatID,
      });
    });
    */
  }
  function readMsgDate(chatroomname){
    /*수정해야함
    database.ref('chatdata/').child(chatroomname).once('value', (snapshot) =>{
      const msgdata = snapshot.val();
      for(var i = 0; i<snapshot.numChildren(); i++){
        console.log(msgdata[i]);
        setMessages(oldMsgs => [...oldMsgs, msgdata[i]]);
      }
    });
    */
  }
//
  useEffect(() => {
    socketRef.current = io.connect("http://localhost:3001");  //나중에 서버에 Server.js를 올리게 되면 바꿔야함.
    console.log(profilesaved.profile.id);

    const dataObject = {
      user_id: profilesaved.profile.id,
      roomId: props.chatRoomId,
    };

    if(chat.newchat === true){
      console.log("new");
      socketRef.current.emit("join room", dataObject);
    }
    else{//chat목록에 있는 방인 경우
      socketRef.current.emit("rejoin room", dataObject);
      readMsgDate(props.chatRoomId);
    }

    socketRef.current.on("your id", id =>{
      setYourID(profilesaved.profile.id);
      setSocketID(id);
    })
    socketRef.current.on("message", (message) =>{
      console.log(message.user_id);
      receivedMessage(message);
    })
  }, []);

  function receivedMessage(message){
    setMessages(oldMsgs => [...oldMsgs, message]);
  }

  function sendMessage(e){
    e.preventDefault();
    const messageObject = {
      message: message,
      user_id: profilesaved.profile.id,
      user_name: profilesaved.profile.name,
      roomId: props.chatRoomId,
      time: date.getHours()+':'+date.getMinutes(),
    };
    writeMsgData(profilesaved.profile.id, message, props.chatRoomId);
    
    setMessage("");
    socketRef.current.emit("send message", messageObject);
  }

  function leaveRoom(chatname){
    const dataObject = {
      user_id: profilesaved.profile.id,
      roomId: props.chatRoomId,
    };
    socketRef.current.emit("leave room", dataObject);
    dispatch(actionType.removechatroom(chatname));
  } 

  function handleChange(e){
    setMessage(e.target.value);
  }
  return (
    <div className="chat">
      <div className="chatHead">
        <button id="backBtn" onClick={()=>dispatch(actionType.sidebarchatObject)}>back</button>
        {props.chatRoomId}
        <button id="exitChatroomBtn" onClick={() =>{leaveRoom(props.chatRoomId); dispatch(actionType.sidebarnearObject);}}>exit</button>
      </div>
      <div className="chatBody">
        {messages.map((message, index) => {
            if(message.user_id === profilesaved.profile.id){
              return ( 
                <div className="MyRow" key={index}>
                  <div className="MyTime">{message.time}</div>
                  <div className="MyMsg">
                    {message.message}
                  </div>
                </div>
              )
            }
            return (
              <div className="PeerRow" key={index}>
                <div className="PeerInfo">
                  <div className="PeerName">{message.user_name}</div>
                </div>
                <div className="PeerMsgInfo">
                  <div className="PeerMsg">
                    {message.message}
                  </div>
                  <div className="PeerTime">{message.time}</div>
                </div>
              </div>
            )
          }
        )}
      </div>
      <div className="chatUnder">
        <form onSubmit={sendMessage}>
          <textarea value={message} onChange={handleChange} placeholder="메시지 입력"></textarea>
          <button>전송</button>
        </form>
      </div>
    </div>
  );
};

export default Test;