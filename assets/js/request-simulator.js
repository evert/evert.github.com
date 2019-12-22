document.addEventListener('DOMContentLoaded', main);

const testData = {

  'h1-nocache': {
    httpVersion: '1.1',
    title: '100 requests via HTTP/1.1',
    byline: 'HTTP/1.1 is limited to 6 concurrent requests. The big box is the initial index or collection.',
    mode: 'normal',
    legend: ['loading', 'received'],
  },
  'h1-compound': {
    httpVersion: '1.1',
    title: 'Compounding 100 items in a collection',
    byline: 'Combining many logical entities in 1 bulky response has major speed benefits.',
    mode: 'compound',
    legend: ['loading', 'received'],
  },
  'h2-nocache': {
    httpVersion: '2',
    title: '100 parallel requests via HTTP/2',
    byline: 'HTTP/2 can fire off many parallel requests over 1 TCP connection',
    mode: 'normal',
    legend: ['loading', 'received'],
  },
  'h2-push': {
    httpVersion: '2',
    title: 'HTTP/2 Server Push',
    byline: 'With HTTP/2 Server Push, entities can arrive earlier because the client doesn\'t have to wait',
    mode: 'push',
    legend: ['loading', 'received', 'pushed'],
  },
  'h2-cached': {
    httpVersion: '2',
    title: 'Push, Cache Digests and a warm cache',
    byline: 'The client has a generic way to inform the server of their state. The server pushes just the things that the client needs.',
    mode: 'cache',
    legend: ['cached', 'loading', 'received', 'pushed'],
  },
  'h2-cors': {
    httpVersion: '2',
    title: 'Every request needs an OPTIONS pre-flight',
    byline: 'The lack of a domain-wide cross-domain policy slows everything down.',
    mode: 'cors',
    legend: ['loading', 'preflight', 'received'],
  },

}

function main() {

  const containers = document.getElementsByClassName('request-simulator');

  for(const container of containers) {
    loadTestSample(container, container.dataset.id);
  }

}

const gridSize = 100;

function loadTestSample(elem, id) {

  const test = testData[id];
  renderTemplate(elem, test);
  const grid = renderGrid(elem.getElementsByClassName('blocks')[0], test);

  elem.getElementsByTagName('button')[0].addEventListener('click', () => {
    startTest(test, grid);
  });

}

function renderTemplate(elem, test)  {

  const legend = test.legend.map( legendItem => {

    switch(legendItem) {
      case 'loading' :
        return '<span class="loading"></span> Loading';
      case 'received' : 
        return '<span class="received"></span> Received';
      case 'pushed' :
        return '<span class="pushed"></span> Received via HTTP/2 Server Push';
      case 'cached' :
        return '<span class="cached"></span> Cached';
      case 'preflight' :
        return '<span class="preflight"></span> Received OPTIONS response';
    }

  }).join('');

  elem.innerHTML = `<h3>${test.title}</h3>
<div class="blocks">
</div>
<div class="legend">
  ${legend}
</div>
<div class="controls">
<p>${test.byline}</p>
<button>${test.mode === 'cache' ? 'Refresh' : 'Start'}</button>
</div>
`;

}

function renderGrid(elem, test) {
  const grid = [];
  for(let i = 0; i < gridSize; i++ ) {

    const span = document.createElement('span');
    if (test.mode === 'cache') {
      span.className = 'cached';
    }
    grid.push(span);
    elem.appendChild(span);

  }

  return grid;
}

function delay(ms) {
  return new Promise( res => {
    setTimeout(res, ms);
  });
}

async function startTest(test, grid) {

  for(const cell of grid) {
    cell.className = test.mode === 'cache' ? 'cached' : '';
  }

  switch(test.mode) {
    default :
      await parallelTest(test, grid);
      break;
    case 'compound' :
      await compoundTest(test, grid);
      break;
    case 'push':
      await pushTest(test, grid);
      break;
    case 'cache':
      await cacheTest(test, grid);
      break;
    case 'cors':
      await corsTest(test, grid);
      break;
  }

}

async function parallelTest(test, grid) {

  const promises = [];
  const throttler = new RequestThrottler(test.httpVersion === '1.1' ? 6 : 1000);

  let first = true;

  for(const cell of grid) {
    // Adding a tiny delay since there is a small
    // amount of overhead in kicking off a request
    await delay(5);

    if (first) {
      first = false;
      // Hit for the first collection. This should block everything else.
      cell.className='loading';
      await slowRequest();
      cell.className = 'received';
      continue;
    }

    promises.push((async () => {
      await throttler.go(() => {
        cell.className = 'loading';
      })
      cell.className = 'received';
    })());
  }

  await Promise.all(promises);

}

async function corsTest(test, grid) {

  const promises = [];
  const throttler = new RequestThrottler(test.httpVersion === '1.1' ? 6 : 1000);

  let first = true;

  for(const cell of grid) {
    // Adding a tiny delay since there is a small
    // amount of overhead in kicking off a request
    await delay(5);

    if (first) {
      first = false;
      // Hit for the first collection. This should block everything else.
      cell.className='loading';
      await slowRequest();
      cell.className='preflight';
      await slowRequest();
      cell.className = 'received';
      continue;
    }

    promises.push((async () => {
      await throttler.go(() => {
        cell.className = 'loading';
      })
      cell.className = 'preflight';
      await throttler.go(() => {});
      cell.className = 'received';
    })());
  }

  await Promise.all(promises);

}

async function pushTest(test, grid) {

  const promises = [];
  const throttler = new RequestThrottler(test.httpVersion === '1.1' ? 6 : 50);

  let first = true;

  for(const cell of grid) {
    // Adding a tiny delay since there is a small
    // amount of overhead in kicking off a request
    await delay(5);

    if (first) {
      first = false;
      // Hit for the first collection. This should block everything else.
      cell.className='loading';
      slowRequest().then( () => {
        // Little bit of extra delay
        return delay(minLatency/2);
      })
      .then( () => {
        cell.className = 'received';
      });
      // There's still some latency
      continue;
    }

    promises.push((async () => {
      await throttler.go(() => {
      })
      cell.className = 'pushed';
    })());
  }

  await Promise.all(promises);

}
async function cacheTest(test, grid) {

  const promises = [];
  const throttler = new RequestThrottler(test.httpVersion === '1.1' ? 6 : 50);

  let first = true;

  for(const cell of grid) {
    // Adding a tiny delay since there is a small
    // amount of overhead in kicking off a request
    await delay(5);

    if (first) {
      first = false;
      // Hit for the first collection. This should block everything else.
      cell.className='loading';
      slowRequest().then( () => {
        // Little bit of extra delay
        return delay(minLatency/2);
      })
      .then( () => {
        cell.className = 'received';
      });
      // There's still some latency
      continue;
    }

    if (Math.floor(Math.random()*15) === 1) {
      promises.push((async () => {
        await throttler.go(() => {
        })
        cell.className = 'pushed';
      })());
    }
  }

  await Promise.all(promises);

}

async function compoundTest(test, grid) {

  let first = true;

  for(const cell of grid) {

    if (first) {

      first = false;
      // Hit for the first collection. This should block everything else.
      cell.className='loading';

      // Adding extra latency because the first request would take longer
      await delay(maxLatency);
      await slowRequest();
      cell.className = 'received';
      continue;
    }

    // All other cells return all at once
    cell.className = 'received';

  }

}

class RequestThrottler {

  constructor(maxConcurrency) {

    this.maxConcurrency = maxConcurrency;
    this.queuedRequests = [];
    this.inFlightCount = 0;

  }

  go(onStart = null) {

    let onEnd;

    // This is the promise we're eventually resolving
    const resultPromise = new Promise(res => {
      onEnd = res;
    });

    if (this.inFlightCount < this.maxConcurrency) {

      if (onStart) onStart();
      this.request().then( () => {
        onEnd();
        this.checkQueue();
      });

    } else {
      this.queuedRequests.push([onStart, onEnd]);
    }

    return resultPromise;

  }

  async request() {

    this.inFlightCount++;
    await slowRequest();
    this.inFlightCount--;

  }

  checkQueue() {

    if (this.inFlightCount < this.maxConcurrency && this.queuedRequests.length) {

      const [onStart, onEnd] = this.queuedRequests.shift();
      onStart();
      this.request().then(() => {
        onEnd();
        this.checkQueue();
      });

    }

  }

}

const minLatency = 1000;
const maxLatency = 1500;

/**
 * Pretends to be a slow request
 */
function slowRequest() {
  let ms;
  if (Math.floor(Math.random()*30)===0) {
    // Every 30 requests or so we'll pretend the connection was
    // choppy.
    ms = Math.random() * ((maxLatency*3) - minLatency) + minLatency
  } else {
    ms = Math.random() * (maxLatency - minLatency) + minLatency
  }
  return delay(ms);

}
