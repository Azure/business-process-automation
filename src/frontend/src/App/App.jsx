import React from 'react';
import '../styles/update.css'
import HeaderComponent from './HeaderComponent';
import Content from '../Pages/Content';
import { Provider, teamsTheme, mergeThemes } from '@fluentui/react-northstar'
import { initializeIcons } from "@fluentui/react";

initializeIcons()

const theme = {
  componentVariables: {
    // 💡 `colorScheme` is the object containing all color tokens
    Header: ({ colorScheme }) => ({
      // `brand` contains all design tokens for the `brand` color
      // `foreground3` and `background3` are theme-dependent tokens that should
      // be used as value in styles, you can define own tokens 💪
    }),
    Label : ({ colorScheme }) => ({
      // `brand` contains all design tokens for the `brand` color
      color: "rgb(0, 120, 212)",
      backgroundColor: colorScheme.default.background,
      fontSize: "20px",
      height: "50px"
      // `foreground3` and `background3` are theme-dependent tokens that should
      // be used as value in styles, you can define own tokens 💪
    }),
    Breadcrumb : ({ colorScheme }) => ({
      // `brand` contains all design tokens for the `brand` color
      backgroundColor: colorScheme.default.background,
      // fontSize: "18px"
      // `foreground3` and `background3` are theme-dependent tokens that should
      // be used as value in styles, you can define own tokens 💪
    }),
  },
  componentStyles: {
    Header: {
      // 🚀 We recomend to use `colorScheme` from variables mapping
      root: ({ variables }) => ({
        color: variables.color,
        backgroundColor: variables.backgroundColor,
      }),
    },
    Label: {
      // 🚀 We recomend to use `colorScheme` from variables mapping
      root: ({ variables }) => ({
        color: variables.color,
        backgroundColor: variables.backgroundColor,
        fontSize: variables.fontSize,
        height: variables.height
      }),
    },
    Breadcrumb: {
      // 🚀 We recomend to use `colorScheme` from variables mapping
      root: ({ variables }) => ({
        backgroundColor: variables.backgroundColor,
        fontSize: variables.fontSize
      }),
    },
  },
}

function App({ Component, pageProps }) {
  return (
    <Provider theme={mergeThemes(teamsTheme, theme)}>
      <HeaderComponent theme={theme}/>
      <Content theme={theme}/>
    </Provider>
  )
}

export default App

