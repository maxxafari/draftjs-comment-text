import React from 'react';
import EditorWrapper from '../../components/EditorWrapper';

export default class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <h1>
          Text Note
        </h1>
        <h3>Make notes in text and list the notes seperatly</h3>
        <EditorWrapper />
      </div>
    );
  }
}
