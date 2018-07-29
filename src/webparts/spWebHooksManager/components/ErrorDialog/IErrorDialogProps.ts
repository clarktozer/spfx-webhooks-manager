export interface IErrorDialogProps {
  onClose: (key: string, value: any) => void;
  title: string;
  message: string;
  propertyKey: string;
}
