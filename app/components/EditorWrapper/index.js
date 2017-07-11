import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Editor, RichUtils, convertToRaw } from 'draft-js';
import CommentPopUp from './CommentPopUp';
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
    const { editorState, setEditorState } = this.props;
    switch (command) {
      case 'BOLD': {
        return setEditorState(
          RichUtils.toggleInlineStyle(editorState, 'BOLD')
        );
      }
      case 'COMMENT': {
        console.log('add comment');
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
          this.setState({
            commentText,
            showCommentPopUp: true,
          });
        } else {
          console.log('collapsed');
        }
        break;
      }
      default: {
        break;
      }
    }
    return e;
  }

  render() {
    const buttonSyle = {
      normal: { border: '2px solid black', padding: '10px' },
      disabled: { border: '2px solid black', padding: '10px', backgroundColor: 'grey' },
    };
    const { editorState, setEditorState } = this.props;
    const { showCommentPopUp, commentText } = this.state;
    const selection = editorState.getSelection();
    const textIsSelected = !selection.isCollapsed();
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
        {showCommentPopUp &&
          <CommentPopUp commentString={commentText} selection={selection} />
        }
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
      console.log('set state in index', convertToRaw(newState.getCurrentContent()));
      dispatch({
        type: 'SET_EDITOR_STATE',
        editorState: newState,
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorWrapper);
