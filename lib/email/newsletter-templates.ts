interface TemplateData {
  subject: string;
  content: string;
}

interface NewsletterTemplate {
  id: string;
  name: string;
  description: string;
  getTemplate: (data: Record<string, string>) => TemplateData;
}

export const newsletterTemplates: NewsletterTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    description: 'A warm welcome message for new subscribers',
    getTemplate: (data) => ({
      subject: 'Welcome to Our Newsletter! 👋',
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; font-size: 24px;">Welcome to Our Newsletter!</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Thank you for subscribing to our newsletter. We're excited to share with you the latest updates
            about web development, AI, and technology.
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Stay tuned for:
          </p>
          <ul style="color: #666; font-size: 16px; line-height: 1.5;">
            <li>Latest tech trends and insights</li>
            <li>Web development tips and tricks</li>
            <li>AI and machine learning updates</li>
            <li>Exclusive content and resources</li>
          </ul>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Best regards,<br/>
            Your Name
          </p>
        </div>
      `
    })
  },
  {
    id: 'monthly-update',
    name: 'Monthly Update',
    description: 'Monthly newsletter with latest updates and articles',
    getTemplate: (data) => ({
      subject: `${data.month} Newsletter: Latest Updates and Insights`,
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; font-size: 24px;">${data.month} Newsletter</h1>
          
          <div style="margin: 30px 0;">
            <h2 style="color: #444; font-size: 20px;">📝 Latest Articles</h2>
            <ul style="color: #666; font-size: 16px; line-height: 1.5;">
              ${data.articles || '<li>No articles this month</li>'}
            </ul>
          </div>

          <div style="margin: 30px 0;">
            <h2 style="color: #444; font-size: 20px;">🚀 Project Updates</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              ${data.updates || 'No updates this month'}
            </p>
          </div>

          <div style="margin: 30px 0;">
            <h2 style="color: #444; font-size: 20px;">💡 Featured Content</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              ${data.featured || 'No featured content this month'}
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

          <p style="color: #666; font-size: 14px;">
            You're receiving this email because you subscribed to our newsletter.
            <br/>
            <a href="{unsubscribe_url}" style="color: #0070f3; text-decoration: none;">Unsubscribe</a>
          </p>
        </div>
      `
    })
  },
  {
    id: 'announcement',
    name: 'New Announcement',
    description: 'Template for important announcements',
    getTemplate: (data) => ({
      subject: `${data.title || 'Important Announcement'}`,
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; font-size: 24px;">${data.title || 'Important Announcement'}</h1>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              ${data.announcement || 'No announcement content provided'}
            </p>
          </div>

          ${data.callToAction ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.callToActionUrl}" 
                 style="background-color: #0070f3; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 4px; display: inline-block;">
                ${data.callToAction}
              </a>
            </div>
          ` : ''}

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

          <p style="color: #666; font-size: 14px; text-align: center;">
            Thank you for being part of our community!
          </p>
        </div>
      `
    })
  }
];

export function getTemplateById(id: string): NewsletterTemplate | undefined {
  return newsletterTemplates.find(template => template.id === id);
}

export function getDefaultTemplateData(templateId: string): Record<string, string> {
  switch (templateId) {
    case 'monthly-update':
      return {
        month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
        articles: '<li>Article 1</li><li>Article 2</li><li>Article 3</li>',
        updates: 'Latest project updates and achievements...',
        featured: 'Featured content of the month...'
      };
    case 'announcement':
      return {
        title: 'Important Announcement',
        announcement: 'Your announcement content here...',
        callToAction: 'Learn More',
        callToActionUrl: '#'
      };
    default:
      return {};
  }
}
