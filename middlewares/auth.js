// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// // 1st middleware -> Authentication
// exports.auth = (req, res, next) => {
//     try {
//         // Extracting the JWT token from headers
//         const token = req.headers.authorization;

//         // In case of token missing
//         if (!token) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Token is missing'
//             });
//         }

//         // Verifying the token
//         try {
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             req.user = decoded; // Storing token credentials in the request for further authorization
//         } catch (error) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Token is invalid',
//             });
//         }
//         next();

//     } catch (error) {
//         return res.status(401).json({
//             success: false,
//             message: 'Something went wrong while verifying the token',
//         });
//     }
// };

// // 2nd middleware -> Authorization for student route
// exports.isStudent = (req, res, next) => {
//     try {
//         if (req.user.role !== "Student") {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Access denied. This route is protected for students',
//             });
//         }

//         next();
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: 'User role is not matched for student'
//         });
//     }
// };

// // 3rd middleware -> Authorization for admin route
// exports.isAdmin = (req, res, next) => {
//     try {
//         if (req.user.role !== "Admin") {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Access denied. This route is protected for admins',
//             });
//         }

//         next();
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: 'User role is not matched for admin'
//         });
//     }
// };



// auth, isStudent,isAdmin

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req,res, next) => {
    try{
        //extracting JWT token
        console.log("cookie", req.cookies.token);
        console.log("body", req.body.token);
        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", ""); // or we can extract jwt tokens from req.cookies.token or from header of the payload req.header("Authorization").replace("Bearer", " ");

        if(!token) {
            return res.status(401).json({
                success:false,
                message:'Token Missing',
            });
        }

        //verify the token
        try{
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log(payload);
            //why this ?
            req.user = payload;
        } catch(error) {
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
        }
        next();
    } 
    catch(error) {
        return res.status(401).json({
            success:false,
            message:'Something went wrong, while verifying the token',
        });
    }
   
}


exports.isStudent = (req,res,next) => {
    try{
            if(req.user.role !== "Student") {
                return res.status(401).json({
                    success:false,
                    message:'THis is a protected route for admin',
                });
            }
            next();
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:'User Role is not matching',
        })
    }
}

exports.isAdmin = (req,res,next) => {
    try{
        if(req.user.role !== "Admin") {
            return res.status(401).json({
                success:false,
                message:'THis is a protected route for student',
            });
        }
        next();
}
catch(error) {
    return res.status(500).json({
        success:false,
        message:'User Role is not matching',
    })
}
}