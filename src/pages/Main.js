import React from 'react';
import { useHistory } from 'react-router-dom';
import {users,chatlist}  from '../util/dummy';

const Main = (props) => {
  const history = useHistory();

  return(
    <div>
      {users.map((data,i)=>{
        return <button key={i} onClick={()=>history.push({pathname:`/chatlist?id=${data.id}`, state:{ user: data, chatlist }})}>{`계정 : ${data.name}`}</button>
      })}
    </div>
  );
}

export default Main;