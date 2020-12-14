import { Router } from 'express';
import { isAdminMiddleWare } from '../middlewares/authentication';
import { validateCategoryUpdateBody, validateCreateCategoryBody } from '../middlewares/validators/category-validator';
import { createNewCategory, removeCategory, updateCategory } from '../controllers/category';

export const categoriesRouter = Router();

//@ts-ignore
categoriesRouter.post('/', isAdminMiddleWare, validateCreateCategoryBody, createNewCategory);
//@ts-ignore
categoriesRouter.put('/:name', isAdminMiddleWare, validateCategoryUpdateBody, updateCategory);
categoriesRouter.delete('/:name', isAdminMiddleWare, removeCategory);
