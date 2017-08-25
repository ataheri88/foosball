//@flow
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import reducer from '../reducers'


const middleware = [ thunk ]
if (process.env.NODE_ENV !== 'production') {
  middleware.push(logger)
}

const configureStore = () => createStore(
  reducer,
  applyMiddleware(...middleware)
)

export default configureStore