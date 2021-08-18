import React, { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

const Main = () => {
  const history = useHistory();

  return(
    <div>
      <button onClick={()=>history.push('/chat?id=1&user_id=yul&name=yul&to=ri')}>채팅방1입장</button>
      <button onClick={()=>history.push('/chat?id=2&user_id=ri&name=ri&to=yul')}>채팅방2입장</button>
      <button onClick={()=>history.push('/chat?id=3&user_id=jun&name=jun&to=yul')}>채팅방3입장</button>
    </div>
  );
}

export default Main;