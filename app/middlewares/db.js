module.exports = (db) => {
    return (req, res, next) => {
        req.db = db;
        next();
    };
}