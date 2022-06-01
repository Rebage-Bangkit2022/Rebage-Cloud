declare namespace Express {
   export interface Request {
      userId?: number
   }
}

declare namespace Multer {
   export interface File {
      originalname: string
      buffer: Buffer
   }
}