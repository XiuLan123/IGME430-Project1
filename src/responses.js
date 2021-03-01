const linknote = {
  links: [
    {
      link: 'https://people.rit.edu/jz2728',
      name: 'My first link',
      note: 'This is the default link',
    },
  ],
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

const getLinks = (request, response) => {
  sendJSONResponse(request, response, 200, linknote);
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
  if (linknote.links[1]) { // if the user exists
    responseCode = 204;
    linknote.links[1].link = body.link; // update
    return sendJSONResponseMeta(request, response, responseCode);
  }

  // if the user does not exist
  linknote.links[1] = {}; // make a new user
  // initialize values
  linknote.links[1].name = body.name;
  linknote.links[1].link = body.link;
  linknote.links[1].note = body.note;

  responseCode = 201; // send "created" status code
  responseJSON.id = linknote.links[1].name;
  responseJSON.message = 'Created Successfully';
  return sendJSONResponse(request, response, responseCode, responseJSON);
};

module.exports.getLinks = getLinks;
module.exports.addLink = addLink;
