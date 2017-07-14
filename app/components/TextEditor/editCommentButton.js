import React from 'react';
import { connect } from 'react-redux';
import { RichUtils } from 'draft-js';
import { style } from 'typestyle';
import * as csstips from 'csstips';

const buttonClass = style(
  csstips.content,
  { padding: '3px' }
);

const editCommentClass = style(
  {
    position: 'absolute',
    backgroundColor: 'rgb(42,42,42)',
    borderRadius: '5px',
    color: 'white',
    padding: '10px',
    width: '75px',
    $nest: {
      '&::after': {
        content: '\' \'',
        transform: 'rotate(45deg)',
        position: 'absolute',
        width: '10px',
        height: '10px',
        bottom: '-5px',
        left: '30px',
        backgroundColor: 'rgb(42,42,42)',
      },
      div: buttonClass,
      top: '0px',
      left: '0px',
    },
    zIndex: 99,
  },
  csstips.horizontal,
);

class EditCommentButton extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {position: {}}
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.setToolboxPosition = this.setToolboxPosition.bind(this);
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

  setToolboxPosition() {
    const { offsetElement } = this.props;
    function getSelected() {
      let t = '';
      if (window.getSelection) {
        t = window.getSelection();
      } else if (document.getSelection) {
        t = document.getSelection();
      } else if (document.selection) {
        t = document.selection.createRange().text;
      }
      return t;
    }

    setTimeout(() => {
      const { editorState } = this.props;
      const { position } = this.state;
      const selection = editorState.getSelection();
      try {
        // setting the selection in DOM might take som time.
        if (selection.isCollapsed()) {
          this.setState({ position: {} });
        } else {
          const selected = getSelected();
          const rect = selected.getRangeAt(0).getBoundingClientRect();
          const offset = offsetElement.getBoundingClientRect();
          const newPosition = { left: (rect.left - offset.left), top: (rect.top - offset.top), width: rect.width };
          if(position.left != newPosition.left || position.top != newPosition.top) {
            this.setState({ position: newPosition });
          }
        }
      } catch (e){
        this.setState({ position: {} });
      }
    }, 100);
  }


  render() {
    this.setToolboxPosition();
    const { position } = this.state;
    if(!position.left) return null;
    const { editorState} = this.props;

    const inlineStyle = {
      left: parseInt(position.left ),
      top: parseInt(position.top) - 5,
      transform: 'translate3D(-50%,-100%,0)',
    };

    return (
      <div className={editCommentClass} style={inlineStyle}>
        <button
          onClick={(e) => { this.handleMenuClick(e, 'COMMENT'); }}
        >📝</button>
        <button>❌</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditCommentButton);
