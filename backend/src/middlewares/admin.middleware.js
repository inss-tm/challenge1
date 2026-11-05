const admin = (req, res, next) => {

    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            error: "Access denied. Admin only."
        });
    }

    next();
};

export default admin;