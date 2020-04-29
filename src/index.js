import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import CharacterList from './CharacterList';
import CharacterView from './CharacterView';
//import dummyData from './dummy-data';
import endpoint from './endpoint';
import './styles.scss';

const initialState = {
  response: null,
  loading: false,
  error: null,
};

const LOADING = 'LOADING';
const RESPONSE_COMPLETE = 'RESPONSE_COMPLETE';
const ERROR = 'ERROR';

const reducer = (state, action) => {
  if (action.type === LOADING) {
    return {
      characters: [],
      loading: true,
      error: null,
    };
  }

  if (action.type === RESPONSE_COMPLETE) {
    return {
      characters: action.payload.data,
      loading: false,
      error: null,
    };
  }

  if (action.type === ERROR) {
    return {
      characters: [],
      loading: false,
      error: action.payload.error,
    };
  }
  return state;
};

const fetchCharacters = dispatch => {
  dispatch({ type: LOADING });
  fetch(endpoint + '/characters')
    .then(res => res.json())
    .then(data =>
      dispatch({
        type: RESPONSE_COMPLETE,
        payload: { data: data.characters },
      }),
    )
    .catch(error => {
      dispatch({
        type: ERROR,
        payload: { error },
      });
    });
};
const useThunkReducer = (reducer, initialState) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const enhancedDispatched = action => {
    if (typeof action === 'function') {
      action(dispatch);
    }
    dispatch(action);
  };
  return [state, enhancedDispatched];
};

const Application = () => {
  const [state, dispatch] = useThunkReducer(reducer, initialState);
  const { characters, loading, error } = state;

  if (error) {
    return (
      <code>
        <pre>{JSON.stringify(error.message, undefined, 2)}</pre>
      </code>
    );
  }
  return (
    <div className="Application">
      <header>
        <h1>Star Wars Characters</h1>
      </header>
      <main>
        <section className="sidebar">
          <button onClick={() => dispatch(fetchCharacters)}>
            {' '}
            Fetch characters
          </button>
          {loading ? (
            <div> Loading...</div>
          ) : (
            <CharacterList characters={characters} />
          )}
        </section>
        <section className="CharacterView">
          <Route path="/characters/:id" component={CharacterView} />
        </section>
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');

ReactDOM.render(
  <Router>
    <Application />
  </Router>,
  rootElement,
);
