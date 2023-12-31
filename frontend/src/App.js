import './App.css';
import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import VideoUpload from './component/VideoUpload';
import TimeSelect from './component/TimeSelect';
import FaceSelect from './component/FaceSelect';
import VideoDownload from './component/VideoDownload';

function Refresh() {
  React.useEffect(() => {
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
  });

  return <App />;
}

function App() {
  const [facenum, setFacenum] = React.useState(0);

  return (
    <Router>
      <div className="container">
        <div className="title">
          AutoMosaic
        </div>
        <div className="subtitle">
          초상권 보호의 새로운 솔루션
        </div>
        <div className="line"></div>
        <div className="content">
          <Routes>
            <Route path="/" element={<VideoUpload />}/>
            <Route path="/time" element={<TimeSelect facenum={facenum} setFacenum={setFacenum} />}/>
            <Route path="/face" element={<FaceSelect facenum={facenum} />}/>
            <Route path="/download" element={<VideoDownload />}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

//export default App;
export default Refresh;