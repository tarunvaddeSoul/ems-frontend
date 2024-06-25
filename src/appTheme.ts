import {
  Button,
  Card,
  MantineColorsTuple,
  NavLink,
  Pagination,
  Pill,
  ThemeIcon,
} from '@mantine/core';

const brandColor: MantineColorsTuple = [
  '#fff0e4',
  '#ffe0cf',
  '#fac0a1',
  '#f69e6e',
  '#f28043',
  '#f06d27',
  '#f06418',
  '#d6530c',
  '#bf4906',
  '#a73c00',
];

const duneColor: MantineColorsTuple = [
  '#f4f3f3',
  '#e9e8e7',
  '#d3d1cf',
  '#bdbab8',
  '#a7a3a0',
  '#918d88',
  '#7a7671',
  '#635f5b',
  '#4b4845',
  '#33312f',
];

const lightYellow: MantineColorsTuple = [
  '#FFFBE7',
  '#FEF7D0',
  '#FEEDA2',
  '#FEE074',
  '#FED352',
  '#FEBE19',
  '#DA9C12',
  '#B67D0C',
  '#936007',
  '#794B04',
];

const blueRibbon: MantineColorsTuple = [
  '#E7F4FF',
  '#CEE9FE',
  '#9ECFFD',
  '#6DB0F9',
  '#4893F3',
  '#0F67EC',
  '#0A4FCA',
  '#073BA9',
  '#042988',
  '#021C71',
];

const shamRock: MantineColorsTuple = [
  '#EAFDEA',
  '#D5FCD5',
  '#ACFAB4',
  '#81F297',
  '#5FE587',
  '#2FD471',
  '#22B66C',
  '#179864',
  '#0E7A5A',
  '#096553',
];

const alizarinCrimson: MantineColorsTuple = [
  '#fef1e9',
  '#fde2d3',
  '#fbbea8',
  '#f5907b',
  '#eb6659',
  '#df2727',
  '#bf1c2a',
  '#a0132c',
  '#810c2a',
  '#6b0729',
];

const appTheme = {
  // Colors
  primaryColor: 'duneColor',
  colors: {
    brandColor,
    duneColor,
    lightYellow,
    blueRibbon,
    shamRock,
    alizarinCrimson,
  },
  black: duneColor[9],

  // Radius
  radius: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
  },
  defaultRadius: '8px',

  //Spacing
  spacing: {
    xxl: '48px',
  },

  // Typography
  fontFamily: 'SF Pro Display, sans-serif',
  headings: {
    fontFamily: 'SF Pro Display, sans-serif',
    fontWeight: '900',
    sizes: {
      h1: { lineHeight: '1.22', fontSize: '36px' },
      h2: { lineHeight: '1.21', fontSize: '28px' },
      h3: { lineHeight: '1.25', fontSize: '24px' },
      h4: { lineHeight: '1.2', fontSize: '20px' },
      h5: { lineHeight: '1.5', fontSize: '16px' },
      h6: { lineHeight: '1.5', fontSize: '14px' },
    },
  },
  components: {
    Button: Button.extend({
      defaultProps: {
        color: duneColor[9],
        variant: 'filled',
        style: { borderRadius: '8px' },
      },
    }),
    NavLink: NavLink.extend({
      defaultProps: {
        color: duneColor[9],
        variant: 'filled',
        style: { borderRadius: '8px' },
      },
    }),
    Pagination: Pagination.extend({
      defaultProps: {
        color: duneColor[9],
      },
    }),
    ThemeIcon: ThemeIcon.extend({
      defaultProps: {
        color: duneColor[1],
        style: { color: duneColor[8] },
      },
    }),
    Card: Card.extend({
      defaultProps: {
        radius: 'md',
      },
    }),
    Pill: Pill.extend({
      defaultProps: {
        radius: 'xs',
      },
    }),
  },
};

export default appTheme;
