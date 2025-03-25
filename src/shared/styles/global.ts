// src/shared/styles/global.ts
import { css } from '@emotion/react';

export const globalStyles = css`
  /* Box sizing 초기화 */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* HTML 기본 세팅 */
  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Body 기본 폰트 및 색상 */
  body {
    margin: 0;
    padding: 0;
    font-family: 'Noto Sans KR', sans-serif;
    background-color: #f9fafb; /* softGray */
    color: #1f2937; /* Tailwind gray-800 */
    line-height: 1.6;
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* 기본 링크 스타일 */
  a {
    text-decoration: none;
    color: inherit;
  }

  /* 버튼 리셋 */
  button {
    font-family: inherit;
    background: none;
    border: none;
    cursor: pointer;
  }

  /* 입력 요소 공통 */
  input,
  textarea {
    font-family: inherit;
    color: inherit;
    background-color: transparent;
    border: none;
    outline: none;
  }

  /* 스크롤 부드럽게 */
  html,
  body {
    scroll-behavior: smooth;
  }

  /* 루트 격리 (토스트 등 z-index 이슈 방지용) */
  #root,
  #__next {
    isolation: isolate;
  }
`;
