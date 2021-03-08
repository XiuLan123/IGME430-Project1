const fs = require('fs');

const icon = fs.readFileSync(`${__dirname}/../media/favicon.ico`);
const logo = fs.readFileSync(`${__dirname}/../media/logo.png`);
const style = fs.readFileSync(`${__dirname}/../media/default-styles.css`);

const getIconResponse = (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'image/x-icon',
  });
  response.write(icon);
  response.end();
};

const getLogoResponse = (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'image/png',
  });
  response.write(logo);
  response.end();
};

const getStyleResponse = (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/css',
  });
  response.write(style);
  response.end();
};

module.exports.getLogoResponse = getLogoResponse;
module.exports.getIconResponse = getIconResponse;
module.exports.getStyleResponse = getStyleResponse;
