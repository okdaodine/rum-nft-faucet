module.exports = (item) => {
  const { type, object } = item.Data;
  if (type === 'Create' && object.type === 'Note' && !object.inreplyto) {
    return 'post';
  }
  if (type === 'Create' && object.type === 'Note' && object.inreplyto) {
    return 'comment';
  }
  if (type === 'Like' || type === 'Dislike') {
    return 'like';
  }
  if (type === 'Create' && object.type === 'Person') {
    return 'profile';
  }
};