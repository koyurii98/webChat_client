import React, { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
let socket ;
const Chat = (props) => {
  const history = useHistory();
  const [ message, setMessage ] = useState('');
  const [ msgs , setMsgs] = useState([]);
  const [ onLine, setOnLine ] = useState(false);
  const queryString = props.location.search;
  const params = new URLSearchParams(queryString);
  const id = params.get("id");
  const user_id = params.get("user_id");
  const name = params.get("name");
  const to = params.get("to");

  useEffect(()=>{
    if( !id && !user_id && !name && !to){
      history.replace('/');
    }
  },[id, user_id, name, to])

  useEffect(()=>{
    socket = io(`http://localhost:8000?chatID=${user_id}&name=${user_id}`);
    socket.on(`connect`, ()=>{
      console.log('서버와 연결됨');
      socket.emit('newUser', name);
    });
  },[]);

  useEffect(()=>{
    if(!onLine){
      socket.on('update', ({name, message, time, type})=>{
        if(type==='connect'){
          setOnLine(true);
          const msg = {
            content:message,
            senderChatID:name,
            receiverChatID:user_id,
            time:moment(time).format('hh:mm'),
          }
          setMsgs(msgs.concat(msg));
        }else{
          setOnLine(false)
        }
      });
    }

    socket.on('receive_message', ({message})=>{
      const msg = {
        content:message.content,
        senderChatID:message.senderChatID,
        receiverChatID:message.receiverChatID,
        time:message.time
      }
      if(message.senderChatID == to){
        setMsgs(msgs.concat(msg));
      }
    });
    
  },[msgs,to, user_id])

  const send = useCallback(() => {
    socket.emit('send_message', { type:'message', receiverChatID: to, senderChatID: user_id, content: message, time:moment().format('hh:mm')});
    const msg = {
      content:message,
      senderChatID:user_id,
      receiverChatID:to,
      time:moment().format('hh:mm'),
    }
    setMsgs(msgs.concat(msg));
  },[message, msgs]);

  

  return(
    <div >
      <span>{user_id}</span>
      <div style={{ display:'flex', flexDirection:'row', alignItems:'center'}}>
        <span>{to}</span><div style={{ borderRadius:"50%", width:"10px", height:"10px", backgroundColor:onLine?"green":"gray", marginLeft:"10px"}}></div>
      </div>
      <p>{to}님의 채팅방에 입장하셨습니다.</p>
      <div style={{display:'flex', flexDirection:'column', width:'400px'}}>
        {
          msgs.map((msg,i)=>{
            return (
              <div key={i} style={{ color: msg.senderChatID == user_id ? 'red': 'black'}}>
                <span>{msg.senderChatID} - </span>
                <span>{msg.content}</span>
                <span>{msg.time}</span>
              </div>
              )
          })
        }
      </div>
      <input type="text" onChange={(e)=>setMessage(e.target.value)}/>
      <button onClick={()=>send()} onkeydown={()=>{}}>전송</button>
      <span onClick={()=>setMsgs([])}>채팅내용지우기</span>
    </div>
  );
}

export default Chat;