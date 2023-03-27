import './App.css';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import History from './pages/History/History';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path='history' element={<History/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
