import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/"/>    
            <Route path="/login"/>    
            <Route path="/unauthorized"/>    
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
