import React, { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
let socket ;
const Chat = () => {
  const [ name, setName ] = useState('');
  const [ message, setMessage ] = useState('');
  const [ msgs , setMsgs] = useState([]);


  useEffect(()=>{
    socket = io('http://localhost:8000');
    socket.on('connect', ()=>{
      console.log('서버와 연결됨');
      if(!name){
        let n = prompt('이름입력','');
        socket.emit('newUser', n);
        setName(n);
      }
    });
  },[]);

  useEffect(()=>{
    socket.on('update', (data)=>{
      console.log(`${data.name}:${data.message}`);
      setMsgs(msgs.concat({name:data.name, msg: data.message}));
    });
  },[])

  const send = useCallback(() => {
    socket.emit('message', { type:'message', message: message});
    setMsgs(msgs.concat({ name: name, msg: message }));
  },[msgs, message]);

  console.log(msgs);

  return(
    <div>
      {
        msgs.map((msg,i)=>{
          return (
            <div key={i}>
              <span>{msg.name} - </span>
              <span>{msg.msg}</span>
            </div>
            )
        })
      }
      <input type="text" onChange={(e)=>setMessage(e.target.value)}/>
      <button onClick={()=>send()}>전송</button>
    </div>
  );
}

export default Chat;