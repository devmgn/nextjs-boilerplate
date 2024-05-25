import { valibotResolver } from '@hookform/resolvers/valibot';
import { useForm } from 'react-hook-form';
import { LoginSchema } from './schema';
import type { LoginRequest } from './schema';

export const useLoginForm = () => {
  const form = useForm<LoginRequest>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: valibotResolver(LoginSchema),
  });

  const submit = form.handleSubmit((value) => {
    console.warn(value);
  });

  return { form, submit };
};
