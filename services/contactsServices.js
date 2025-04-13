import Contact from "../db/models/Contacts.js";

export const listContacts = (query) => {
  console.log("query", query);
  return Contact.findAndCountAll({
    where: query.filter,
    limit: query.limit,
    offset: query.offset,
  });
};

export const getContactById = (id) => Contact.findByPk(id);

export const getContact = (query) =>
  Contact.findOne({
    where: query,
  });

export const addContact = (data) => Contact.create(data);

export const updateContact = async (query, data) => {
  const contact = await getContact(query);
  if (!contact) return null;

  return contact.update(data, {
    returning: true,
  });
};

export const removeContact = (query) =>
  console.log("query", query) ||
  Contact.destroy({
    where: query,
  });

export const updateStatusContact = async (query, body) => {
  const [updatedRowsCount, [updatedContact]] = await Contact.update(body, {
    where: query,
    returning: true,
  });

  if (updatedRowsCount === 0) {
    return null;
  }
  return updatedContact;
};
