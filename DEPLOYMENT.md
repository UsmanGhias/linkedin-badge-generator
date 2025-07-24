# Deployment Guide

## 🚀 Vercel Deployment (Recommended)

### Option 1: Deploy via Vercel Dashboard

1. **Go to [Vercel](https://vercel.com)**
   - Sign up/Login with your GitHub account

2. **Import Repository**
   - Click "New Project"
   - Import `linkedin-badge-generator` from your GitHub
   - Vercel will automatically detect it's a React app

3. **Configure Settings**
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Your app will be live in minutes!

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow the prompts**
   - Link to existing project or create new
   - Choose settings
   - Deploy!

## 🌐 Custom Domain Setup

1. **In Vercel Dashboard**
   - Go to your project settings
   - Click "Domains"
   - Add your custom domain

2. **DNS Configuration**
   - Add CNAME record pointing to your Vercel URL
   - Wait for DNS propagation (up to 48 hours)

## 📱 Environment Variables

No environment variables are required for this project.

## 🔧 Build Configuration

The project includes:
- `vercel.json` - Optimized for Vercel deployment
- `package.json` - Standard React scripts
- `tailwind.config.js` - Tailwind CSS configuration

## 🚀 Alternative Deployment Options

### Netlify

1. **Connect GitHub**
   - Go to [Netlify](https://netlify.com)
   - Connect your GitHub account

2. **Deploy Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `build`

3. **Deploy**
   - Click "Deploy site"

### GitHub Pages

1. **Add homepage to package.json**
   ```json
   {
     "homepage": "https://usmanghias.github.io/linkedin-badge-generator"
   }
   ```

2. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Add scripts to package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

## 🔍 Post-Deployment Checklist

- [ ] Test all features work correctly
- [ ] Verify mobile responsiveness
- [ ] Check image upload functionality
- [ ] Test badge generation and download
- [ ] Verify social links work
- [ ] Test charity modal on mobile
- [ ] Check FAQ section
- [ ] Verify usage counter works

## 🛠️ Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version (14+ required)
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall

2. **Images Not Loading**
   - Check file paths
   - Verify image formats (PNG, JPG, JPEG)

3. **Modal Not Responsive**
   - Clear browser cache
   - Check CSS classes are applied

4. **Download Not Working**
   - Check browser permissions
   - Verify canvas API support

## 📊 Performance Optimization

The app is optimized for:
- ✅ Fast loading times
- ✅ Mobile performance
- ✅ SEO-friendly
- ✅ Accessibility compliance
- ✅ Cross-browser compatibility

## 🔒 Security

- No sensitive data stored
- Client-side only processing
- No external API calls
- Secure file handling

---

**Ready to deploy? Your LinkedIn Badge Generator is production-ready! 🎉** 