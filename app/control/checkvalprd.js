	module.exports = {
	 check : function(req) {
		if (req.body) {
			if (req.body.orderId) {
				if (req.body.materiale) {
					if (req.body.matricola) {
						if (req.body.cop && (req.body.cop=='coil' || req.body.cop=='pacco')) {
							return true;
						}
					}
				}
			}	
		}
		return false;
		}
	}