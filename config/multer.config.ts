import path from 'path'
import fs from 'fs';
import multer from 'multer';



// 1. database fields of file should be actual file input
function configureStorage(folder: string) {
    const storage: multer.StorageEngine = multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadDir = `public/${folder}`;

            // Create uploads directory if it doesn't exist
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            cb(null, uploadDir);
        },
        // Create unique filename with original extension
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            cb(null, file.fieldname + '-' + uniqueSuffix + ext);
        }
    });


    const upload = multer({ 
      storage: storage,
      limits: {
        fileSize: 10 * 1024 * 1024 // 10MB file size limit
      }
    });

    return upload;
}


export default configureStorage;