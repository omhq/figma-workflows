module.exports = {
  theme: {
    screens: false,
    minHeight: {
      '0': '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      'full': '100%',
     }
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      backgroundColor: ['disabled'],
      borderColor: ['disabled'],
      textColor: ['disabled'],
      padding: ['focus']
    }
  },
  corePlugins: {
    outline: false
  }
}
