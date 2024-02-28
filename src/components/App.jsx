import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

function App() {
  const dispatch = useDispatch();
  const elements = useSelector(store => store.elements);
  const [newElement, setNewElement] = useState('');
  
  useEffect(() => {
    getElements();
  }, []);

  const getElements = () => {
    // Trigger a saga, to go get the list from the server
    dispatch({type: 'FETCH_ELEMENTS'});
  }

  const addElement = (event) => {
    event.preventDefault();

    axios({
      method: 'POST',
      url: '/api/elements',
      data: { 
        name: newElement
      }
    })
      .then((response) => {
        getElements();
        setNewElement('');
      })
      .catch(error => {
        console.log('error with element get request', error);
      });
  }

  return (
    <div>
      <h1>Atomic Elements</h1>

      <form>
        <input
          placeholder="Element name"
          type="text"
          value={newElement} 
          onChange={(event) => setNewElement(event.target.value)} 
        />
        <button onClick={addElement}>Add Element</button>
      </form>

      <ul>
        {elements.map((element, index) => (
          <li key={index}>
            {element}
          </li>
        ))}
      </ul>
    </div>
  );
}


export default App;
