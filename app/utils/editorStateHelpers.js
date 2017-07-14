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

const getCommentTextFromSelection = (editorState) => {
  const selection = editorState.getSelection();
  let commentText = '';

  if (!selection.isCollapsed()) {
    const contentState = editorState.getCurrentContent();
    const startKey = editorState.getSelection().getStartKey();
    const startOffset = editorState.getSelection().getStartOffset();
    const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
    const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
    if (linkKey) { // if there allready is a comment
      const linkInstance = contentState.getEntity(linkKey);
      commentText = linkInstance.getData().comment;
    }
  }
  return commentText;
};

export { addOrEditComment, getCommentTextFromSelection };
