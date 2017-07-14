import React from 'react';
import { connect } from 'react-redux';
import { EditorState, Modifier } from 'draft-js';

const style = { background: 'black', border: '1px solid black', minHeight: '100px', color: 'white' };
const inputStyle = { background: 'white', padding: '2px', color: 'black' };
class CommentPopUp extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.onLinkInputKeyDown = this.onLinkInputKeyDown.bind(this);
  }

  componentDidMount() {
    this.newCommentText.focus();
  }

  onLinkInputKeyDown(e) {
    switch (e.which) {
      case 27:
        console.log('cancel');
        break;
      case 13:
        console.log('ok!');
        this.save();
        break;
      default:
        break;
    }
  }

  save() {
    const { editorState, saveComment } = this.props;
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const contentStateWithEntity = contentState.createEntity(
      'COMMENT',
      'MUTABLE',
      { comment: this.newCommentText.value }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    console.log('selection state', selection);
    console.log('entetykey', entityKey);
    const contentStateWithComment = Modifier.applyEntity(
      contentStateWithEntity,
      selection,
      entityKey
    );
    console.log('content state:', contentStateWithComment);
    const newEditorState = EditorState.push(
      editorState,
      contentStateWithComment,
      'apply-entity');
    console.log('editor state:', newEditorState);
    saveComment(newEditorState);
  }

  render() {
    const { commentText } = this.props;
    return (
      <div style={style}>
        <p>Add comment to text</p>
        <input
          onKeyDown={this.onLinkInputKeyDown}
          style={inputStyle} type="text"
          ref={(c) => { this.newCommentText = c; }}
          defaultValue={commentText}
        />
        <div className="editor__comment-popup__menu">
          <button onClick={(e) => { this.save(e); }}>Save comment</button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    editorState: state.getIn(['editor', 'editorState']),
    commentIsBeingEdited: state.getIn(['editor', 'commentIsBeingEdited']),
    commentText: state.getIn(['editor', 'commentText']),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    saveComment: (newState) => {
      dispatch({
        type: 'SAVE_COMMENT',
        editorState: newState,
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentForm);
