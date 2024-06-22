import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import HomeView from './views/HomeView';
import AboutView from './views/AboutView';
import Earth from './components/test/Earth'


function App() {
  return (
  <BrowserRouter>
    <Earth >
      <Routes>
        <Route path='/' element={<HomeView />} />
        <Route path='/about' element={<AboutView />} />
      </Routes>
    </Earth>
  </BrowserRouter>
  );
}

export default App;
