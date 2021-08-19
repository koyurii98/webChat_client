import {  BrowserRouter, Route} from 'react-router-dom';
import Chat from './pages/Chat';
import ChatList from './pages/ChatList';
import Main from './pages/Main';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route exact path="/" component={Main}/>
        <Route path="/chat" component={Chat}/>
        <Route path="/chatlist" component={ChatList}/>
      </BrowserRouter>
    </div>
  );
}

export default App;
