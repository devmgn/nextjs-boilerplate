import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoginForm } from './useLoginForm';

export default function ReactHookForm() {
  const {
    submit,
    form: {
      register,
      formState: { errors },
    },
  } = useLoginForm();

  return (
    <main className="container prose">
      <h1 className="sm:text-4xl">react-hook-form example</h1>
      <form onSubmit={submit}>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" {...register('email')} />
            {errors.email?.message && (
              <p className="text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password?.message && (
              <p className="text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit">送信</Button>
        </div>
      </form>
    </main>
  );
}
