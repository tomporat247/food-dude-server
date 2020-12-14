import { Router } from 'express';
import { isAdminMiddleWare } from '../middlewares/authentication';
import { validateCategoryUpdateBody, validateCreateCategoryBody } from '../middlewares/validators/category-validator';
import { createNewCategory, removeCategory, updateCategory } from '../controllers/category';

export const categoryRouter = Router();

//@ts-ignore
categoryRouter.post('/', isAdminMiddleWare, validateCreateCategoryBody, createNewCategory);
//@ts-ignore
categoryRouter.put('/:name', isAdminMiddleWare, validateCategoryUpdateBody, updateCategory);
categoryRouter.delete('/:name', isAdminMiddleWare, removeCategory);
