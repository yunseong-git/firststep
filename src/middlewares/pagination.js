export function pagination(req, res, next) {
    const page = parseInt(req.query.page) || 1; // 기본 1페이지
    const limit = parseInt(req.query.limit) || 10; // 기본 10개씩
    req.pagination = { skip: (page - 1) * limit, limit };
    next();
}