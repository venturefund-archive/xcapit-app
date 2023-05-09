export interface MenuItem {
  name: string;
  text: string;
  route: string;
  buttonName?: string;
  type: 'link';
  hidden?: boolean;
  newBadge?: boolean;
  disable?: string
}
