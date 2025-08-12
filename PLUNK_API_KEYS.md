# Plunk API Keys Guide

## 📝 **You Have Two Different Keys**

### **1. Public Key (What you shared)**
```
pk_252d426d9d778bb9e3090c51b1eeeca049ac9783310de2ba
```
- Starts with `pk_`
- Used for: Frontend forms, browser-side operations
- Safe to expose in client code
- Cannot send emails

### **2. Secret Key (What you need)**
```
sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
- Starts with `sk_`
- Used for: Sending emails, managing contacts
- **NEVER expose in client code**
- Required for backend operations

---

## 🔍 **How to Get Your SECRET Key**

1. **Log into Plunk** → https://app.useplunk.com

2. **Go to Settings** → Click your profile icon (top right) → "Settings"

3. **Navigate to API Keys** → Direct link: https://app.useplunk.com/settings/api-keys

4. **Find or Create Secret Key**:
   - Look for a key starting with `sk_`
   - If none exists, click "Create API Key"
   - Choose type: "Secret Key"
   - Name it: "IdeaOasis Backend"
   - Copy the key immediately (shown only once!)

---

## 🔧 **Add to Your Environment**

Add BOTH keys to your `.env.local`:

```bash
# Plunk Newsletter Service
PLUNK_API_KEY=sk_your_secret_key_here_from_plunk_dashboard
NEXT_PUBLIC_PLUNK_PUBLIC_KEY=pk_252d426d9d778bb9e3090c51b1eeeca049ac9783310de2ba
```

---

## ⚠️ **Important Security Notes**

### **Secret Key (sk_)**
- ✅ Use in: API routes, server-side code
- ❌ Never in: React components, client-side code
- ❌ Never commit to Git
- ✅ Store in: Environment variables only

### **Public Key (pk_)**
- ✅ Safe in: React components, client code
- ✅ Can be in: Git (though better in env)
- ✅ Use for: Form submissions, tracking

---

## 🧪 **Testing Your Setup**

After adding your SECRET key:

1. **Restart your dev server**:
```bash
npm run dev
```

2. **Test the subscription**:
- Visit http://localhost:3000/newsletter
- Enter test email
- Check Plunk dashboard for new contact

3. **Check logs**:
You should see:
```
Welcome email sent to: test@example.com
```

Instead of:
```
Plunk API key not configured - using local storage only
```

---

## 🚨 **Troubleshooting**

### **"Invalid API Key" Error**
- Make sure you're using SECRET key (sk_) not PUBLIC key (pk_)
- Check for extra spaces or quotes
- Verify key hasn't been revoked in Plunk dashboard

### **"Sender not configured" Error**
1. Go to Plunk Dashboard → Email → Senders
2. Add sender: newsletter@ideaoasis.kr
3. Or use default: noreply@useplunk.com

### **Emails Not Sending**
- Check Plunk dashboard → Logs for errors
- Verify email address is valid
- Check your Plunk credit balance

---

## 📊 **Plunk Dashboard Quick Links**

- **API Keys**: https://app.useplunk.com/settings/api-keys
- **Contacts**: https://app.useplunk.com/contacts
- **Email Logs**: https://app.useplunk.com/emails
- **Senders**: https://app.useplunk.com/settings/senders
- **Analytics**: https://app.useplunk.com/analytics

---

**Next Step**: Get your SECRET key from the Plunk dashboard and add it to `.env.local`!