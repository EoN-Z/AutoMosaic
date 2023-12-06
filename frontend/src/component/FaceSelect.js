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
          <img src={Spinner} width="10%"/>
        </>
        : 
        <>
          <h1>모자이크 대상에서 제외할 얼굴을 선택해주세요</h1>
          <div className="facewrap">
            <table className="facetable">
              <thead>
                <tr>
                  <th colSpan="5"></th>
                </tr>
              </thead>
              <tbody>
                {Array(Math.ceil(facenum/5)).fill().map((_, row) => (
                  <tr key={row}>
                    {Array(5).fill().map((_, col) => {
                      const idx = row*5 + col;
                      if(idx < facenum) {
                        return (
                          <td key={idx}>
                            <input type="checkbox" id={"check"+idx} onChange={() => toggleSelect(idx)} />
                            <label className="facecheck" htmlFor={"check"+idx}>
                              <img src={url+"/media/faces/"+idx+".png"} />
                            </label>
                          </td>
                        );
                      }
                    })}
                  </tr>
                ))}
                {facenum == 0 ? 
                    <tr>
                      <td></td>
                      <td width="150px">
                        <label>
                          식별된 얼굴이 없습니다
                        </label>
                        <br/>
                        <br/>
                      </td>
                      <td></td>
                    </tr>
                  :
                    <></>
                }
              </tbody>
            </table>
          </div>
          <br/>
          <br/>
          <button className="button" onClick={() => faceUpload()}><span>선택 완료</span></button>
        </>
      }
    </>
  );
}