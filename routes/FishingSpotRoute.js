import express from 'express';
import multer from 'multer';
import Fishing from '../controllers/FishingSpotController.js';

const router = express.Router();

// Setup multer untuk upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // folder tempat menyimpan file, pastikan folder ini ada
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Route POST create dengan upload single file field "image"
router.post('/create', upload.single('image'), Fishing.create);

router.get('/', Fishing.getAll);
router.get('/show/:id', Fishing.getById);
router.put('/update/:id', Fishing.update);
router.delete('/delete/:id', Fishing.delete);

export default router;
