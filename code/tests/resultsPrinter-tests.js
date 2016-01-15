'use strict';

const resultsPrinter = require('../resultsPrinter.js');

describe('the results printer', function () {
	describe('the map function', function () {
		it('should prefix an item\'s message with the configured bullet', function () {
			const item = { message: 'Some message' };
			const mappedItem = resultsPrinter._map(item);

			expect(mappedItem).to.equal('* Some message');
		});
	});

	describe('the mapWithDetails function', function () {
		it('should print the line and column of the item', function () {
			const item = { 
				message: 'Some message',
				lastLine: 4,
				lastColumn: 20
			};
			
			const mappedItem = resultsPrinter._mapWithDetails(item);

			expect(mappedItem).to.equal('* Some message - Line 4, Column 20');
		});
	});
});