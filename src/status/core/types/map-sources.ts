export const mapSources = {
  low: {
    type: 'image',
    url: 'https://raw.githubusercontent.com/eumenes12ds/FrontEnd-for-Astraea/main/static/map/Map-FULL.webp',
  },
  small: {
    type: 'image',
    url: 'https://raw.githubusercontent.com/eumenes12ds/FrontEnd-for-Astraea/main/static/map/Map-FULL.webp',
  },
  large: {
    type: 'image',
    url: 'https://raw.githubusercontent.com/eumenes12ds/FrontEnd-for-Astraea/main/static/map/Map-FULL.webp',
  },
} as const;

export type MapSourceKey = keyof typeof mapSources;
