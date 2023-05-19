const curDate = () => {
    var dateTime = require("node-datetime");
    var dt = dateTime.create();
    var formatted = dt.format("Y-m-d H:M:S");
    return formatted;
};

module.exports = {
    curDate,
};
