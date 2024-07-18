import { HTMLConverterFeature, lexicalEditor, lexicalHTML } from '@payloadcms/richtext-lexical'
import type { CollectionConfig, FieldHook } from 'payload'

const format = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-/]+/g, '')
    .toLowerCase()

const formatSlug =
  (fallback: string): FieldHook =>
  ({ value, originalDoc, data }) => {
    if (typeof value === 'string') {
      return format(value)
    }
    const fallbackData = data?.[fallback] || originalDoc?.[fallback]

    if (fallbackData && typeof fallbackData === 'string') {
      return format(fallbackData)
    }

    return value
  }

export const MoviesCollection: CollectionConfig = {
  slug: 'movies',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    create: () => true,
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'movieDate',
      type: 'date',
      required: true,
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) {
              return new Date().toISOString()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
    },
    {
      name: 'ratings',
      type: 'array',
      fields: [
        {
          name: 'rating',
          type: 'number',
          admin: {
            description: 'Rating out of 5',
          },
          max: 5,
          min: 1,
          required: true,
        },
        {
          name: 'reviewer',
          type: 'relationship',
          relationTo: 'users',
        },
        {
          name: 'review',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [
              ...defaultFeatures,
              // The HTMLConverter Feature is the feature which manages the HTML serializers.
              // If you do not pass any arguments to it, it will use the default serializers.
              HTMLConverterFeature({}),
            ],
          }),
        },
        lexicalHTML('review', { name: 'review_html' }),
      ],
    },
    {
      name: 'services',
      type: 'select',
      options: [
        'Netflix',
        'Shudder',
        'Stan',
        'Amazon Prime',
        'Disney Plus',
        'Binge',
        'Apple TV',
        'Paramount',
        'Flixtor',
      ],
    },
    {
      name: 'releaseDate',
      type: 'date',
      required: false,
    },
    {
      name: 'producers',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
        },
      ],
      required: false,
    },
    {
      name: 'directors',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
        },
      ],
      required: false,
    },
    {
      name: 'cast',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'didWeJump',
      type: 'select',
      options: ['Jack (baby)', 'Both', 'Fatima (baby)'],
    },
    {
      name: 'gory',
      type: 'checkbox',
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media', // required
      required: true,
    },
    {
      name: 'overview',
      type: 'text',
      required: true,
    },
    {
      name: 'tagline',
      type: 'text',
      required: false, // Some movies in tmd have no tagline
    },
    {
      name: 'genres',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [formatSlug('name')],
      },
    },
  ],
}
