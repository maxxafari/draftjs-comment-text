import React from 'react';
import { style } from 'typestyle';
import TextEditor from '../../components/TextEditor';
import CommentsList from '../../components/CommentsList';

const wrapperClass = style({
  backgroundColor: '#eee',
  padding: '15px',
  fontFamily: 'Arial, Helvetica, sans-serif',

});

const blockClass = style({
  padding: '30px',
  backgroundColor: '#fff',
  marginBottom: '15px',
  boxShadow: '-2px 2px 3px 0px rgba(0,0,0,0.51)',
  borderRadius: '3px',
});

const titleClass = style({
  textAlign: 'center',
  fontSize: '3em',
});

export default class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={wrapperClass}>
        <div className={blockClass}>
          <h1 className={titleClass}>Offer terms</h1>
          <TextEditor />
        </div>
        <div className={blockClass}>
          <CommentsList />
        </div>
      </div>
    );
  }
}
