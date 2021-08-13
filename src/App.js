import {  BrowserRouter, Route} from 'react-router-dom';
import Chat from './Chat';
import Main from './Main';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route exact path="/" component={Main}/>
        <Route path="/chat" component={Chat}/>
      </BrowserRouter>
    </div>
  );
}

export default App;
