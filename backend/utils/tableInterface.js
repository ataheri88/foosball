var path = require('path');
const { spawn } = require('child_process');
const WebSocket = require('ws');

class tableInterface {
  constructor() {    
    this.table = null;
    this.server = null;
    this.wss = null;
  }

  initialize(server) {
    this.server = server;
    this.wss = new WebSocket.Server({ server, clientTracking: true });

    this.wss.on('connection', (ws, req) => {
      console.log(`Websocket Connected: ${req.url} @ ${req.connection.remoteAddress}`);

      ws.on('message', (data) => {
        console.log(`Message: ${data}`);
      });
    });
  }
  broadcastData(data) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }
  connectToTable() {
    // const script = path.join(__dirname, '../../python/tableTest.py')
    const script = path.join(__dirname, '../../python/goalDetector.py')

    // Need to run python script in unbufferred mode so print statements are immediately flushed to stdout
    this.table = spawn('python', ["-u", script] )

    this.table.on('error', (error) => {
      console.error(`Table - Error: ${error}`);
    })
    
    this.table.stdout.on('data', (data) => {
      // console.log(`Table - stdout: ${data}`);
      const message = data.toString();
      if (message.includes('Red')) {
        this.broadcastData('Red');  
      } else if (message.includes('Blue')) {
        this.broadcastData('Blue');  
      }      
    });

    this.table.stderr.on('data', (data) => {
      // console.error(`Table - stderr: ${data}`);      
    });

    this.table.on('close', (code) => {
      console.log(`Table quit: ${code}`);
    });

  }

  shutdown() {
    this.table.stdin.write('quit');
    this.table.stdin.end();
  }
}

module.exports = new tableInterface;