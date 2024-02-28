import { createStore, combineReducers, applyMiddleware } from 'redux';

// These imports are new, don't forget these, or none of this will work
// Also, don't forget to npm install npm i redux-saga, if it's not already in package.json!
import createSagaMiddleware from 'redux-saga';
import { takeLatest, put } from 'redux-saga/effects';

import logger from 'redux-logger';
import axios from 'axios';

// Reducer (some state, being managed by Redux)
const elements = (state = [], action) => {

  switch (action.type) {
    case 'SET_ELEMENTS':
      return action.payload;
    default:
      return state;
  }
};

function* firstSaga(action) {
  console.log('firstSaga was hit with action:', action);
}

// Get the list of elements from the server,
// Then send them as a payoad in the SET_ELEMENTS action,
// which triggers the elementList reducer,
// to update the state
function* fetchElements() {

  // In our saga functions, we need to yield anything that's asyncronous (axios), or a return (something that ends our function, like put)
  // Try catch blocks are common in Javascript, and a good practice when you have code that could cause an error.
  // They take the place of .then() and .catch()
  try { // Code in a try block just runs, line by line, unless there is an error
      const elementsReponse = yield axios.get('/api/elements');
      // So as long as there is no error response, this next line just happens, without being in a .then()
      // put is like dispatch, except we use use put when sending actions from sagas to redux
      yield put({ type: 'SET_ELEMENTS', payload: elementsReponse.data });
  } catch (error) {  // If anything in the try{ } does cause an error, the code in 'try' stops runnning, and we run the code in catch {} instead.
      console.log('error with element get request', error);
  }
}

function* postElement(action) {
  try {
    yield axios.post('/api/elements', {name: action.payload});
    yield put({type: 'FETCH_ELEMENTS'});
  } catch (error) {
    console.log('error adding element', error);
  }
}

// this is the saga that will watch for actions, and decide which other saga to run.
// This is kinda like a "store for sagas", but it checks the action types,
// rather than leting each saga check every action type.
function* rootSaga() {
  // We add all sagas here, like this: yield takeLatest('ACTION_TO_WATCH_FOR', nameOfSagaFunctionToRun);
    
  // If we see an action "EXAMPLE_SAGA_TRIGGER", run the firstSaga saga.
  yield takeLatest('EXAMPLE_SAGA_TRIGGER', firstSaga);

  // If we see an action "FETCH_ELEMENTS", run the fetchElements saga.
  yield takeLatest('FETCH_ELEMENTS', fetchElements);

  yield takeLatest('ADD_ELEMENT', postElement);
}

// redux-saga is middleware that can not only read dispatched actions, it can also dispatch actions!?!?!
const sagaMiddleware = createSagaMiddleware();

// This is creating the store
// the store is the big JavaScript Object that holds all of the information for our application
const store = createStore(
  // This function is our first reducer
  // reducer is a function that runs every time an action is dispatched
  combineReducers({
    elements,
  }),

    // We add sagaMiddleware to our store, as middleware.
    // This means, it will intercept all actions, before the reducers get them.
    applyMiddleware(sagaMiddleware, logger),
);

// rootSaga is where we bundled all our saga functions together.
// We add it to sagaMiddleware, so we can run our sagas when sagaMiddleware intecepts all actions sent to the store.
sagaMiddleware.run(rootSaga);


export default store;

