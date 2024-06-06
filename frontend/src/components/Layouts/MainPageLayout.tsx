import { Header } from '../Header';

type Props = {
  children: JSX.Element;
};

export function MainPageLayout({ children }: Props) {
  return (
    <div className="grid grid-cols-[150px_auto] grid-rows-[auto_1fr] h-screen">
      <Header className="flex justify-between col-span-2" />
      {children}
    </div>
  );
}
