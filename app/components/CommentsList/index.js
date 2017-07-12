import React from 'react';
import { connect } from 'react-redux';
import { convertToRaw } from 'draft-js';

const ListItem = (props) => (
  <li>{props.comment || 'a comment...'}</li>
  );

const style = { background: 'black', border: '1px solid black', minHeight: '100px', color: 'white' };
class CommentsList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { editorState } = this.props;

    const contentState = editorState.getCurrentContent();
    const rawState = convertToRaw(contentState);

    const comments = [].concat(...rawState.blocks.map((block, blockIndex) => {

      if (block.entityRanges.length < 1) {
        return [];
      }
      console.log("block",block);
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
      <li key={index}>[{comment.blockIndex}:{comment.offset}] {comment.commentText}</li>
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
