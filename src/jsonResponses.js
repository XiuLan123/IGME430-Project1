const linknote = {
  links: [{
      link: 'https://people.rit.edu/jz2728',
      name: 'My first links',
      note: 'This is the default link',
      color: '#FFFFFF',
    },
    {
      link: 'https://people.rit.edu/jz2728',
      name: 'My first linkss',
      note: 'This is the default link',
      color: '#FFFFFF',
    },
    {
      link: 'https://people.rit.edu/jz2728',
      name: 'My first linksss',
      note: 'This is the default link',
      color: '#FFFFFF',
    },
  ],
};

// Source: https://stackoverflow.com/questions/2219526/how-many-bytes-in-a-javascript-string/29955838
// Refactored to an arrow function by ACJ
const getBinarySize = (string) => Buffer.byteLength(string, 'utf8');

const sendJSONResponse = (request, response, responseCode, object) => {
  response.writeHead(responseCode, {
    'Content-Type': 'application/json',
  });
  response.write(JSON.stringify(object));
  response.end();
};

const sendXMLResponse = (request, response, responseCode, object) => {
  response.writeHead(responseCode, {
    'Content-Type': 'text/xml',
  });
  response.write(object);
  response.end();
};

const getLinks = (request, response, params) => {
  let responseObj = [];

  if (params === undefined) {
    responseObj = linknote;
  } else if (params.name !== undefined && linknote.links.length !== 0) {
    if (params.name === 'random') {
      responseObj.push(linknote.links[Math.floor(Math.random() * linknote.links.length)]);
    } else {
      for (let i = 0; i < linknote.links.length; i += 1) {
        if (linknote.links[i].name.includes(params.name.toString())) {
          responseObj.push(linknote.links[i]);
        }
      }
    }
  } else {
    responseObj = linknote;
  }

  sendJSONResponse(request, response, 200, responseObj);
};

const getLinksLenght = (request, response, params) => {
  let responseObj = [];

  if (params === undefined) {
    responseObj = linknote;
  } else if (params.name !== undefined && linknote.links.length !== 0) {
    if (params.name === 'random') {
      responseObj.push(linknote.links[Math.floor(Math.random() * linknote.links.length)]);
    } else {
      for (let i = 0; i < linknote.links.length; i += 1) {
        if (linknote.links[i].name.includes(params.name.toString())) {
          responseObj.push(linknote.links[i]);
        }
      }
    }
  } else {
    responseObj = linknote;
  }

  return JSON.stringify(responseObj);
};

const getLinksXML = (request, response) => {
  let xmlObj;
  let xmlList = `
  <links>
  `;

  for (let i = 0; i < linknote.links.length; i += 1) {
    const responseObj = linknote.links[i];
    xmlObj = `
    <linkobj>
      <link>${responseObj.link}</link>
      <name>${responseObj.name}</name>
      <note>${responseObj.note}</note>
      <color>${responseObj.color}</color>
    </linkObj>
    `;
    xmlList += xmlObj;
  }
  xmlList += '</links>';

  sendXMLResponse(request, response, 200, xmlList);
};

const getLinksXMLLenght = () => {
  let xmlObj;
  let xmlList = `
  <links>
  `;

  for (let i = 0; i < linknote.links.length; i += 1) {
    const responseObj = linknote.links[i];
    xmlObj = `
    <linkobj>
      <link>${responseObj.link}</link>
      <name>${responseObj.name}</name>
      <note>${responseObj.note}</note>
      <color>${responseObj.color}</color>
    </linkObj>
    `;
    xmlList += xmlObj;
  }
  xmlList += '</links>';
  return xmlList;
};

const sendJSONResponseHeaders = (request, response, responseCode) => {
  response.writeHead(responseCode, {
    'Content-Type': 'application/json',
    'Content-Length': getBinarySize(getLinksLenght()),
  });
  response.end();
};

const sendXMLResponseHeaders = (request, response, responseCode) => {
  response.writeHead(responseCode, {
    'Content-Type': 'text/xml',
    'Content-Length': getBinarySize(getLinksXMLLenght()),
  });
  response.end();
};

const addLink = (request, response, body) => {
  // here we are assuming an error, pessimistic aren't we?
  let responseCode = 400; // 400=bad request
  const responseJSON = {
    id: 'missingParams',
    message: 'Name, age and link are required',
  };

  // missing name or age?
  if (!body.name || !body.link || !body.note || !body.color) {
    return sendJSONResponse(request, response, responseCode, responseJSON);
  }

  for (let i = 0; i < linknote.links.length; i += 1) {
    if (linknote.links[i].name === body.name) {
      linknote.links[i].link = body.link;
      linknote.links[i].note = body.note;
      linknote.links[i].color = body.color;
      i = linknote.links.length;

      responseCode = 204;
      return sendJSONResponse(request, response, responseCode, responseJSON);
    }
  }

  // if the user does not exist
  const newItem = {
    link: body.link,
    name: body.name,
    note: body.note,
    color: body.color,
  };
  linknote.links.push(newItem);

  responseCode = 201; // send "created" status code
  responseJSON.id = body.name;
  responseJSON.message = 'Link Created Successfully';
  return sendJSONResponse(request, response, responseCode, responseJSON);
};

const deleteLink = (request, response, body) => {
  for (let i = 0; i < linknote.links.length; i += 1) {
    if (body.name === linknote.links[i].name) {
      linknote.links.splice(i, 1);
    }
  }
  return sendJSONResponse(request, response, 200, 'Deleted');
};

const getLinkResponse = (request, response, params, acceptedTypes, httpMethod) => {
  if (httpMethod === 'HEAD') {
    if (acceptedTypes === 'text/xml') {
      sendXMLResponseHeaders(request, response, 200);
    } else {
      sendJSONResponseHeaders(request, response, 200);
    }
  }

  if (httpMethod === 'GET') {
    if (acceptedTypes === 'text/xml') {
      getLinksXML(request, response, params);
    } else {
      getLinks(request, response, params);
    }
  }
};

module.exports.getLinkResponse = getLinkResponse;
module.exports.addLink = addLink;
module.exports.deleteLink = deleteLink;