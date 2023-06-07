const permissions = {
  employees: {
    read: ['president', 'manager', 'leader'],
    create: ['president', 'manager'],
    update: ['president', 'manager'],
    delete: ['president'],
  },
  customers: {
    read: ['president', 'manager', 'leader', 'staff'],
    create: ['president', 'manager', 'leader'],
    update: ['president', 'manager', 'leader'],
    delete: ['president', 'manager', 'leader'],
  },
};
module.exports = permissions;
