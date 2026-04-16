// Global type declarations for FORTIS OS

// Allow CSS side-effect imports (Next.js processes these at build time)
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}
