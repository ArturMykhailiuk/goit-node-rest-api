import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

import ctrlWrapper from "../helpers/ctrlWrapper.js";

const getAllContacts = async (req, res) => {
  const data = await contactsService.listContacts();
  res.json(data);
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
  const data = await contactsService.removeContact(id);

  if (!data) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.json({
    message: "Delete successfully",
  });
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

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
};
