import { Router } from 'express';

import * as contactControllers from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../utils/validateBody.js';
import { parsePaginationParams } from '../middlewares/parsePaginationParams.js';
import { parseSortParamsDecorator } from '../utils/parseSortParamsDecorator.js';
import { sortByListContact } from '../db/models/Contact.js';
import {
  contactAddSchema,
  contactUpdateSchema,
} from '../validation/contacts.js';

const contactsRouter = Router();

contactsRouter.get(
  '/',
  parsePaginationParams,
  parseSortParamsDecorator(sortByListContact),
  ctrlWrapper(contactControllers.getContactsController)
);

contactsRouter.get(
  '/:id',
  isValidId,
  ctrlWrapper(contactControllers.getContactByIdController)
);

contactsRouter.post(
  '/',
  validateBody(contactAddSchema),
  ctrlWrapper(contactControllers.addContactController)
);

contactsRouter.put(
  '/:id',
  validateBody(contactAddSchema),
  ctrlWrapper(contactControllers.upsertContactController)
);

contactsRouter.patch(
  '/:id',
  validateBody(contactUpdateSchema),
  ctrlWrapper(contactControllers.patchContactController)
);

contactsRouter.delete(
  '/:id',
  ctrlWrapper(contactControllers.deleteContactController)
);

export default contactsRouter;
