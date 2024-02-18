declare module '*.svg?url' {
  import type { StaticImageData } from 'next/image';

  const content: StaticImageData;
  export default content;
}

declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGElement>>;
  export default content;
}
