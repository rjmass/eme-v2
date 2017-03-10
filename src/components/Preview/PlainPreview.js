import React from 'react';

export default (props) => {
  const { body } = props;
  return (
    <pre>{body}</pre>
  );
};
