export type Section = "home" | "explore" | "cluster" | "report";

export function pathToSection(path: string): Section {
  switch (path) {
    case "/":
      return "home";
    case "/explore":
      return "explore";
    case "/cluster":
      return "cluster";
    case "/report":
      return "report";
    default:
      return "home";
  }
}