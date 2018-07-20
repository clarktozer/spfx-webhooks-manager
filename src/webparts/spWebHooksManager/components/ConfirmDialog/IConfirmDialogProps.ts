export interface IConfirmDialogProps {
  onSubmit: () => Promise<void>;
  onClose: () => void;
  title: string;
  message: string;
  loadingMessage: string;
}
