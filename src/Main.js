import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

const chatList = [
  {id:1, user_id:'yul', name:'yul', to:'ri'},
  {id:2, user_id:'ri', name:'ri', to:'yul'},
  {id:3, user_id:'jun', name:'jun', to:'yul'},
  {id:4, user_id:'jun', name:'jun', to:'ri'},
]

const Main = (props) => {
  const history = useHistory();
  const queryString = props.location.search;

  return(
    <div>
      {chatList.map((data,i)=>{
        return  <button key={i} onClick={()=>history.push({pathname:`/chat?id=${data.id}&user_id=${data.user_id}&name=${data.name}&to=${data.to}`, state:{ chatList } })}>{`${data.name} ->${data.to}`}</button>
      })}
    </div>
  );
}

export default Main;