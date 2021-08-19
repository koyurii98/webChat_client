import React, { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
import moment from 'moment';
import { useLocation } from 'react-router-dom';

let socket ;
const Chat = (props) => {
  const location = useLocation();
  const { chatlist, data, user, setList } = location.state;
  const [ message, setMessage ] = useState('');
  const [ msgs , setMsgs] = useState([]);
  const [ onLine, setOnLine ] = useState(false);

  useEffect(()=>{
    socket = io(`http://localhost:8000?chatID=${user.user_id}&to=${data.to}`);
    socket.on(`connect`, ()=>{
      socket.emit('newUser', user.name);
    });
  }, [data, user]);

  useEffect(()=>{
    // if(!onLine){
    socket.on('update', ({name, message, time, type})=>{
        setOnLine(true);
        const msg = {
          content:message,
          senderChatID:name,
          receiverChatID:user.user_id,
          time:moment(time).format('hh:mm'),
        }
        setMsgs(msgs.concat(msg));
        if(type==='disconnect'){
          setOnLine(false);
        }
    });
    // }
    socket.on('receive_message', ({content, senderChatID, receiverChatID, time})=>{
      if(senderChatID === data.to){
        const msg = { content, senderChatID, receiverChatID, time };
        setMsgs(msgs.concat(msg));
      }else{
        console.log({content, senderChatID, receiverChatID, time});
        // chatList.concat({id:chatList.length+1, name: receiverChatID, user_id: receiverChatID, to:senderChatID});
      }
    });
  },[msgs,data, onLine, user]);

  const send = useCallback(() => {
    socket.emit('send_message', { type:'message', receiverChatID: data.to, senderChatID: user.user_id, content: message, time:moment().format('hh:mm')});
    const msg = {
      content:message,
      senderChatID:user.user_id,
      receiverChatID:data.to,
      time:moment().format('hh:mm'),
    }
    setMsgs(msgs.concat(msg));
    setMessage('');
  },[message, msgs, data, user]);

  const exit = useCallback(()=>{
    socket.emit('exitRoom',user.name);
    setMessage('');
    setOnLine(false);
    const newList = chatlist.filter(d=> d.user_id!==user.user_id);
    setList(newList.filter(d=> d.to === user.user_id));
  },[user, chatlist, setList])
  

  return(
    <div>
      <span>{user.user_id}</span>
      <div style={{ display:'flex', flexDirection:'row', alignItems:'center'}}>
        <span>{data.to}</span><div style={{ borderRadius:"50%", width:"10px", height:"10px", backgroundColor:onLine?"green":"gray", marginLeft:"10px"}}></div>
      </div>
      <p>{data.to}님의 채팅방에 입장하셨습니다.</p>
      <div style={{display:'flex', flexDirection:'column', width:'400px'}}>
        {
          msgs.map((msg,i)=>{
            return (
              <div key={i} style={{ color: msg.senderChatID === user.user_id ? 'red': 'black'}}>
                <span>{msg.senderChatID} - </span>
                <span>{msg.content}</span>
                <span>{msg.time}</span>
              </div>
              )
          })
        }
      </div>
      <div>
        <input style={{ backgroundColor:onLine?null:'gray' }} disabled={onLine?false:true} type="text" placeholder={'내용을 입력해주세요'} value={message} onChange={(e)=>setMessage(e.target.value)} onKeyPress={(e)=>{if(e.code==='Enter'){send()}}}/>
        <button onClick={()=>send()}>전송</button>
      </div>
      <button onClick={()=>exit()}>나가기</button>
    </div>
  );
}

export default Chat;