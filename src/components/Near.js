import React, { useState, useEffect, useRef} from 'react'; // import 로 useState 를 불러온다!
import {useSelector, useDispatch} from 'react-redux';
import io from 'socket.io-client';
import ChatroomBox from './ChatroomBox';
import './Near.css';
import * as actionType from '../modules/action';
//지역기반 접속 가능한 방에 대한 리스트를 출력해서 보여줌
/*추가해야 할 기능
 *클릭시 chat에 해당방에 대한 Raw를 리스트에 추가해야한다.
 * 
 */
const Near = () =>{
  const [chatList, setChatList] = useState([]);
  const chat = useSelector(state => state.chatreducer, []);
  const dispatch = useDispatch();
  useEffect(()=>{//정보를 받아와 리스트를 작성한다. 지금은 하드코딩이지만 후에 위치기반으로 수정
    setChatList(oldList => [...oldList, 0]);//신촌
    setChatList(oldList => [...oldList, 1]);//대흥
    setChatList(oldList => [...oldList]);
  }, []);

  function insertChat(chatRoom){
    var exist = false;
    for(var i = 0; i < chat.chatlist.length; i++){
      const temp = chat.chatlist[i].id;
      if(temp === chatRoom){
        exist = true;
        break;
      }
    }
    if(exist===false){
      dispatch(actionType.newchat());
      dispatch(actionType.insertchat(chatRoom));
    }
    else{dispatch(actionType.oldchat());}
  }

  return (
    <div className="Near">
      <div id="nearhead" className="head">Near</div>
      {chatList.map((chatRoom,index) => {
        return ( 
          <ChatroomBox index={index} chatRoom={chatRoom}></ChatroomBox>
        )
      })}
    </div>
  );
}

export default Near;
