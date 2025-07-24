# Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow the prompts:**
   - Link to existing project: No
   - Project name: linkedin-badge-generator (or your preferred name)
   - Directory: ./ (current directory)
   - Override settings: No

4. **Your app will be live at:** `https://your-project-name.vercel.app`

### Option 2: Netlify

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `build` folder to the deploy area
   - Or connect your GitHub repository for automatic deployments

3. **Your app will be live at:** `https://your-project-name.netlify.app`

### Option 3: GitHub Pages

1. **Add homepage to package.json:**
   ```json
   {
     "homepage": "https://yourusername.github.io/linkedin-badge-generator"
   }
   ```

2. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Add scripts to package.json:**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

## 🔧 Custom Domain Setup

### Vercel
1. Go to your project dashboard
2. Click on "Settings" → "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

### Netlify
1. Go to your site dashboard
2. Click on "Domain settings"
3. Add your custom domain
4. Configure DNS records as instructed

## 📱 Environment Variables

If you need to add environment variables later:

### Vercel
```bash
vercel env add VARIABLE_NAME
```

### Netlify
- Go to Site settings → Environment variables
- Add your variables

## 🔄 Continuous Deployment

### Vercel
- Automatically deploys when you push to your main branch
- Preview deployments for pull requests

### Netlify
- Automatically deploys when you push to your main branch
- Preview deployments for pull requests

## 📊 Performance Optimization

The app is already optimized with:
- ✅ Code splitting
- ✅ Gzip compression
- ✅ Optimized bundle size (~62KB gzipped)
- ✅ Lazy loading
- ✅ Service worker ready

## 🛠️ Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Deployment Issues
1. Check if all dependencies are in `package.json`
2. Ensure `vercel.json` is in the root directory
3. Verify the build command works locally

### Performance Issues
1. Check bundle size: `npm run build`
2. Optimize images before upload
3. Consider lazy loading for large components

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure Node.js version is 14 or higher
4. Check the deployment platform's status page 