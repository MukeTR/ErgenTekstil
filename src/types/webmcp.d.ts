// WebMCP declarative API — lets AI browser agents discover this form as a
// callable "tool" (toolname/tooldescription/toolparamdescription attributes).
// Spec: https://webmachinelearning.github.io/webmcp/
// These are plain HTML attributes; browsers without WebMCP support ignore
// them, so this is a no-risk progressive enhancement.
import "react";

declare module "react" {
  interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
    toolname?: string;
    tooldescription?: string;
    toolautosubmit?: boolean;
  }
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    toolparamdescription?: string;
  }
  interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
    toolparamdescription?: string;
  }
}
