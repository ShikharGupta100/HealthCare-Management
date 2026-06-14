
const multer = require("multer")
const multerstorageCloudinay = require("multer-storage-cloudinary")
const cloudinary = require("../config/cloudinary")
const {CloudinaryStorage} = require("multer-storage-cloudinary")
const Storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"doctors",
        allowed_formats:["jpg","png","jpeg"]
    }
})
const upload = multer({storage:Storage})
module.exports = upload