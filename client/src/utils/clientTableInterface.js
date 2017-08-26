import store from '../index';
import { redGoal, blueGoal } from '../actions';

class clientTableInterface {
  constructor() {
    this.socket = null;
  }

  connect(hostname) {
    // Create WebSocket connection.
    this.socket = new WebSocket(`ws://${hostname}:3001`);

    // Connection opened
    this.socket.addEventListener('open', (event) => {
      this.socket.send('Hello Server!');
    });

    // Listen for messages
    this.socket.addEventListener('message', (event) => {
      console.log('Message from server ', event.data);

      if (event.data === 'Red') {
        store.dispatch( redGoal() )
      }

      if (event.data === 'Blue') {
        store.dispatch( blueGoal() )
      }

    });
  }

  close() {
    this.socket.close();
  }
}

export default new clientTableInterface();