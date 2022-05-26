import React, { useState } from 'react';
// actions
import { postFile } from '../action/actions';

// this component takes care of file form input
const FileInput = ({ setStatus, toggleAlert }) => {
  const [fileReceived, setFileReceived] = useState(null); // save file input
  // submit handler
  const submitFile = async (e) => {
    e.preventDefault();
    if (fileReceived) {
      // create form data
      const formData = new FormData();
      formData.append('file', fileReceived);
      // post file to server
      const status = await postFile(formData);
      // trigger alert based on response setStatus
      if (status && status.msg) {
        toggleAlert(new Object({ stt: 'success', message: 'File Loaded' }));
        setStatus(() => true);
      } else {
        toggleAlert(new Object({ stt: 'danger', message: 'Format invalid' }));
        setStatus(() => false);
      }
    } else {
      toggleAlert(new Object({ stt: 'danger', message: 'Attach your file' }));
    }
  };
  return (
    <div id="container__uploader" role="form">
      <h2 id="uploader__header">Poetry.lock Parser</h2>
      <form aria-labelledby="uploader__header" id="uploaded-form">
        <input
          type="file"
          className="input"
          id="uploaded-file"
          name="uploaded-file"
          onChange={(e) => setFileReceived(e.target.files[0])}
        />
        <button className="btn small" id="file-submit" onClick={submitFile}>
          submit
        </button>
      </form>
    </div>
  );
};

export default FileInput;
