import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPackage } from '../action/actions';
import NavBar from './NavBar';
import Package from './Package';

// this component render the package page
const PackagePage = () => {
  const { pkg_name } = useParams(); // current parameter from url
  const [pkg, setPackage] = useState({}); // save current package fetched from server
  const [path, setPath] = useState(pkg_name); //  current path

  useEffect(() => {
    setPath(pkg_name); // update package path
  }, [pkg_name]);

  useEffect(() => {
    // fetch package information based on changing path (package name)
    async function fetchData() {
      const res = await getPackage(path);
      setPackage(res.pkgs);
    }
    fetchData();
  }, [path, setPath]);
  return (
    <div className="App">
      <NavBar />
      <Package pkg={pkg} />
    </div>
  );
};

export default PackagePage;
