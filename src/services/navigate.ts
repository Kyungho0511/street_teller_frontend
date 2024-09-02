export type Section = "home" | "cluster";

export function pathToSection(path: string): Section {
  switch (path) {
    case "/":
      return "home";
    case "/cluster":
      return "cluster";
    default:
      return "home";
  }
}