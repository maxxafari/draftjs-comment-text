import React from 'react';
import { connect } from 'react-redux';
import { Editor, RichUtils } from 'draft-js';
import CommentsList from '../CommentsList';
import { style } from 'typestyle';
import * as csstips from 'csstips';
require('draft-js/dist/Draft.css');

const textEditorClass = style({
  minHeight: '200px',
  color: 'rgb(96,71,82)',

});

const buttonClass = style(
  //csstips.content,
  {padding: '3px'}
);

const editCommentClass = style(
  {
    position: 'relative',
    backgroundColor: 'rgb(42,42,42)',
    borderRadius: '5px',
    color: 'white',
    padding: '10px',
    width: '75px',
    $nest: {
      '&::after': {
        content:`' '`,
        transform: 'rotate(45deg)',
        position: 'absolute',
        width: '10px',
        height: '10px',
        bottom: '-5px',
        left: '30px',
        backgroundColor: 'rgb(42,42,42)',
      },
      div: buttonClass,
    }
  },
  csstips.horizontal,
);

const defaultInternalState = {
  commentText: '',
  showCommentPopUp: false,
};

class TextEditor extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
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
    const buttonSyle = {
      normal: { border: '2px solid black', padding: '10px' },
      disabled: { border: '2px solid black', padding: '10px', opacity: '0.3' },
    };
    const { editorState, setEditorState, commentIsBeingEdited } = this.props;
    const selection = editorState.getSelection();
    const textIsSelected = !selection.isCollapsed();
    return (
      <div className={textEditorClass}>
        <div className={editCommentClass}>
          <button
            disabled={!textIsSelected}
            onClick={(e) => { this.handleMenuClick(e, 'COMMENT'); }}
          >
            📝
          </button>
          <button>❌</button>
        </div>
        <Editor handleKeyCommand={this.handleKeyCommand} editorState={editorState} onChange={setEditorState} />
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
