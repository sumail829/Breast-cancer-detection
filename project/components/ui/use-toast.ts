// Shadcn Toast hook implementation
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";
import {
  useToast as useShadcnToast,
} from "@/hooks/use-toast";

export { useToast } from "@/hooks/use-toast";

export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};