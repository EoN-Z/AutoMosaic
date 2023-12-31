import './Component.css';
import Spinner from '../assets/Spinner.gif';
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function TimeSelect({facenum, setFacenum}) {
  const url = 'http://localhost:8000';
  const navigate = useNavigate();

  const inputvideo = React.useRef(null);
  const [times, setTimes] = React.useState(new Set());
  const [loading, setLoading] = React.useState(false);

  function timeAdd() {
    const updatedTimes = new Set(times);
    updatedTimes.add(inputvideo.current.currentTime);
    setTimes(updatedTimes);
  }

  function timeDelete(time) {
    const updatedTimes = new Set(times);
    updatedTimes.delete(time);
    setTimes(updatedTimes);
  }

  function timeUpload() {
    console.log("<시간 선택 성공> ", times);
    setLoading(true);

    axios.post(url+'/api/time/', { times: Array.from(times) })
    .then((response) => {
      console.log("<얼굴 식별 성공>", response.data["facenum"]);
      setFacenum(response.data["facenum"]);
      navigate("/face");
    })
    .catch((error) => {
      console.error("<얼굴 식별 실패>", error);
    })
    .finally(() => {
      setLoading(false);
    });
  }

  return(
    <>
      {loading ?
        <>
          <h1>얼굴 식별 중...</h1>
          <img src={Spinner} width="10%"/>
        </>
        : 
        <>
          <h1>모자이크 대상에서 제외할 얼굴이 있는 장면의 시간을 선택해주세요</h1>
          <video ref={inputvideo} width="480" height="320" controls onLoadedMetadata={() => {inputvideo.current.currentTime = 0}}>
            <source src={url+"/media/input.mp4"} type="video/mp4" />
          </video>
          <br/><br/>
          <div className="timewrap">
            <div className="timebox timelist">
              <table className="timetable">
                <thead>
                  <tr>
                    <th colSpan="3">선택된 시간</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(times).map((time, idx) => (
                    <tr key={idx}>
                      <td width="15px">{idx+1}</td>
                      <td>{(time/60).toFixed().padStart(2,'0')}:{(time%60).toFixed(2).padStart(5,'0')}</td>
                      <td width="25px"><button className="delbutton" onClick={() => timeDelete(time)}><span className="icon-cross"></span></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="timebox">
              <button className="button timebtn" onClick={() => timeAdd()}><span>시간 추가</span></button>
              <br/><br/>
              <button className="button timebtn" onClick={() => timeUpload()}><span>선택 완료</span></button>
            </div>
          </div>
        </>
      }
    </>
  );
}