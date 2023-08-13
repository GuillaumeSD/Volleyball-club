import { Icon } from "@iconify/react";

export default function FileIcon(props: Record<string, unknown>) {
  return (
    <Icon
      icon="mdi:file-document-outline"
      color="#1976d2"
      height="20px"
      cursor="pointer"
      {...props}
    />
  );
}
