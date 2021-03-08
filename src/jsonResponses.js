const linknote = {
  links: [{
      link: 'https://people.rit.edu/jz2728',
      name: 'My first link',
      note: 'This is the default link',
      color: '#FFFFFF',
    },
    {
      link: 'https://people.rit.edu/jz2728',
      name: 'My first link',
      note: 'This is the default link',
      color: '#FFFFFF',
    },
    {
      link: 'https://people.rit.edu/jz2728',
      name: 'My first link',
      note: 'This is the default link',
      color: '#FFFFFF',
    }
  ],
  counter: {
    number: 1,
  },
};

const sendJSONResponse = (request, response, responseCode, object) => {
  response.writeHead(responseCode, {
    'Content-Type': 'application/json',
  });
  response.write(JSON.stringify(object));
  response.end();
};

// "Meta" refers to *meta data*, in this case the HTTP headers
const sendJSONResponseMeta = (request, response, responseCode) => {
  response.writeHead(responseCode, {
    'Content-Type': 'application/json',
  });
  response.end();
};

const getLinks = (request, response, params) => {
  let responseObj = linknote;
  if (params != null) {
    for (let i = 0; i < linknote.links.length; i += 1) {
      if (linknote.links[i].name === params.name) {
        responseObj = linknote.links[i];
      }
    }
  }
  sendJSONResponse(request, response, 200, responseObj);
};

const addLink = (request, response, body) => {
  // here we are assuming an error, pessimistic aren't we?
  let responseCode = 400; // 400=bad request
  const responseJSON = {
    id: 'missingParams',
    message: 'name and age are both required',
  };

  // missing name or age?
  if (!body.name || !body.link) {
    return sendJSONResponse(request, response, responseCode, responseJSON);
  }

  // we DID get a name and age
  // if (linknote.links[linknote.links.length]) { // if the user exists
  //  responseCode = 204;
  //  linknote.links[linknote.links.length].link = body.link; // update
  //  return sendJSONResponseMeta(request, response, responseCode);
  // }

  // if the user does not exist
  linknote.links[linknote.counter.number] = {}; // make a new user
  // initialize values
  linknote.links[linknote.counter.number].name = body.name;
  linknote.links[linknote.counter.number].link = body.link;
  linknote.links[linknote.counter.number].note = body.note;
  linknote.links[linknote.counter.number].color = body.color;

  responseCode = 201; // send "created" status code
  responseJSON.id = linknote.links[linknote.counter.number].name;
  responseJSON.message = 'Created Successfully';
  linknote.counter.number += 1;
  return sendJSONResponse(request, response, responseCode, responseJSON);
};

module.exports.getLinks = getLinks;
module.exports.addLink = addLink;