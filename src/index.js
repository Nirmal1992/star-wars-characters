import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router } from 'react-router-dom';

import CharacterList from './CharacterList';

//import dummyData from './dummy-data';
import endpoint from './endpoint';
import './styles.scss';

const useFetch = url => {
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setResponse([]);
    setLoading(true);
    setError(null);

    const fetchUrl = async url => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setResponse(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUrl(url + '/characters');
    // fetch(url + '/characters')
    //   .then(res => res.json())
    //   .then(data => {
    //     setResponse(data);
    //     setLoading(false);
    //   })
    //   .catch(error => {
    //     setError(error);
    //     setLoading(false);
    //   });
  }, [url]);
  return [response, loading, error];
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
