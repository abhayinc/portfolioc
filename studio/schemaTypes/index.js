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
      { name: 'speedTech', title: 'Speed & Tech (e.g. Instant Load Times • Next.js)', type: 'string' },
      { name: 'cmsManagement', title: 'CMS / Management (e.g. Easy Package Updates • Sanity CMS)', type: 'string' },
      { name: 'resultBooking', title: 'Result / Booking Flow (e.g. Direct Booking Flow • Zero Middleman Fees)', type: 'string' },
      { name: 'order', title: 'Order', type: 'number', description: 'Used to sort projects (1, 2, 3...)' }
    ]
  }
]
