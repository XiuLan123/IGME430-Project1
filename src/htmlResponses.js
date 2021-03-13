const fs = require('fs');

const linkSubmitClientPage = fs.readFileSync(`${__dirname}/../client/link-submit-client.html`);
const linksClientPage = fs.readFileSync(`${__dirname}/../client/links-client.html`);
const homeClientPage = fs.readFileSync(`${__dirname}/../client/home-client.html`);
const errorPage = fs.readFileSync(`${__dirname}/../client/error.html`);
const adminClientPage = fs.readFileSync(`${__dirname}/../client/admin-client.html`);

const get404Response = (request, response) => {
  response.writeHead(404, {
    'Content-Type': 'text/html',
  });
  response.write(errorPage);
  response.end();
};

const getLinksClientResponse = (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/html',
  });
  response.write(linksClientPage);
  response.end();
};

const getLinkSubmitClientPageResponse = (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/html',
  });
  response.write(linkSubmitClientPage);
  response.end();
};

const getHomeClientResponse = (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/html',
  });
  response.write(homeClientPage);
  response.end();
};

const getAdminClientPage = (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/html',
  });
  response.write(adminClientPage);
  response.end();
};

module.exports.get404Response = get404Response;
module.exports.getLinksClientResponse = getLinksClientResponse;
module.exports.getLinkSubmitClientPageResponse = getLinkSubmitClientPageResponse;
module.exports.getHomeClientResponse = getHomeClientResponse;
module.exports.getAdminClientPage = getAdminClientPage;
