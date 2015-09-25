module.exports = {
  name: 'github-universe',
  version: 5,
  objects: [
    {
      name: 'permissions',
      indexes: [],
    },
    {
      name:  'user',
    },
    {
      name: 'results',
      indexes: [
        { name: 'owner' },
      ],
    },
  ],
};
