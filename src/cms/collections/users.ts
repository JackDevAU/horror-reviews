import type { CollectionConfig } from 'payload'

export const UsersCollection: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    delete: () => false,
    update: () => true,
  },
  fields: [
    {
      type: 'text',
      name: 'username',
      defaultValue: 'Anonymous',
    },
  ],
}
