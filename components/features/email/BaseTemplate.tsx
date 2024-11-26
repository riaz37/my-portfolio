import { type ReactNode } from 'react';

interface BaseTemplateProps {
  previewText?: string;
  children: ReactNode;
}

export function BaseTemplate({ previewText = '', children }: BaseTemplateProps) {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>CodePlayground Newsletter</title>
        {previewText && (
          <meta
            name="description"
            content={previewText}
            className="hidden-preview"
          />
        )}
        <style>
          {`
            /* Base */
            body {
              background-color: #f6f9fc;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              -webkit-font-smoothing: antialiased;
              font-size: 16px;
              line-height: 1.4;
              margin: 0;
              padding: 0;
              -ms-text-size-adjust: 100%;
              -webkit-text-size-adjust: 100%;
            }
            
            /* Container */
            .email-wrapper {
              background-color: #f6f9fc;
              padding: 32px;
              width: 100%;
            }
            
            .email-content {
              background-color: #ffffff;
              border: 1px solid #e9ecef;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
              margin: 0 auto;
              max-width: 600px;
              padding: 32px;
            }
            
            /* Typography */
            h1 {
              color: #1a1a1a;
              font-size: 24px;
              font-weight: 700;
              margin: 0 0 16px;
            }
            
            p {
              color: #4a5568;
              font-size: 16px;
              margin: 0 0 16px;
            }
            
            .footer {
              color: #718096;
              font-size: 14px;
              margin-top: 32px;
              text-align: center;
            }
            
            /* Buttons */
            .button {
              background-color: #4f46e5;
              border-radius: 4px;
              color: #ffffff;
              display: inline-block;
              font-size: 16px;
              font-weight: 600;
              padding: 12px 24px;
              text-decoration: none;
              text-align: center;
            }
            
            .button:hover {
              background-color: #4338ca;
            }
            
            /* Utilities */
            .text-center {
              text-align: center;
            }
            
            .my-8 {
              margin-top: 32px;
              margin-bottom: 32px;
            }
            
            .hidden-preview {
              display: none;
              max-height: 0;
              overflow: hidden;
            }
            
            .divider {
              border-top: 1px solid #e9ecef;
              margin: 24px 0;
            }
          `}
        </style>
      </head>
      <body>
        <div className="email-wrapper">
          <div className="email-content">
            {children}
            <div className="divider" />
            <div className="footer">
              <p>
                CodePlayground - Learn, Practice, Excel
                <br />
                {new Date().getFullYear()} CodePlayground. All rights reserved.
              </p>
              <p>
                <small>
                  You received this email because you signed up for CodePlayground newsletters.
                  <br />
                  <a href="{{unsubscribe_url}}">Unsubscribe</a>
                </small>
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
