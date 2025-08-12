# Plunk Newsletter Setup Guide
## Complete Implementation for IdeaOasis

---

## 🚀 **Quick Setup (5 Minutes)**

### **Step 1: Create Plunk Account**
1. Go to **https://useplunk.com**
2. Click "Get Started" (free)
3. Verify your email
4. You'll land on the dashboard

### **Step 2: Get Your API Key**
1. In Plunk dashboard, click **"API Keys"** in sidebar
2. Click **"Create API Key"**
3. Name it: "IdeaOasis Production"
4. Copy the key (starts with `sk_`)

### **Step 3: Add to Environment**
Add to your `.env.local`:
```bash
PLUNK_API_KEY=sk_your_actual_key_here
```

### **Step 4: Configure Email Sender**
1. In Plunk dashboard, go to **"Email"** → **"Senders"**
2. Click **"Add Sender"**
3. Add your sender:
   - Name: `Korean Business Intelligence`
   - Email: `newsletter@ideaoasis.kr`
4. **Verify your domain** (important for deliverability):
   - Add the DNS records Plunk provides
   - This ensures emails don't go to spam

### **Step 5: Test Your Setup**
```bash
# Restart your dev server to load new env vars
npm run dev
```

Visit `http://localhost:3000/newsletter` and test with your email!

---

## 📧 **Email Configuration**

### **Domain Verification (Recommended)**
To send from `newsletter@ideaoasis.kr`, add these DNS records:

**SPF Record:**
```
Type: TXT
Name: @
Value: v=spf1 include:plunk.dev ~all
```

**DKIM Records:** (Plunk will provide these)
```
Type: CNAME
Name: plunk._domainkey
Value: [provided by Plunk]
```

### **Without Domain Verification**
You can still send emails, but they'll come from:
- `your-name@useplunk.com` 
- Lower deliverability to Korean email providers

---

## 🎨 **Enhanced Welcome Email Template**

Update your welcome email to be more engaging:

```typescript
// app/api/newsletter/subscribe/route.ts
function getWelcomeEmailTemplate(email: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { 
          font-family: -apple-system, 'Segoe UI', sans-serif; 
          line-height: 1.6; 
          color: #1f2937;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 3px solid #3b82f6;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #1e40af;
          margin: 0;
          font-size: 28px;
        }
        .welcome-badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: bold;
          margin: 20px 0;
        }
        .benefit-list {
          background: #f3f4f6;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .benefit-list li {
          margin: 10px 0;
          color: #4b5563;
        }
        .cta-button {
          display: inline-block;
          background: #3b82f6;
          color: white;
          padding: 12px 30px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: bold;
          margin: 20px 0;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 12px;
          color: #6b7280;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Korean Business Intelligence Weekly</h1>
          <span class="welcome-badge">🎉 구독 완료!</span>
        </div>
        
        <p>안녕하세요!</p>
        
        <p><strong>Korean Business Intelligence Weekly</strong> 구독을 진심으로 환영합니다. 
        이제 매주 월요일 아침 7시, 한국 비즈니스 규제 변화를 가장 먼저 알게 되실 거예요.</p>
        
        <div class="benefit-list">
          <p><strong>🎁 구독자 혜택:</strong></p>
          <ul>
            <li>📍 <strong>긴급 규제 알림</strong> - 새로운 규제 시행 전 미리 알림</li>
            <li>📊 <strong>Korea Fit 분석</strong> - 글로벌 아이디어의 한국 적합도</li>
            <li>🎤 <strong>전문가 인사이트</strong> - 전직 정부 관계자 독점 인터뷰</li>
            <li>📈 <strong>성공/실패 사례</strong> - 한국 스타트업의 규제 대응 스토리</li>
            <li>🔮 <strong>미래 예측</strong> - 3개월 후 시행될 규제 미리보기</li>
          </ul>
        </div>
        
        <p><strong>첫 번째 뉴스레터</strong>는 다음 월요일 아침 7시에 도착합니다!</p>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
          <p style="margin: 0;">
            <strong>💡 Pro Tip:</strong> 
            스팸함으로 가는 것을 방지하기 위해 <strong>newsletter@ideaoasis.kr</strong>을 
            주소록에 추가해주세요!
          </p>
        </div>
        
        <center>
          <a href="https://ideaoasis.kr" class="cta-button">
            IdeaOasis 둘러보기 →
          </a>
        </center>
        
        <p>궁금한 점이 있으시면 언제든 회신해주세요. 
        여러분의 피드백으로 더 나은 콘텐츠를 만들어갑니다.</p>
        
        <p>
          감사합니다,<br>
          <strong>IdeaOasis 팀</strong> 드림
        </p>
        
        <div class="footer">
          <p>
            이 이메일은 ${email}님이 구독 신청하셨기 때문에 발송되었습니다.<br>
            <a href="https://ideaoasis.kr/unsubscribe" style="color: #6b7280;">구독 취소</a> | 
            <a href="https://ideaoasis.kr/preferences" style="color: #6b7280;">이메일 설정</a>
          </p>
          <p>
            © 2024 IdeaOasis. All rights reserved.<br>
            Seoul, South Korea
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
```

---

## 📊 **Weekly Newsletter Automation**

### **Create Weekly Send Function**
```typescript
// app/api/newsletter/send-weekly/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Plunk from '@plunk/node';

const plunk = new Plunk(process.env.PLUNK_API_KEY!);

export async function POST(request: NextRequest) {
  // Verify this is called by your cron job
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Get all subscribers from Plunk
    const contacts = await plunk.contacts.get();
    const activeContacts = contacts.filter(c => c.subscribed);

    // Generate this week's content
    const content = await generateWeeklyContent();

    // Send to all subscribers
    const results = await Promise.all(
      activeContacts.map(contact => 
        plunk.emails.send({
          to: contact.email,
          subject: content.subject,
          body: content.html,
          from: 'newsletter'
        })
      )
    );

    return NextResponse.json({
      success: true,
      sent: results.length,
      subject: content.subject
    });
  } catch (error) {
    console.error('Weekly send error:', error);
    return NextResponse.json(
      { error: 'Failed to send weekly newsletter' },
      { status: 500 }
    );
  }
}

async function generateWeeklyContent() {
  // This is where you'd generate your weekly content
  // For now, return a template
  return {
    subject: `[KBI Weekly #${new Date().getWeek()}] 이번 주 한국 비즈니스 규제 업데이트`,
    html: `
      <h1>Korean Business Intelligence Weekly</h1>
      <p>This week's regulatory updates...</p>
      <!-- Your full newsletter content here -->
    `
  };
}
```

### **Set Up Vercel Cron Job**
Create `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/newsletter/send-weekly",
    "schedule": "0 22 * * 0"
  }]
}
```
*Note: 22:00 UTC Sunday = 7:00 AM KST Monday*

---

## 📈 **Plunk Dashboard Features**

### **Analytics You'll Get**
- **Open Rate**: Track who opens your emails
- **Click Rate**: See which links get clicked
- **Bounce Rate**: Monitor delivery issues
- **Growth Chart**: Visualize subscriber growth
- **Engagement Score**: See most engaged subscribers

### **Contact Management**
- **Tags**: Segment subscribers (e.g., "fintech", "healthcare")
- **Custom Fields**: Store additional data
- **Unsubscribe Handling**: Automatic
- **Import/Export**: CSV support

---

## 🎯 **Testing Checklist**

- [ ] Plunk account created
- [ ] API key added to `.env.local`
- [ ] Domain verification started (DNS records)
- [ ] Test subscription works locally
- [ ] Welcome email received
- [ ] Email doesn't go to spam
- [ ] Unsubscribe link works

---

## 💰 **Plunk Pricing as You Scale**

| Subscribers | Emails/Month | Monthly Cost |
|-------------|--------------|--------------|
| 0-150 | 3,000 | **Free** |
| 150-1,000 | 20,000 | $9 |
| 1,000-2,500 | 50,000 | $19 |
| 2,500-5,000 | 100,000 | $39 |
| 5,000-10,000 | 200,000 | $79 |

*Perfect for your growth trajectory!*

---

## 🚨 **Common Issues & Solutions**

### **Emails Going to Spam**
- Verify your domain in Plunk
- Add SPF/DKIM records
- Avoid spam trigger words
- Include unsubscribe link

### **API Key Not Working**
- Check it starts with `sk_`
- Ensure no extra spaces
- Restart dev server after adding to `.env.local`

### **Welcome Email Not Sending**
- Check Plunk dashboard for errors
- Verify sender email is configured
- Check API key is correct

---

## 📞 **Support**

- **Plunk Documentation**: https://docs.useplunk.com
- **Plunk Support**: support@useplunk.com
- **Response Time**: Usually within 24 hours

---

**Next Step**: Go to https://useplunk.com and create your account!