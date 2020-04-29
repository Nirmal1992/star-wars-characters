import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router } from 'react-router-dom';

import CharacterList from './CharacterList';

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
      response: null,
      loading: true,
      error: null,
    };
  }

  if (action.type === RESPONSE_COMPLETE) {
    return {
      response: action.payload.data,
      loading: false,
      error: null,
    };
  }

  if (action.type === ERROR) {
    return {
      response: null,
      loading: false,
      error: action.payload.error,
    };
  }
  return state;
};

const useFetch = url => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({
      type: LOADING,
    });

    const fetchUrl = async url => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        dispatch({
          type: RESPONSE_COMPLETE,
          payload: { data },
        });
      } catch (error) {
        dispatch({
          type: ERROR,
          payload: { error },
        });
      }
    };
    fetchUrl(url + '/characters');
  }, [url]);
  return [state.response, state.loading, state.error];
};
const Application = () => {
  const [response, loading, error] = useFetch(endpoint);
  const characters = (response && response.characters) || [];

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
          {loading ? (
            <div> Loading...</div>
          ) : (
            <CharacterList characters={characters} />
          )}
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
