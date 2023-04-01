export const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      default: 'main-hero-text',
    },
    text: {
      type: 'string',
      default: 'Текст рыба текст рыба',
    },
    group: {
      type: 'string',
      default: 'main-page',
    },
    file: {
      type: 'string',
      format: 'binary',
    },
  },
};
