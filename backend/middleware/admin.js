function admin(req, res, next) {
    try {

        if (!req.user || req.user.role !== "admin") {
            return res.json({
                message: "Access denied. Admin only"
            });
        }

        next();

    } catch (error) {
        res.json({
            message: error.message
        });
    }
}

module.exports = admin;