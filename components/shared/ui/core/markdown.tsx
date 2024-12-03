'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownProps {
  content: string;
  className?: string;
}

const Markdown: React.FC<MarkdownProps> = ({ content, className }) => {
  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]}
      className={className}
    >
      {content}
    </ReactMarkdown>
  );
};

export { Markdown };
export type { MarkdownProps };
