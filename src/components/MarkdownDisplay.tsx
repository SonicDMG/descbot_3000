
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import type { Components } from 'react-markdown';

interface MarkdownDisplayProps {
  content: string;
  title?: string;
}

const MarkdownDisplay: React.FC<MarkdownDisplayProps> = ({ content, title }) => {
  // Extract hashtags from content
  const findHashtags = (text: string) => {
    const hashtagPattern = /#[\w\d]+/g;
    return text.match(hashtagPattern) || [];
  };

  const hashtags = findHashtags(content);
  const uniqueHashtags = [...new Set(hashtags)];
  
  // Define components for ReactMarkdown
  const components: Components = {
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return match ? (
        <SyntaxHighlighter
          language={match[1]}
          style={vscDarkPlus}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    h1({ children }) {
      return <h1>{children}</h1>;
    },
    h2({ children }) {
      return <h2>{children}</h2>;
    },
    h3({ children }) {
      return <h3>{children}</h3>;
    },
  };
  
  return (
    <div className="flex flex-col h-full glass-panel rounded-xl overflow-hidden animate-fade-in">
      <div className="chat-header">
        {title || "Markdown Output"}
      </div>
      
      <ScrollArea className="flex-1" type="always">
        <div className="p-6">
          <div className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={components}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </ScrollArea>
      
      {uniqueHashtags.length > 0 && (
        <>
          <Separator className="bg-white/10" />
          <div className="p-4">
            {uniqueHashtags.map((tag, index) => (
              <span key={index} className="hashtag">
                {tag}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MarkdownDisplay;
