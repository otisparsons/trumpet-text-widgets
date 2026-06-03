export interface Widget {
  id: string;
  text: string;
}

export interface WidgetStore {
  getAll(): Promise<Widget[]>;
  create(): Promise<Widget>;
  update(id: string, text: string): Promise<Widget | null>;
  delete(id: string): Promise<boolean>;
}
