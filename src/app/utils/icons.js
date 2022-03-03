//import { CodeIcon } from '@heroicons/react/solid'
import * as FigmaIcons from '../components/icons/figma'
import * as OutlineIcons from '@heroicons/react/outline'


export const getIconComponent = (iconName) => {
  try {
    const component = FigmaIcons[iconName]
    if (component) {
      return FigmaIcons[iconName]
    }
  } catch(e) {
  }

  try {
    return OutlineIcons[iconName]
  } catch(e) {
  }
}
