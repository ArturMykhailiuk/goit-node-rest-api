import Contact from "../db/models/Contacts.js";

export const listContacts = () => Contact.findAll();

export const getContactById = (id) => Contact.findByPk(id);

// export const getContactById = id => Contact.findOne({
//     where: {
//         id,
//     }
// });

export const addContact = (data) => Contact.create(data);

export const updateContact = async (id, data) => {
  const contact = await getContactById(id);
  if (!contact) return null;

  return contact.update(data, {
    returning: true,
  });
};

export const removeContact = (id) =>
  Contact.destroy({
    where: {
      id,
    },
  });

export const updateStatusContact = async (id, body) => {
  const [updatedRowsCount, [updatedContact]] = await Contact.update(body, {
    where: { id },
    returning: true,
  });

  if (updatedRowsCount === 0) {
    return null;
  }

  return updatedContact;
};
