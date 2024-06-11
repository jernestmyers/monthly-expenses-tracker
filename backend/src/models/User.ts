export type User = {
  id: number;
  username: string;
  password: string;
  createdAt: Date;
};

export type Settings = {
  categories: Category[];
  payers: Payer[];
};

export type Payer = {
  id: number;
  userId: number;
  name: string;
  createdAt: Date;
};

export type Category = {
  id: number;
  name: string;
  userId: number;
  parentId: number | null;
  createdAt: Date;
};
