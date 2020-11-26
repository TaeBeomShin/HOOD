import React, { useState, useEffect} from 'react'; // import 로 useState 를 불러온다!
import { useSelector } from 'react-redux';
import ChatroomBox from './ChatroomBox';
import './Near.css';

const Near = () => {  
  const [chatList, setChatList] = useState([]);
  const nearlist = useSelector(state => state.datareducer.nearlist, []);
  let count = 0;
  if (nearlist !== undefined)
    count = Object.keys(nearlist).length;
  const nearHead = `주위에 ${count}개의 채팅방이 있습니다.`

  useEffect(() => {
    if (nearlist !== undefined) {
      nearlist.forEach(near => {
        setChatList(oldList => [...oldList, near.chatroom])
      })
    }
  }, [nearlist]);
  return (
    <div className="Near">
      <div id="nearhead" className="head">{nearHead}</div>
      {chatList.map((chatroom, index) => {
        return (
          <ChatroomBox key={index} chatroom={chatroom} index={index} ></ChatroomBox>
        )
      })}
    </div>
  );
}

export default Near;
