import { Badge } from "~/components/ui/badge";
import { getReadableTextColor, normalizeHexColor } from "~/lib/color";

type CategoryBadgeProps = {
  name: string;
  color?: string | null;
  className?: string;
};

export function CategoryBadge({ name, color, className }: CategoryBadgeProps) {
  const normalizedColor = normalizeHexColor(color);

  if (!normalizedColor) {
    return (
      <Badge variant="secondary" className={className}>
        {name}
      </Badge>
    );
  }

  return (
    <Badge
      className={className}
      style={{
        backgroundColor: normalizedColor,
        color: getReadableTextColor(normalizedColor),
        borderColor: normalizedColor,
      }}
    >
      {name}
    </Badge>
  );
}
