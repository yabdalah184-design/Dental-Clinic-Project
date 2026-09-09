const STORAGE_KEY = 'clinic_contact_messages';

function getLocalContacts() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  const defaultContacts = [
    {
      id: 1,
      name: 'Tarek Zaki',
      phone: '01011223344',
      email: 'tarek.zaki@example.com',
      message: 'Hello, what are your working hours on Saturdays?',
      createdAt: '2026-09-02T11:00:00Z',
    },
    {
      id: 2,
      name: 'Mona Salem',
      phone: '01299887766',
      email: 'mona.salem@example.com',
      message: 'Do you offer installment plans for Hollywood Smile veneers?',
      createdAt: '2026-09-03T15:30:00Z',
    },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultContacts));
  return defaultContacts;
}

function saveLocalContacts(contacts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

export const contactService = {
  getMessages() {
    return getLocalContacts();
  },

  submitMessage(data) {
    const list = getLocalContacts();
    const newMessage = {
      ...data,
      id: list.length > 0 ? Math.max(...list.map((m) => m.id)) + 1 : 1,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newMessage);
    saveLocalContacts(list);
    return newMessage;
  },

  deleteMessage(id) {
    const numericId = Number(id);
    const list = getLocalContacts().filter((m) => m.id !== numericId);
    saveLocalContacts(list);
    return true;
  },
};
