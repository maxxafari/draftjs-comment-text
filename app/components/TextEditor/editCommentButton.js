import React from 'react';
import { connect } from 'react-redux';
import { style } from 'typestyle';
import * as csstips from 'csstips';
import { addOrEditComment, getCommentTextFromSelection } from '../../utils/editorStateHelpers';


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
    opacity: 0,
  },
  csstips.horizontal,
);

class EditCommentButton extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = { position: {}, isHovering: false };
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.setToolboxPosition = this.setToolboxPosition.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }


  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.isHovering === true) return false;
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
          if (position.left !== newPosition.left || position.top !== newPosition.top) {
            this.setState({ position: newPosition });
          }
        }
      } catch (e) {
        this.setState({ position: {} });
      }
    }, 100);
  }

  handleMenuClick(e, command) {
    e.preventDefault();
    console.log('handle');
    const { editorState, editComment, saveComment, commentIsBeingEdited } = this.props;
    if (commentIsBeingEdited) {
      console.warn('dont edit text while commenting...');
      return false;
    }

    switch (command) {
      case 'COMMENT': {
        const commentText = getCommentTextFromSelection(editorState);
        editComment(commentText);
        break;
      }
      case 'DELETE': {
        const newEditorState = addOrEditComment(editorState, null);
        saveComment(newEditorState);
        break;
      }
      default: {
        break;
      }
    }

    return true;
  }

  handleMouseOut() {
    this.setState({ isHovering: false });
  }

  handleMouseOver() {
    // dont close if mouse is on edit button
    this.setState({ isHovering: true });
  }

  render() {
    this.setToolboxPosition();
    const { position } = this.state;
    const { editorState } = this.props;

    const hasComment = getCommentTextFromSelection(editorState);

    let inlineStyle = {
      opacity: 0,
    };
    if (position.left) {
      inlineStyle = {
        left: parseInt(position.left, 0),
        top: parseInt(position.top, 0) - 5,
        transform: 'translate3D(-50%,-100%,0)',
        opacity: 1,
      };
    }

    return (
      <div
        className={editCommentClass}
        style={inlineStyle}
        onMouseOver={this.handleMouseOver}
        onFocus={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        onBlur={this.handleMouseOut}
      >
        <button
          onClick={(e) => { this.handleMenuClick(e, 'COMMENT'); }}
        >📝</button>
        { hasComment &&
          <button
            onClick={(e) => { this.handleMenuClick(e, 'DELETE'); }}
          >❌</button>
        }
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
    editComment: (commentText) => {
      dispatch({
        type: 'EDIT_COMMENT',
        commentText,
      });
    },
    saveComment: (newState) => {
      dispatch({
        type: 'SAVE_COMMENT',
        editorState: newState,
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCommentButton);
