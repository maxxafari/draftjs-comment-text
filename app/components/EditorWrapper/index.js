import React from 'react';
import { Editor, EditorState } from 'draft-js';
require('draft-js/dist/Draft.css');


const style = { background: 'white', border: '1px solid black', minHeight: '200px' };

export default class EditorWrapper extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
    this.onChange = (editorState) => {
      this.setState({ editorState });
      console.log('state cahcnge');
    };
  }

  render() {
    return (
      <div style={style}>
        <p>Add notes by selecting text</p>
        <Editor editorState={this.state.editorState} onChange={this.onChange} />
      </div>
    );
  }
}
