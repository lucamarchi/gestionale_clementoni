module.exports = {
 check : function(req) {
	if (req.body) {
			if (req.body.numOrdine) {
				return true;
				}
	}	
	return false;
}
}