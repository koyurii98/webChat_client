import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const ChatList = (props) => {
  const history = useHistory();
  const location = useLocation();
  const { user, chatlist } = location.state;

  const [ list , setList ] = useState(chatlist&& chatlist.filter(data=> data.to !== user.user_id));

  return(
    <div>
      {list && list.map((data,i)=>{
        return  <button key={i} onClick={()=>history.push({pathname:`/chat`, state:{ chatlist:list , data, user, setList } })}>{`${data.to}와 채팅하기`}</button>
      })}
    </div>
  );
}

export default ChatList;