export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const filterLettersByStatus = (letters, status) => {
  return letters.filter(letter => letter.status === status);
};

export const getUserInitials = (name) => {
  return name.split(' ').map(part => part[0]).join('').toUpperCase();
};