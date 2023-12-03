import './Component.css';
import Spinner from '../assets/Spinner.gif';
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function FaceSelect({facenum}) {
  const url = 'http://localhost:8000';
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);
  const imgselect = Array(facenum).fill(false);

  function toggleSelect(idx) {
    imgselect[idx] = !imgselect[idx];
  }

  function faceUpload() {
    console.log("<얼굴 선택 성공> ", imgselect);
    setLoading(true);

    axios.post(url+'/api/face/', {faces: imgselect})
      .then((response) => {
        console.log("<모자이크 성공>");
        navigate("/download");
      })
      .catch((error) => {
        console.error("<모자이크 실패>", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return(
    <>
      {loading ?
        <>
          <h1>모자이크 처리 중...</h1>
          <img src={Spinner} alt="작업 중..." width="10%"/>
        </>
        : 
        <>
          <h1>모자이크 대상에서 제외할 얼굴을 선택해주세요.</h1>
          <div className="facewrap">
            <table className="facetable">
              <thead>
                <tr>
                  <th colSpan="2">얼굴 선택</th>
                </tr>
              </thead>
              <tbody>
                {imgselect.map((val, idx) => (
                  <tr key={idx}>
                    <td><img src={url+"/media/faces/"+idx+".png"} style={{'maxHeight': '100px', 'width': 'auto'}} /></td>
                    <td><input type="checkbox" style={{zoom:2.0}} onChange={() => toggleSelect(idx)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <br/>
            <button className="button" onClick={() => faceUpload()}><span>선택 완료</span></button>
          </div>
        </>
      }
    </>
  );
}