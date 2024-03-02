const express = require('express');
const router = express.Router();

const { accessLevelVerifier, isAdminVerifier, authenticationVerifier } = require('../middlewares/verifyToken');
const { UserController } = require('../controllers');


router.get('/profile/my', authenticationVerifier, UserController.getProfile);
router.put('/profile/pass', authenticationVerifier, UserController.updatePass);
router.put('/profile', authenticationVerifier, UserController.update_user);


// admin
router.get('/admin', isAdminVerifier, UserController.get_users); // get user admin
router.get('/admin/:id', isAdminVerifier, UserController.get_user); // get user by id admin
router.delete('/admin/:id', isAdminVerifier, UserController.delete_user); // delete user by id admin
router.post('/admin', isAdminVerifier, UserController.create_usr_adm);    // create new user admin 
router.put('/admin/:id', isAdminVerifier, UserController.update_user_adm);    // update info of a user admin
// router.get('/stats', isAdminVerifier, UserController.get_stats);

module.exports = router;