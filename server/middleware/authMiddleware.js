const authMiddleware = (req, res, next) => {
    // 인증 로직을 여기에 추가
    next();
  };
  
  module.exports = authMiddleware;