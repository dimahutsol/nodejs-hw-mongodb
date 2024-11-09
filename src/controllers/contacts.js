import createHttpError from 'http-errors';
import * as path from 'node:path';

import * as contactServices from '../services/contacts.js';

import { saveFileToUploadsDir } from '../utils/saveFileToUploadsDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';
const enable_cloudinary = env('ENABLE_CLOUDINARY') === 'true';

export const getContactsController = async (req, res) => {
  const { page, perPage, sortBy, sortOrder } = req.query;

  const data = await contactServices.getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { id } = req.params;
  const data = await contactServices.getContactById(id);

  if (!data) {
    throw createHttpError(404, `Contact not found`);
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data,
  });
};

export const addContactController = async (req, res) => {
  const userId = req.user._id;

  let photo = '';
  if (req.file) {
    if (enable_cloudinary) {
      photo = await saveFileToCloudinary(req.file);
    } else {
      await saveFileToUploadsDir(req.file, 'photos');
      photo = path.join('photos', req.file.filename);
    }
  }

  const data = await contactServices.addContact({ ...req.body, photo, userId });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const upsertContactController = async (req, res) => {
  const { id } = req.params;
  const { data, isNew } = await contactServices.updateContactById(
    id,
    req.body,
    {
      upsert: true,
    }
  );

  const status = isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'Contact has upserted successfully',
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { id } = req.params;

  let photo = '';
  if (req.file) {
    if (enable_cloudinary) {
      photo = await saveFileToCloudinary(req.file);
    } else {
      await saveFileToUploadsDir(req.file, 'photos');
      photo = path.join('photos', req.file.filename);
    }
  }

  const result = await contactServices.updateContactById(id, {
    photo,
    ...req.body,
  });

  if (!result) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.data,
  });
};

export const deleteContactController = async (req, res) => {
  const { id } = req.params;
  const data = await contactServices.deleteContactById(id);

  if (!data) {
    throw createHttpError(404, `Contact not found`);
  }

  res.status(204).send();
};
