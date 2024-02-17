declare module '*.svg?inline' {
  const content: React.FC<React.SVGProps<SVGElement>>;
  export default content;
}

declare module '*.svg' {
  import type { StaticImageData } from 'next/image';

  const content: StaticImageData;
  export default content;
}
