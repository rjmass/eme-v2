import React from 'react';
import { Link } from 'react-router';
import './AnalyticsSingleStatBox.css';

export default (props) => {
  const box = (
    <div className={`stat-box ${props.className}`}>
      {props.url ? <i className="fa fa-link stat-drill-down" /> : null}
      <div className="stat-number">
        {props.value}
      </div>
      <div className="stat-label">
        {props.label}
      </div>
    </div>);

  return props.url ? <Link to={props.url}>{box}</Link> : box;
};
