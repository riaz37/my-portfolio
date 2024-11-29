import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownProps {
  children: string;
  className?: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ children, className }) => {
  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]}
      className={className}
    >
      {children}
    </ReactMarkdown>
  );
};
