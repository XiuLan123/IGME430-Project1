const linknote = {
  links: [{
    link: 'https://google.com',
    name: 'Google',
    note: 'This is google',
    color: '#229453',
  }, ],
};

// Source: https://stackoverflow.com/questions/2219526/how-many-bytes-in-a-javascript-string/29955838
// Refactored to an arrow function by ACJ
const getBinarySize = (string) => Buffer.byteLength(string, 'utf8');

// Get the the json content
const sendJSONResponse = (request, response, responseCode, object) => {
  response.writeHead(responseCode, {
    'Content-Type': 'application/json',
  });
  response.write(JSON.stringify(object));
  response.end();
};

// Send the the XML content
const sendXMLResponse = (request, response, responseCode, object) => {
  response.writeHead(responseCode, {
    'Content-Type': 'text/xml',
  });
  response.write(object);
  response.end();
};

// Get the the json content
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

// Get the content-lenght for json content
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

// Get the the XML content
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

// Get the content-lenght for xml content
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

// Send json headers when it is head request
const sendJSONResponseHeaders = (request, response, responseCode) => {
  response.writeHead(responseCode, {
    'Content-Type': 'application/json',
    'Content-Length': getBinarySize(getLinksLenght()),
  });
  response.end();
};

// Send XML headers when it is head request
const sendXMLResponseHeaders = (request, response, responseCode) => {
  response.writeHead(responseCode, {
    'Content-Type': 'text/xml',
    'Content-Length': getBinarySize(getLinksXMLLenght()),
  });
  response.end();
};

// Add link to the database
const addLink = (request, response, body) => {
  let responseCode = 400;
  const responseJSON = {
    id: 'missingParams',
    message: 'Name, age and link are required',
  };

  // missing anything?
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

  // if the link does not exist
  const newItem = {
    link: body.link,
    name: body.name,
    note: body.note,
    color: body.color,
  };
  linknote.links.push(newItem);

  responseCode = 201;
  responseJSON.id = body.name;
  responseJSON.message = 'Link Created Successfully';
  return sendJSONResponse(request, response, responseCode, responseJSON);
};

// Delete link in admin
const deleteLink = (request, response, body) => {
  for (let i = 0; i < linknote.links.length; i += 1) {
    if (body.name === linknote.links[i].name) {
      linknote.links.splice(i, 1);
    }
  }
  return sendJSONResponse(request, response, 200, 'Deleted');
};

// Check to see if it is head or post request
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