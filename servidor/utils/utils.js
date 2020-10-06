var utils = {};

utils.getResponse = function(code, message, error) {
	var response = {
      code:  code,
		  error: error,
		  message: message
    }
    return response;
};

utils.isInt = function(number) {
  return (number !=null ) ? /^[0-9]+?$/.test(number) : false;
}

utils.isFloat = function(number) {
  return (number != null) ? /^[0-9]+[\.]?[0-9]{1,2}$/.test(number) : false;
}

module.exports = utils;