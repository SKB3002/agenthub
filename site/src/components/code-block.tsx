import { codeToHtml } from "shiki";
import { CopyButton } from "@/components/copy-button";

type Props = {
  code: string;
  lang?: string;
  filename?: string;
};

export async function CodeBlock({ code, lang = "bash", filename }: Props) {
  const html = await codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });

  return (
    <div className="group relative my-4 overflow-hidden rounded-lg border border-border bg-muted/40">
      {filename ? (
        <div className="flex items-center justify-between border-b border-border bg-muted/60 px-4 py-2 text-xs text-muted-foreground">
          <span className="font-mono">{filename}</span>
          <CopyButton text={code} />
        </div>
      ) : (
        <div className="absolute right-2 top-2">
          <CopyButton text={code} />
        </div>
      )}
      <div
        className="overflow-x-auto px-4 py-3 text-sm [&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:!bg-transparent"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
