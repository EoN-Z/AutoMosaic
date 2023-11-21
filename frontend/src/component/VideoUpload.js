import './Component.css'
import Spinner from '../assets/Spinner.gif';
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function VideoUpload() {
  const [file, setFile] = React.useState(null);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  function fileSelect(e) {
    setFile(e.target.files[0]);
  }

  function fileUpload(e) {
    const url = 'http://localhost:8000';
    if(!file)
      return;

    setLoading(true);
    
    let formData = new FormData();
    formData.append('file', file);

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
      onUploadProgress: function(progressEvent) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      }
    };

    axios.post(url+'/api/upload/', formData, config)
    .then((response) => {
      console.log("<영상 업로드 성공> ", file.name);
      navigate("/time");
    })
    .catch((error) => {
      console.error("<영상 업로드 실패>", error);
    })
    .finally(() => {
      setLoading(false);
    });
  }

  return(
    <>
      {loading ?
        <>
          <h1>영상 업로드 중...</h1>
          <img src={Spinner} alt="작업 중..." width="10%"/>
          <br/>
          <progress className="progress" value={uploadProgress} max="100"></progress>
        </>
        : 
        <>
          <h1>모자이크할 영상을 선택해주세요</h1>
          <input className="select" type="file" name="file" accept="video/mp4" onChange={fileSelect}></input>
          <br/>
          <button className="button" onClick={() => fileUpload()}><span>업로드</span></button>
        </>
      }
    </>
  );
}