import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ChatroomBox from './ChatroomBox';
import './Chatlist.css';

const Chat = () => {
  const [chatList, setChatList] = useState([]);
  const chatroomlist = useSelector(state => state.userreducer.chatroomlist);
  let count = 0;
  if (chatroomlist !== undefined)
    count = Object.keys(chatroomlist).length;
  const chatHead = `현재 ${count}개의 채팅방에 접속중입니다.`

  useEffect(() => {
    if (chatroomlist !== undefined) {
      let Arr = Object.keys(chatroomlist);
      Arr.forEach(key => {
        setChatList(oldList => [...oldList, key]);
      });
    }
  }, [chatroomlist]);

  return (
    <div className="Chatlist">
      <div id="chatlisthead" className="head">{chatHead}</div>
      <div id="chatlistbody" className="body">
        {chatList.map((chatroom, index) => {
          return (
            <ChatroomBox key={index} chatroom={chatroom} index={index}></ChatroomBox>
          )
        })}
      </div>
    </div>
  );
}

export default Chat;