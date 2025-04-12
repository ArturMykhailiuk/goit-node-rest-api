import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

import ctrlWrapper from "../helpers/ctrlWrapper.js";

const getAllContacts = async (req, res) => {
  const { page = 1, limit = 20, favorite } = req.query;
  const offset = (page - 1) * limit;

  const filter = {};
  if (favorite !== undefined) {
    filter.favorite = favorite === "true";
  }
  const data = await contactsService.listContacts({
    limit: +limit,
    offset: +offset,
    filter,
  });

  res.json({
    page: +page,
    limit: +limit,
    total: data.count,
    contacts: data.rows,
  });
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const data = await contactsService.getContactById(id);

  if (!data) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.json(data);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const contact = await contactsService.getContactById(id);

  if (!contact) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  await contactsService.removeContact(id);

  res.status(200).json(contact);
};

const createContact = async (req, res) => {
  const data = await contactsService.addContact(req.body);

  res.status(201).json(data);
};

const updateContact = async (req, res) => {
  const { id } = req.params;

  const data = await contactsService.updateContact(id, req.body);

  if (!data) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.json(data);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;

  const updatedContact = await contactsService.updateStatusContact(id, {
    favorite,
  });

  if (!updatedContact) {
    throw HttpError(404, "Contact not found");
  }

  res.status(200).json(updatedContact);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
