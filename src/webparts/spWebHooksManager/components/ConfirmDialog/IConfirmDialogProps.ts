export interface IConfirmDialogProps {
  onSubmit: () => void;
  onClose: () => void;
  title: string;
  message: string;
  loadingMessage: string;
  enabled: boolean;
  loading: boolean;
}
