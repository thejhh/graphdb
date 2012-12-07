
/* Simple block-based file storage for Copy on Write implementations */

var q = require('q');
var File = require('./File.js');
var mod = module.exports = {};

/* Restat index and data files for DataFile and IndexFile */
mod.restat = function do_restat(self) {
	self._stat = q.spread([
		self._fd.then(function(f) {
			return f.fstat();
		}),
		File.stat(self._data_file)
	], function(index_stats, data_stats) {
		index_stats.count_of_indices = Math.floor(index_stats.size/self.index_size);
		index_stats.data = data_stats;
		return index_stats;
	});
	return self._stat;
};

/* EOF */
