export type IconProps = {
  path: string;
  color?: string;
  height?: number;
  width?: number;
};

export default function Icon({
  path,
  color = "var(--color-black)",
  height = 26,
  width = 26,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={`${height}px`}
      viewBox="0 -960 960 960"
      width={`${width}px`}
      fill={color}
      style={{ marginRight: "10px" }}
    >
      <path d={path} />
    </svg>
  );
}
