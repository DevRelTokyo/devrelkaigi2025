import type { ComponentType } from 'react'; // Reactの型をインポート

declare module '*.mdx' {
  export const meta: {
    title?: string;
    description?: string;
  };

  const MDXComponent: ComponentType; // React.を除去
  export default MDXComponent;
}