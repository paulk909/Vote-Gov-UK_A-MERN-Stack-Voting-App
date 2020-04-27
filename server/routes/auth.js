const router = require('express').Router();

const handle = require('../handlers');

router.post('/register', handle.register);
router.post('/login', handle.login);

router.post('/adminregister', handle.adminRegister);
router.post('/adminlogin', handle.adminLogin);

module.exports = router;