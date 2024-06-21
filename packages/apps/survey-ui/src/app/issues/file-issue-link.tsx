type FileIssueLinkProps = {
  text?: string;
};

export function FileIssueLink({
  text = "file a new issue here",
}: FileIssueLinkProps) {
  return (
    <a href="https://github.com/cohuebn/survey-tool/issues" target="_blank">
      {text}
    </a>
  );
}
