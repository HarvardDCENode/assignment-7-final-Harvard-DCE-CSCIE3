//api-photos.js
var express = require('express');
var router = express.Router();
var multer = require('multer');
var photoController = require('../../controllers/photoController');
var upload = multer({
  storage: photoController.storage,
  fileFilter: photoController.imageFilter
});
const PhotoService = photoController.PhotoService;

router.use((req, res, next)=>{
  res.set({
    // Allow AJAX access from any domain
    'Access-Control-Allow-Origin':'*',
    // Allow methods and headers for 'preflight'
    'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,OPTIONS',
    "Access-Control-Allow-Headers": "Origin, Content-Type, Access-Control-Allow-Headers, Accept, Authorization, X-Request-With",
     // Set content-type for all api requests
     //  Can be removed if all api responses are changed to use res.json()
     //  in place of res.send()
    'Content-type':'application/json'
  });
  if(req.method == 'OPTIONS'){
    return res.status(200).end();
  }
  next();
})
// photos - list
router.get('/', (req, res, next)=>{
  PhotoService.list()
    .then((photos)=>{
      console.log(`API: Found images: ${photos}`);
      res.status(200);
      res.json(photos);
    })
});

// photos/:photoid - find
router.get('/:photoid', (req, res, next)=>{
   PhotoService.find(req.params.photoid)
    .then((photo)=>{
      console.log(`API: Found images: ${photo}`);
      res.status(200);
      res.json(photo);
    }).catch((err)=>{
  });
});

// photos  POST  create
router.post('/', upload.single('image'), async (req, res, next)=>{
  var path = "/static/img/" + req.file.filename;

  var photo  = {
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    imageurl: path,
    title: req.body.title,
    filename: req.file.filename,
    description: req.body.description,
    size: req.file.size / 1024 | 0
  }

  try{
     const photoSave = await PhotoService.create(photo);
     res.status(201);
     res.send(JSON.stringify(photoSave));
   }catch(err){
     console.log(err);
     throw new Error("PhotoSaveError", photo);
   }

});

// /photos/:photoid PUT - update
router.put('/:photoid', (req, res, next)=>{
  console.log(`putting ${req.params.photoid}`);
  let putdata = req.body;
  PhotoService.update(req.params.photoid, putdata)
    .then((updatedPhoto)=>{
      console.log(`updated: ${updatedPhoto}`);
      res.status(200);
      res.send(JSON.stringify(updatedPhoto));
    }).catch((err)=> {
      res.status(404);
      res.end();
    });
 });

// /photos/:photoid DELETE - delete
router.delete('/:photoid', (req, res, next)=>{
  PhotoService.delete(req.params.photoid)
    .then((photo) => {
     console.log(`deleted: ${photo}`);
     res.status(200);
     res.send(JSON.stringify(photo));
   }).catch((err)=> {
     res.status(404);
     res.end();
   });;
});

module.exports = router;
