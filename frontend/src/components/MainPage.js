import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// sub components
import NavBar from './NavBar';
import FileInput from './FileInput';
import Alert from './Alert';
// actions
import { getPackage } from '../action/actions';

// this component renders the main page
const MainPage = () => {
  const [instruction, toggleInstruction] = useState(false); // toggle instruction
  const [alert, setAlert] = useState({}); // toggle alert box
  const [fileStatus, setFileStatus] = useState(false); // file reading status
  const [pkgs, setPkgs] = useState([]); // parsed packages list

  // toggler alert and clean it after 3s
  const toggleAlert = (obj) => {
    setAlert(() => obj);
    setTimeout(() => {
      setAlert(() => new Object({ stt: 'off', message: '' }));
    }, 3000);
  };
  async function fetchData() {
    try {
      const res = await getPackage(); // EMPTY means all
      setPkgs(res.pkgs); // update list of packages
      toggleAlert(new Object({ stt: 'success', message: 'OK' }));
    } catch (err) {
      toggleAlert(new Object({ stt: 'danger', message: err.msg }));
    }
  }

  useEffect(() => {
    // fetchdata the first time
    fetchData();
  }, []);
  useEffect(() => {
    // file uploaded successfully?
    // update the file loading status
    if (fileStatus) {
      fetchData();
    }
  }, [fileStatus, setFileStatus]);
  return (
    <div className="App">
      <NavBar onclick={() => toggleInstruction(() => !instruction)} />
      <div className="container">
        <Alert alert={alert} />
        <div className={`instruction ${instruction ? 'on' : 'off'}`}>
          <h4>Instructions</h4>
          <ul>
            <li>
              Attach
              <a href="https://github.com/python-poetry/poetry/blob/master/poetry.lock">
                {' '}
                poetry.lock
              </a>
            </li>
            <li>
              When successfully load the data, directory of packages are shown
              below. you can check for dependecies, reverse dependecies or
              extras packages
            </li>
            <li>
              Credits of images/Icons are taken from
              <a href="https://icons8.com/icons/"> this link</a>
            </li>
          </ul>

          <p>
            © yen tran <a href="https://github.com/notama958/">Github's repo</a>
          </p>
        </div>
        {/* file input box */}
        <FileInput setStatus={setFileStatus} toggleAlert={toggleAlert} />
        <h3>Package list - {pkgs && pkgs.length} (pkgs)</h3>
        {/* packages directory */}
        <div className="pkgs_container">
          {pkgs &&
            pkgs.map((p, id) => (
              <Link to={`/package/${p}`} key={id}>
                {p}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

MainPage.propTypes = {};

export default MainPage;
