import { Router } from 'express';
import { isAdminMiddleWare } from '../middlewares/auth';
import { validateCategoryUpdateBody, validateCreateCategoryBody } from '../middlewares/validators/category-validator';
import { createNewCategory, getCategories, removeCategory, updateCategory } from '../controllers/category';
import { validateObjectIdParameter } from '../middlewares/validators/common-validators';

export const categoryRouter = Router();

//@ts-ignore
categoryRouter.get('/', getCategories);
//@ts-ignore
categoryRouter.post('/', isAdminMiddleWare, validateCreateCategoryBody, createNewCategory);
//@ts-ignore
categoryRouter.put('/:id', isAdminMiddleWare, validateObjectIdParameter, validateCategoryUpdateBody, updateCategory);
//@ts-ignore
categoryRouter.delete('/:id', isAdminMiddleWare, validateObjectIdParameter, removeCategory);
