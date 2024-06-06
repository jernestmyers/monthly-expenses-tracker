import { Header } from '../Header';

type Props = {
  children: JSX.Element;
};

export function DefaultPageLayout({ children }: Props) {
  return (
    <div className="flex flex-col h-screen">
      <Header additionalClassNames="sticky top-0 bg-white z-50" />
      {children}
    </div>
  );
}
