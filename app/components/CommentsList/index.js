import React from 'react';
import { connect } from 'react-redux';
import { convertToRaw, Modifier } from 'draft-js';

function CommentSpan(props) {
  return <span className="editor__comment" style={{ backgroundColor: 'yellow' }}>{props.children}</span>;
}

const ListItem = (props) => (
  <li>{props.comment || 'a comment...'}</li>
  );

const style = { background: 'black', border: '1px solid black', minHeight: '100px', color: 'white' };
const inputStyle = { background: 'white', padding: '2px', color: 'black' };
class CommentsList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
  }


  render() {
    const { editorState } = this.props;

    const contentState = editorState.getCurrentContent();
    const rawState = convertToRaw(contentState);
    console.log('rawState', rawState);

    const comments = rawState.blocks.map((comment) => {
      if (comment.entityRanges.length < 1) { return false; }
      console.log('commm.', comment.entityRanges[0]);
      const ent = comment.entityRanges[0].key;
      console.log('editorState.entityMap', editorState.entityMap);
      const com = rawState.entityMap[ent].data.comment;
      console.log('com', com);
      return { com, ent };
    });

    /*
    console.log('this is !', blocks);
    const blockWithLinkAtBeginning = contentState.getBlockForKey(0);
    const entityKey = blockWithLinkAtBeginning.getEntityAt(0);
    const commentInstance = contentState.getEntity(entityKey);
    const { comment } = commentInstance.getData();
*/

    const listItems = comments.map((comment, index) => (
      <li key={index}>{comment.com}</li>
      ));

    return (
      <div style={style}>
        <ul>
          {listItems}
        </ul>
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
