import { EditorState, Modifier } from 'draft-js';

const addOrEditComment = (editorState, commentText) => {
  // const { editorState, saveComment } = this.props;
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  let contentStateWithEntity = null;

  if (!commentText) {
    contentStateWithEntity = contentState.createEntity(null);
  } else {
    contentStateWithEntity = contentState.createEntity(
      'COMMENT',
      'MUTABLE',
      { comment: commentText }// this.newCommentText.value }
    );
  }
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const contentStateWithComment = Modifier.applyEntity(
    contentStateWithEntity,
    selection,
    (commentText ? entityKey : null)
  );

  const newEditorState = EditorState.push(
    editorState,
    contentStateWithComment,
    'apply-entity');
  return newEditorState;
  // saveComment(newEditorState);
};

export { addOrEditComment };
