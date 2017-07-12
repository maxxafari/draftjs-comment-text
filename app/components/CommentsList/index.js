import React from 'react';
import { connect } from 'react-redux';
import { convertToRaw, SelectionState, EditorState } from 'draft-js';

const style = { background: 'black', border: '1px solid black', minHeight: '100px', color: 'white' };
class CommentsList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props){
    super(props);
    this.selectComment = this.selectComment.bind(this);
  }

  selectComment(comment) {
    const { editorState, setEditorState } = this.props;

    const selectionState = SelectionState.createEmpty(comment.blockKey);
    const updatedSelection = selectionState.merge({
      anchorOffset: comment.offset,
      focusKey: comment.blockKey,
      focusOffset: (comment.offset + comment.length),
      hasFocus: false,
      isBackward: false,
    });
    console.log("editorState",editorState.toJS());
    const newEditorState = EditorState.forceSelection(editorState, updatedSelection);// editorState.set('selection', updatedSelection);
    setEditorState(newEditorState);
  }

  render() {
    const { editorState } = this.props;

    const contentState = editorState.getCurrentContent();
    const rawState = convertToRaw(contentState);

    const comments = [].concat(...rawState.blocks.map((block, blockIndex) => {

      if (block.entityRanges.length < 1) {
        return [];
      }

      return block.entityRanges.map((entity) => {
        const comment = rawState.entityMap[entity.key];
        return {
          blockIndex: blockIndex+1,
          blockKey: block.key,
          entityKey: entity.key,
          commentText: comment.data.comment,
          length: entity.length,
          offset: entity.offset
        }
      });
    }));

    const listItems = comments.map((comment, index) => (
      <li key={index}><button onClick={(e) => {this.selectComment(comment)}}>[{comment.blockIndex}:{comment.offset}] {comment.commentText}</button></li>
      ));

    return (
      <div style={style}>
        <ul>
          {listItems}
        </ul>
        <p>
          [Paragrap:Letter Number] Click on comment to edit or remove
        </p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    editorState: state.getIn(['editor', 'editorState']),
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentsList);
