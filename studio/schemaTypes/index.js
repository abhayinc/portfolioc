export const schemaTypes = [
  {
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
      { name: 'title', title: 'Title', type: 'string' },
      { name: 'subtitle', title: 'Subtitle (e.g. Himachal DMC / Delhi)', type: 'string' },
      { name: 'description', title: 'Description', type: 'text' },
      { name: 'websiteUrl', title: 'Website URL', type: 'url' },
      { name: 'emoji', title: 'Emoji Icon', type: 'string' },
      { name: 'image', title: 'Screenshot', type: 'image' },
      { name: 'tags', title: 'Tags / Features', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } },
      { name: 'order', title: 'Order', type: 'number', description: 'Used to sort projects (1, 2, 3...)' }
    ]
  }
]
