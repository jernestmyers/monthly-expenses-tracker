import { Header } from '../Header';

type Props = {
  children: JSX.Element;
};

export function DefaultPageLayout({ children }: Props) {
  return (
    <div className="flex flex-col h-screen">
      <Header className="flex justify-between" />
      {children}
    </div>
  );
}
