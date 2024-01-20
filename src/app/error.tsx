'use client';

type ErrorProps = {
  error: string;
  reset: () => void;
};

const Error: React.FC<ErrorProps> = () => {
  return 'error';
};

Error.displayName = 'Error';

export default Error;
