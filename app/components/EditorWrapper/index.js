import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Editor, RichUtils, convertToRaw } from 'draft-js';
require('draft-js/dist/Draft.css');

import CommentPopUp from './CommentPopUp';

const style = { background: 'white', border: '1px solid black', minHeight: '200px' };

class EditorWrapper extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  handleKeyCommand(command) {
    console.log('handle..');
    const { editorState, setEditorState } = this.props;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      console.log('handeld', command);
      return 'handled';
    }
    console.log('not handeld,', command);
    return 'not-handled';
  }

  handleMenuClick(command) {
    const { editorState, setEditorState } = this.props;
    switch (command) {
      case 'BOLD':
        return setEditorState(
          RichUtils.toggleInlineStyle(editorState, 'BOLD')
        );
      case 'COMMENT':
        console.log("add comment");
    }

  }

  render() {
    const { editorState, setEditorState } = this.props;
    return (
      <div style={style}>
        <p>Add notes by selecting text</p>
        <div className="editor__menu">
           <button onClick={(e) => {this.handleMenuClick('BOLD')}}>Bold</button>
        </div>
        <Editor ref="edit" handleKeyCommand={this.handleKeyCommand} editorState={editorState} onChange={setEditorState} />
        <CommentPopUp commentString="hello" />
      </div>
    );
  }
}

const editorStateSelect = createSelector(
  (state) => state.get('editor'),
  (editor) => editor.get('editorState')
);

const mapStateToProps = (state) => ({
  editorState: editorStateSelect(state),
});


function mapDispatchToProps(dispatch) {
  return {
    setEditorState: (newState) => {
      console.log('set state', newState);
      dispatch({
        type: 'SET_EDITOR_STATE',
        editorState: newState,
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorWrapper);
