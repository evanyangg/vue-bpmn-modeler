import CustomPalette from './CustomPalette';
import CustomContextPadProvider from './CustomContextPadProvider';
export default {
  __init__: [
    'paletteProvider',
    'contextPadProvider'
  ],
  paletteProvider: [ 'type', CustomPalette ],
  contextPadProvider: ['type', CustomContextPadProvider]
};
