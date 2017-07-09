import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Editor } from 'draft-js';
require('draft-js/dist/Draft.css');


const style = { background: 'white', border: '1px solid black', minHeight: '200px' };

class EditorWrapper extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { editorState, setEditorState } = this.props;
    return (
      <div style={style}>
        <p>Add notes by selecting text</p>
        <Editor editorState={editorState} onChange={setEditorState} />
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
