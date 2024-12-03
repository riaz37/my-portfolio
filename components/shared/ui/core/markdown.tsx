import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownProps {
  content: string;
  className?: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ content, className }) => {
  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]}
      className={className}
    >
      {content}
    </ReactMarkdown>
  );
};
