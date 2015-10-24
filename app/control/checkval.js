module.exports = {
 check : function(req) {
	if (req.body) {
			if (req.body.materiale) {
				if (req.body.matricola) {
					if (req.body.cop && req.body.cop==("coil"||"pacco")) {
						return true;
					}
				}
			}
		
	}
	return false;
	}
}