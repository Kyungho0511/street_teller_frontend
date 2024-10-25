import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";

/**
 * Renderer component for Markdown content.
 */
export default function MarkdownRenderer({ content }: { content: string }) {
  
  // Sanitize HTML generated from Markdown for security.
  const sanitizeHTML = (html: string) => {
    return DOMPurify.sanitize(html);
  };

  return (
      <ReactMarkdown
        children={content}
        // Manually sanitize raw html with dompurify.
        components={{
          html: ({ node }) => (
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHTML(node?.data as string),
              }}
            />
          ),
        }}
      />
  );
}
