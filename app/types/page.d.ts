declare module '*.mdx' {
  export const meta: {
    title?: string;
    description?: string;
  };

  const MDXComponent: React.ComponentType;
  export default MDXComponent;
}
