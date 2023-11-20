import './Component.css';
import React from 'react';
import axios from 'axios';

export default function VideoDownload() {
  const url = 'http://localhost:8000';

  function fileDownload() {
    axios.get(url+"/media/output.mp4", {responseType: 'blob'})
    .then((response) => {
      console.log("<영상 다운로드 성공>")

      const href = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', "output.mp4");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(href);
    })
    .catch((error) => {
      console.error("<영상 다운로드 실패>", error)
    });
  }

  return(
    <>
      <h1>모자이크 처리가 완료되었습니다!</h1>
      <video width='480' height='320' controls="controls">
        <source src={url+"/media/output.mp4"} type="video/mp4" />
      </video>
      <br/><br/>
      <button className="button" onClick={()=>fileDownload()}><span>다운로드</span></button>
    </>
  );
}