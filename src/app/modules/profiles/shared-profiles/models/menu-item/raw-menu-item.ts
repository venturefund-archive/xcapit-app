export type RawMenuItem = {
  position: number;
  name: string;
  text: string;
  route: string;
  buttonName?: string;
  type: 'link';
  visible?: boolean;
  newBadge?: boolean;
  disable?: string;
  categoryName: string;
};
