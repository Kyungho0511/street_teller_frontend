export type IconProps = {
  path: string;
  color?: string;
  height?: number;
  width?: number;
  offset?: {
    x: number;
    y: number;
  };
};

export default function Icon({
  path,
  color = "var(--color-dark-grey)",
  height = 26,
  width = 26,
  offset,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={`${height}px`}
      viewBox="0 -960 960 960"
      width={`${width}px`}
      fill={color}
      style={
        offset && {
          transform: `translateX(${offset.x}px) translateY(${offset.y}px)`,
        }
      }
    >
      <path d={path} />
    </svg>
  );
}
