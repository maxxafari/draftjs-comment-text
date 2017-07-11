import React from 'react';
import { connect } from 'react-redux';
import { Editor, RichUtils } from 'draft-js';
import CommentPopUp from './CommentPopUp';
import CommentsList from '../CommentsList';
require('draft-js/dist/Draft.css');

const style = { background: 'white', border: '1px solid black', minHeight: '200px' };

const defaultInternalState = {
  commentText: '',
  showCommentPopUp: false,
};

class EditorWrapper extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = defaultInternalState;
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
        console.log('edit comment');
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
        } else {
          console.log('collapsed');
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
    const buttonSyle = {
      normal: { border: '2px solid black', padding: '10px' },
      disabled: { border: '2px solid black', padding: '10px', backgroundColor: 'grey' },
    };
    const { editorState, setEditorState, commentIsBeingEdited } = this.props;
    const selection = editorState.getSelection();
    const textIsSelected = !selection.isCollapsed();
    console.log(commentIsBeingEdited, 'commentIsBeingEdited');
    return (
      <div style={style}>
        <p>Add notes by selecting text</p>
        <div className="editor__menu">
          <button style={buttonSyle} onClick={(e) => { this.handleMenuClick(e, 'BOLD'); }}>Bold</button>
          <button
            style={textIsSelected ? buttonSyle.normal : buttonSyle.disabled}
            disabled={!textIsSelected}
            onClick={(e) => { this.handleMenuClick(e, 'COMMENT'); }}
          >
            Add comment
          </button>
        </div>
        <Editor handleKeyCommand={this.handleKeyCommand} editorState={editorState} onChange={setEditorState} />
        {commentIsBeingEdited &&
          <CommentPopUp />
        }
        <CommentsList />
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

export default connect(mapStateToProps, mapDispatchToProps)(EditorWrapper);
