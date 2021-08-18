import React, { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
import moment from 'moment';
import { useHistory, useLocation } from 'react-router-dom';

let socket ;
const Chat = (props) => {
  const history = useHistory();
  const location = useLocation();
  const {chatList } = location.state;
  const [ message, setMessage ] = useState('');
  const [ msgs , setMsgs] = useState([]);
  const [ onLine, setOnLine ] = useState(true);
  const queryString = props.location.search;
  const params = new URLSearchParams(queryString);
  const id = params.get("id");
  const user_id = params.get("user_id");
  const name = params.get("name");
  const to = params.get("to");
  const [ test, setTest ] = useState(chatList);

  useEffect(()=>{
    if( !params){
      history.replace('/');
    }
  },[id, user_id, name, to, history])

  useEffect(()=>{
    socket = io(`http://localhost:8000?chatID=${user_id}`);
    socket.on(`connect`, ()=>{
      socket.emit('newUser', name);
    });
  }, [user_id, name]);

  useEffect(()=>{
    // if(!onLine){
      socket.on('update', ({name, message, time, type})=>{
        console.log({name, message, time, type});
        if(type){
          const msg = {
            content:message,
            senderChatID:name,
            receiverChatID:user_id,
            time:moment(time).format('hh:mm'),
          }
          setMsgs(msgs.concat(msg));
          if(type==='connect' && name !== user_id){
            setOnLine(true)
          }else if(type==='disconnect'  && name !== user_id){
            setOnLine(false);
          }
        }
      });
    // }
    socket.on('receive_message', ({content, senderChatID, receiverChatID, time})=>{
      if(senderChatID === to){
        const msg = { content, senderChatID, receiverChatID, time };
        setMsgs(msgs.concat(msg));
      }else{
        console.log({content, senderChatID, receiverChatID, time});
        // chatList.concat({id:chatList.length+1, name: receiverChatID, user_id: receiverChatID, to:senderChatID});
      }
    });
  },[msgs,to, user_id, onLine, chatList]);

  const send = useCallback(() => {
    socket.emit('send_message', { type:'message', receiverChatID: to, senderChatID: user_id, content: message, time:moment().format('hh:mm')});
    const msg = {
      content:message,
      senderChatID:user_id,
      receiverChatID:to,
      time:moment().format('hh:mm'),
    }
    setMsgs(msgs.concat(msg));
    setMessage('');
  },[message, msgs, to, user_id]);

  const exit = useCallback(()=>{
    socket.emit('exitRoom',name);
    setMessage('');
    setOnLine(false);
    const newList = chatList.filter(data=> data.user_id!==user_id);
    setTest(newList);
    
  },[name, chatList])
  

  return(
    <div>
      <span>{user_id}</span>
      <div style={{ display:'flex', flexDirection:'row', alignItems:'center'}}>
        <span>{to}</span><div style={{ borderRadius:"50%", width:"10px", height:"10px", backgroundColor:onLine?"green":"gray", marginLeft:"10px"}}></div>
      </div>
      <p>{to}님의 채팅방에 입장하셨습니다.</p>
      <div style={{display:'flex', flexDirection:'column', width:'400px'}}>
        {
          msgs.map((msg,i)=>{
            return (
              <div key={i} style={{ color: msg.senderChatID === user_id ? 'red': 'black'}}>
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
      <button onClick={()=>setMsgs([])}>채팅내용지우기</button>
      <button onClick={()=>exit()}>나가기</button>
      <div>
        <span>채팅방</span>
        {
          test.map((data)=>{
            return  <div>{data.user_id}</div>
          })
        }
      </div>
    </div>
  );
}

export default Chat;