declare module '*.mdx' {
  export const meta: {
    title?: string;
  };

  const MDXComponent: React.ComponentType;
  export default MDXComponent;
}
