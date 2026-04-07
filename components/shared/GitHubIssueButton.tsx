import Link from "next/link";

export function GitHubIssueButton({
  size = "large",
  showCount = true,
}: {
  size?: "large" | "small";
  showCount?: boolean;
}) {
  return (
    <Link
      className="github-button"
      href="https://github.com/Mohith-Kumar28/invoice-lab/issues"
      data-color-scheme="no-preference: light; light: light; dark: dark;"
      data-size={size}
      data-show-count={showCount ? "true" : "false"}
      aria-label="Issue Mohith-Kumar28/invoice-lab on GitHub"
      target="_blank"
      rel="noreferrer"
    >
      Issue
    </Link>
  );
}
