export const formSchema = {
  loadFonts: {
    type: 'hidden',
    label: 'Load Fonts',
    required: true,
    value: true
  },
  name: {
    type: 'hidden',
    label: 'Name',
    required: true,
    value: 'TextFunction'
  },
  prettyName: {
    type: 'text',
    label: 'Pretty Name',
    required: true
  },
  api: {
    type: 'hidden',
    label: 'Action Type',
    required: true,
    value: 'figma'
  },
  function: {
    type: 'select',
    label: 'Function',
    required: true,
    options: [
      {
        label: 'Text Decoration',
        value: 'setRangeTextDecoration'
      },
      {
        label: 'Text Case',
        value: 'setRangeTextCase'
      }
    ]
  },
  start: {
    type: 'number',
    label: 'Start',
    required: true,
    group: 'args'
  },
  end: {
    type: 'number',
    label: 'End',
    required: true,
    group: 'args'
  },
  value: {
    type: 'select',
    label: 'Value',
    required: true,
    group: 'args',
    dependencies: {
      by: 'function',
      options: {
        setRangeTextDecoration: [
          {
            label: 'none',
            value: 'NONE'
          },
          {
            label: 'Underline',
            value: 'UNDERLINE'
          },
          {
            label: 'Strikethrough',
            value: 'STRIKETHROUGH'
          }
        ],
        setRangeTextCase: [
          {
            label: 'Original',
            value: 'ORIGINAL'
          },
          {
            label: 'Uppercase',
            value: 'UPPER'
          },
          {
            label: 'Lowercase',
            value: 'LOWER'
          },
          {
            label: 'Title Case',
            value: 'TITLE'
          }
        ]
      }
    }
  }
}
