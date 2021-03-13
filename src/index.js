const http = require('http');

const url = require('url');
const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const mediaHandler = require('./mediaResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getHomeClientResponse,
  '/link-submit': htmlHandler.getLinkSubmitClientPageResponse,
  '/links-client': htmlHandler.getLinksClientResponse,
  '/home-client': htmlHandler.getHomeClientResponse,
  '/admin-client': htmlHandler.getAdminClientPage,
  '/get-links': jsonHandler.getLinkResponse,
  '/get-icon': mediaHandler.getIconResponse,
  '/get-logo': mediaHandler.getLogoResponse,
  '/get-style': mediaHandler.getStyleResponse,
  notFound: htmlHandler.get404Response,
};

const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/add-link') {
    const body = [];

    // https://nodejs.org/api/http.html
    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);
      jsonHandler.addLink(request, response, bodyParams);
    });
  }

  if (parsedUrl.pathname === '/delete-link') {
    const body = [];

    // https://nodejs.org/api/http.html
    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);
      jsonHandler.deleteLink(request, response, bodyParams);
    });
  }
};

const onRequest = (request, response) => {
  let acceptedTypes = request.headers.accept && request.headers.accept.split(',');
  acceptedTypes = acceptedTypes || [];

  const parsedUrl = url.parse(request.url);
  const {
    pathname,
  } = parsedUrl;

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
    return;
  }

  const params = query.parse(parsedUrl.query);
  const httpMethod = request.method;

  if (urlStruct[pathname]) {
    urlStruct[pathname](request, response, params, acceptedTypes[0], httpMethod);
  } else {
    urlStruct.notFound(request, response);
  }
};

http.createServer(onRequest).listen(port);
