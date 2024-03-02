const User = require('../models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const UserController = {


    /* get all users */
    async get_users(req, res) {
        try {
            const users = await User.find();
            res.status(200).json({
                type: "success",
                users
            });
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }
       
    },

    /* get single user */
    async get_user(req, res) {
        try {
            const user = await User.findById(req.params.id);
            const { password, ...data } = user._doc;
            res.status(200).json({
                type: "success",
                data
            });

        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }
    },

    /* get user stats */
    // async get_stats(req, res) {
    //     const date = new Date();
    //     const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    //     try {
    //         const data = await User.aggregate([
    //             { $match : { 
    //                 createdAt: { $gte: lastYear }
    //             }},
    //             { $project: { 
    //                 month: { $month: "$createdAt"}
    //             }},
    //             { $group : {
    //                 _id: "$month", 
    //                 total: { $sum: 1},
    //             }}
    //         ]);
    //         res.status(200).json({
    //             type: "success",
    //             data
    //         })
    //     } catch (err) {
    //         res.status(500).json({
    //             type: "error",
    //             message: "Something went wrong please try again",
    //             err
    //         })
    //     }
    // },

    /* update user */
    async update_user(req, res) {
        try {
            // Mendapatkan ID pengguna dari token
            const userId = req.user.id;
    
            // Periksa apakah ID pengguna sesuai
            if (userId !== req.user.id) {
                return res.status(403).json({
                    type: 'error',
                    message: 'You are not allowed to update this user'
                });
            }
    
            // Hashing password jika ada
            if (req.body.password) {
                req.body.password = bcrypt.hashSync(req.body.password, 10);
            }
    
            // Menggunakan findByIdAndUpdate untuk melakukan pembaruan
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $set: req.body },
                { new: true }
            );
    
            // Periksa apakah pengguna ditemukan
            if (!updatedUser) {
                return res.status(404).json({
                    type: 'error',
                    message: 'User not found'
                });
            }
    
            res.status(200).json({
                type: 'success',
                message: 'User updated successfully',
                updatedUser
            });
        } catch (err) {
            res.status(500).json({
                type: 'error',
                message: 'Something went wrong, please try again',
                err
            });
        }
    },
    


    async delete_user(req, res) {
        try {
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json({
                type: "success",
                message: "User has been deleted successfully"
            });
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }
    },

    async create_usr_adm(req, res) {

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
            isAdmin: req.body.isAdmin
        });

        try {
            const user = await newUser.save();
            res.status(201).json({
                type : 'success',
                message: "User has been created successfuly",
                user
            })
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }

    },

    async update_user_adm (req, res) {
        try {
            const findid = await User.findById(req.params.id);

            if (!findid) {
                return res.status(404).json({
                    type: 'error',
                    message: 'User not found'
                });
            }

            // Checking if the admin who wants to modify this user is authorized to do so
            if (req.userId !== req.params.id && req.userId != findid.userId) {
                return res.status(403).json({
                    type:'error',
                    message: 'You are not allowed to perform this action.'
                })
            }

            if (req.body.password) {
                req.body.password = bcrypt.hashSync(req.body.password, 10);
            }
            
            const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body ,{new: true});
            res.status(200).json({
                type: 'succes', 
                message: 'The user has been modified successfully!', 
                data: updatedUser
            })
        } catch (e) {
            res.status(400).json({type:"error",message:"Invalid data provided.",errors: e})
        }
        
    },


async getProfile(req, res) {
    let userId = req.user.id; // Pastikan mendapatkan userId dari token dengan benar

    console.log(userId)
    try {
        let user = await User.findOne({ _id: mongoose.Types.ObjectId(userId) }).select('firstname lastname username email');

        if (!user) {
            return res.status(404).send({
                type: "error",
                status: 404,
                message: "User not Found"
            });
        } else {
            return res.status(200).send({
                type: "success",
                status: 200,
                message: "Successfully retrieved profile information",
                data: user
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            type: "error",
            status: 500,
            message: "Internal Server Error"
        });
    }
},

async updatePass(req, res) {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(userId); // Sesuaikan dengan metode MongoDB yang sesuai

        if (!user || !bcrypt.compareSync(oldPassword, user.password)) {
            return res.status(401).json({
                type: "error",
                message: "Invalid credentials",
            });
        }

        if (newPassword === oldPassword) {
            return res.status(400).json({
                type: "error",
                message: "New password must be different from the old password",
            });
        }

        const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { password: hashedNewPassword },
            { new: true }
        );

        res.status(200).json({
            type: 'success',
            message: 'The user has been modified successfully!',
            data: updatedUser
        });
    } catch (e) {
        res.status(500).json({ type: "error", message: "Internal Server Error", errors: e });
    }
}

    

    
};


module.exports = UserController;