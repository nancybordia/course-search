var document = require('global/document');
var value = require('observ');
var struct = require('observ-struct');
var Delegator = require('dom-delegator');
var mainLoop = require('main-loop');
var h = require('virtual-hyperscript');
var MultipleEvent = require('geval/multiple');
var changeEvent = require('value-event/change');

var courses = [
  require('./catalog/computer-science/cap3020.json'),
  require('./catalog/computer-science/cap3027.json')
];

var state = struct({
  query: value(''),
  events: MultipleEvent(['change'])
});

state.events.change(function(data) {
  state.query.set(data.query);
});

Delegator();
var loop = mainLoop(state(), render);
document.body.appendChild(loop.target);
state(loop.update);

function render(state) {
  var results = courses.filter(function(course) {
    return course.name.toLowerCase().indexOf(state.query) >= 0;
  });

  var ret = [];

  ret.push(h('input', {
    type: 'text',
    name: 'query',
    value: String(state.query),
    'ev-event': changeEvent(state.events.change)
  }));

  results.forEach(function(course) {
    ret.push(h('p', course.name));
  });

  return h('div', ret);
}