import { fromJS } from 'immutable';
import { EditorState } from 'draft-js';

import {
  DEFAULT_EXAMPLE_TEXT,
} from '../App/constants'; // eslint-disable-line

const initialState = fromJS({
  defaultText: DEFAULT_EXAMPLE_TEXT,
  editorState: EditorState.createEmpty(),
});

export default function editorReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_EDITOR_STATE':
      return state
        .set('editorState', action.editorState);
    default:
      return state;
  }
}
