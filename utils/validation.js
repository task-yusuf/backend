function validateTodoInput(data) {
  if (!data.title) {
    throw new Error('Title is required');
  }
  if (data.title.length > 255) {
    throw new Error('Title must be less than 255 characters');
  }
  return true;
}

module.exports = {
  validateTodoInput
};
