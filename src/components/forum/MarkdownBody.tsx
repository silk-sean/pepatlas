import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

interface Props {
  source: string;
}

/**
 * Renders forum post bodies as markdown. Sanitized (rehype-sanitize) so
 * user-submitted HTML can't inject scripts. Supports GFM (tables, lists,
 * autolinks, strikethrough, task lists) + standard markdown.
 */
export function MarkdownBody({ source }: Props) {
  return (
    <div className="prose prose-invert prose-sm sm:prose-base max-w-none prose-p:my-2 prose-headings:mt-4 prose-headings:mb-2 prose-pre:bg-gray-900 prose-code:text-pink-300 prose-blockquote:border-pink-500 prose-blockquote:text-gray-400 prose-a:text-pink-400 hover:prose-a:text-pink-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
