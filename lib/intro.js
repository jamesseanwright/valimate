'use strict';

const logo = `
▒   ▒  ▒   ▒   ▒  ▒ ▒    ▒   ▒▒▒ ▒▒▒
 ▒ ▒  ▒ ▒  ▒   ▒ ▒ ▒ ▒  ▒ ▒   ▒  ▒
  ▒  ▒   ▒ ▒▒▒ ▒ ▒   ▒ ▒   ▒  ▒  ▒▒▒
`;

module.exports = function intro() {
	console.log(logo);
	console.info('Validating URLs from valimate.json...\n');
};