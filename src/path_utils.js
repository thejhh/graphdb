
/* */

var path = require('path');

var mod = module.exports = {};

mod.resolve_data_path = function resolve_data_path(p) {
	var e = path.extname(p);
	if(e === ".index") return path.resolve(path.dirname(p), path.basename(p, e) + ".json");
	return path.resolve(path.dirname(p), path.basename(p));
};

mod.resolve_index_path = function resolve_index_path(p) {
	return path.resolve(path.dirname(p), path.basename(p, path.extname(p)) + ".index");
};

/* EOF */
