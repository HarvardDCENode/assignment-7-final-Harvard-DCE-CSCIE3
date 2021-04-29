var multer = require('multer');
var Photo = require('../models/photoModel');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/img');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const imageFilter = function(req, file, cb) {
  if (file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)){
    cb(null, true);
  }  else {
    cb(new Error("OnlyImageFilesAllowed"), false);
 }
}

class PhotoService{
  //  list
  static list(){
    return Photo.find({})
      .then((photos)=>{
        // found
        return photos;
      });
  }

  // find
  static find(id){
    return Photo.findById(id)
      .then((photo)=>{
        // found
        return photo;
      });
  }

  //   create
  static create(obj){
      var photo = new Photo(obj);
      return photo.save();
    }

  //   update
  static update(id, data){
      return Photo.findById(id)
       .then((photo)=>{
         photo.set(data);
         photo.save();
         return photo;
       });
  }

  //  delete
  static delete(id){
    return Photo.remove({_id: id})
      .then((obj)=>{
        //removed
        return obj;
      })
  }
}

module.exports.storage = storage;
module.exports.imageFilter = imageFilter;
module.exports.PhotoService = PhotoService;
