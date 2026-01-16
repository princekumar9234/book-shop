// Protect routes
exports.protect = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/auth/login');
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.session.user.role)) {
            return res.status(403).render('error', {
                message: `User role ${req.session.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};
