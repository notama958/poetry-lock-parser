import React from 'react';
import { Link } from 'react-router-dom';

// this component renders one package information
const Package = ({ pkg }) => {
  const { name, description, re_dep, dependencies, exts } = pkg; // extract props from passed object
  return (
    <div className="package">
      {/*current path */}
      <p className="path">
        <Link to="/">pkg</Link>/<Link to={`/package/${name}`}>{name}</Link>
      </p>
      {/* name of package */}
      <h2 role="heading">{name}</h2>
      {/* description of package */}
      <div className="package__info">
        <p>{description}</p>
      </div>
      {/* dependencies of package */}
      <div className="package__dep">
        <h3>dependencies</h3>
        {dependencies
          ? dependencies.sort().map((e, id) => (
              <li key={id}>
                <Link to={`/package/${e}`}>{e}</Link>
              </li>
            ))
          : '<N/A>'}
      </div>
      {/* reverse dependencies of package */}
      <div className="package__redep">
        <h3>reverse dependecies</h3>
        {re_dep
          ? re_dep.sort().map((e, id) => (
              <li key={id}>
                <Link to={`/package/${e}`}>{e}</Link>
              </li>
            ))
          : '<N/A>'}
      </div>
      {/* optional dependencies of package */}
      <div className="package__ext">
        <h3>optional(s)</h3>
        {exts
          ? exts
              .sort((a, b) => Object.keys(a)[0] > Object.keys(b)[0])
              .map((e, id) => {
                const key = Object.keys(e)[0];
                const value = Object.values(e)[0];
                if (value) {
                  return (
                    <li key={id} className={`${value ? 'clickable' : ''}`}>
                      <Link to={`/package/${key}`}>{key}</Link>
                    </li>
                  );
                } else {
                  return (
                    <li key={id} className={`${value ? 'clickable' : ''}`}>
                      {key}
                    </li>
                  );
                }
              })
          : '<N/A>'}
      </div>
    </div>
  );
};

export default Package;
