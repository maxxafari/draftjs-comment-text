import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Editor, RichUtils } from 'draft-js';


const style = { background: 'black', border: '1px solid black', minHeight: '100px', color: 'white' };

class CommentPopUp extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  handleMenuClick(command) {
    const { editorState, setEditorState } = this.props;
    const { newCommentText} = this.refs;
    switch (command) {
      case 'SAVE':
        console.log("saving comment:", newCommentText.value);
    }
  }

  render() {
    const { commentString } = this.props;
    return (
      <div style={style}>
        <p>Add comment to text</p>
        <input type="text" ref="newCommentText" defaultValue={commentString} />
        <div className="editor__comment-popup__menu">
           <button onClick={(e) => {this.handleMenuClick('SAVE')}}>Save comment</button>
        </div>
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
      console.log('set state', newState);
      dispatch({
        type: 'SET_EDITOR_STATE',
        comment: newState,
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentPopUp);
