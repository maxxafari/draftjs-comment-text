import React from 'react';
import EditorWrapper from '../../components/EditorWrapper';
import { style } from "typestyle";

const wrapperClass = style({
  backgroundColor: '#eee',
  padding: '15px',

});

const blockClass = style({
  padding: '30px 15px',
  backgroundColor: '#fff',
  marginBottom: '15px',
  boxShadow: '-2px 2px 3px 0px rgba(0,0,0,0.51)'
});

const titleClass = style({
  textAlign: 'center',
  fontSize: '5em'
});

export default class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={wrapperClass}>
        <div className={blockClass}>
          <h1 className={titleClass}>Offer terms</h1>
          <EditorWrapper />
        </div>
      </div>
    );
  }
}
