import React from 'react';
import { connect } from 'react-redux';
import { Editor, RichUtils } from 'draft-js';
import { style } from 'typestyle';
import EditCommentButton from './EditCommentButton';
// import * as csstips from 'csstips';
require('draft-js/dist/Draft.css');


const textEditorClass = style({
  minHeight: '200px',
  color: 'rgb(96,71,82)',
  position: 'relative',
});

class TextEditor extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  handleKeyCommand(command) {
    const { editorState, setEditorState } = this.props;

    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  handleMenuClick(e, command) {
    e.preventDefault();
    const { editorState, editComment, setEditorState, commentIsBeingEdited } = this.props;
    if (commentIsBeingEdited) {
      console.warn('dont edit text while commenting...');
      return false;
    }
    switch (command) {
      case 'BOLD': {
        return setEditorState(
          RichUtils.toggleInlineStyle(editorState, 'BOLD')
        );
      }
      case 'COMMENT': {
        const selection = editorState.getSelection();
        if (!selection.isCollapsed()) {
          const contentState = editorState.getCurrentContent();
          const startKey = editorState.getSelection().getStartKey();
          const startOffset = editorState.getSelection().getStartOffset();
          const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
          const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

          let commentText = '';
          if (linkKey) { // if there allready is a comment
            const linkInstance = contentState.getEntity(linkKey);
            commentText = linkInstance.getData().comment;
          }
          editComment(commentText);
        }
        break;
      }
      default: {
        break;
      }
    }
    return true;
  }

  render() {
    const { editorState, setEditorState, commentIsBeingEdited } = this.props;
    const selection = editorState.getSelection();

    const textIsSelected = !selection.isCollapsed();
    return (
      <div className={textEditorClass}>
        <div ref={(c) => { this.offset = c; }} style={{ position: 'relative' }}>
          <Editor handleKeyCommand={this.handleKeyCommand} editorState={editorState} onChange={setEditorState} />
          <EditCommentButton offsetElement={this.offset} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    editorState: state.getIn(['editor', 'editorState']),
    commentIsBeingEdited: state.getIn(['editor', 'commentIsBeingEdited']),
  };
}


function mapDispatchToProps(dispatch) {
  return {
    setEditorState: (newState) => {
      dispatch({
        type: 'SET_EDITOR_STATE',
        editorState: newState,
      });
    },
    editComment: (commentText) => {
      dispatch({
        type: 'EDIT_COMMENT',
        commentText,
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TextEditor);
