import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Download, Palette, Type, Heart, RotateCcw, Crop, X, ExternalLink, Github, Linkedin, MessageCircle, Star, Award, Zap, ChevronDown, ChevronUp } from 'lucide-react';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [badgeText, setBadgeText] = useState('#OpenToWork');
  const [badgeColor, setBadgeColor] = useState('#0073b1');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(18);
  const [imageScale, setImageScale] = useState(1);
  const [imageOffsetX, setImageOffsetX] = useState(0);
  const [imageOffsetY, setImageOffsetY] = useState(0);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [showCharity, setShowCharity] = useState(false);
  const [backgroundType, setBackgroundType] = useState('white'); // white or transparent
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const canvasRef = useRef(null);
  const svgRef = useRef(null);

  // Professional badge text presets
  const badgePresets = [
    { text: '#OpenToWork', color: '#0073b1', name: 'Open to Work' },
    { text: '#Hiring', color: '#057642', name: 'Hiring' },
    { text: '#Freelancer', color: '#7c3aed', name: 'Freelancer' },
    { text: '#JobSeeker', color: '#dc2626', name: 'Job Seeker' },
    { text: '#Available', color: '#059669', name: 'Available' },
    { text: '#BuildBold', color: '#ea580c', name: 'Build Bold' },
    { text: '#OpenToNetwork', color: '#0891b2', name: 'Open to Network' },
    { text: '#Consultant', color: '#7c2d12', name: 'Consultant' }
  ];

  // FAQ Data
  const faqs = [
    {
      question: "What is a LinkedIn Badge?",
      answer: "A LinkedIn badge is a customizable overlay that appears on your profile picture, indicating your professional status like 'Open to Work', 'Hiring', or 'Freelancer'. It helps you stand out and communicate your availability to potential employers or clients."
    },
    {
      question: "How do I use this badge generator?",
      answer: "Simply upload your profile photo, choose a badge preset or create custom text, adjust colors and size, then download your new LinkedIn-ready profile picture with the badge overlay."
    },
    {
      question: "What image formats are supported?",
      answer: "We support PNG, JPG, and JPEG formats. For best results, use square images with high resolution (at least 400x400 pixels)."
    },
    {
      question: "Is this service really free?",
      answer: "Yes! This LinkedIn badge generator is completely free to use. We believe in helping professionals enhance their online presence without any cost."
    },
    {
      question: "Can I customize the badge colors?",
      answer: "Absolutely! You can choose from our professional color presets or use the color picker to create your own custom colors for both the badge and text."
    },
    {
      question: "How do I add the badge to my LinkedIn profile?",
      answer: "After downloading your badge image, go to LinkedIn → Settings → Profile → Profile Photo → Change Photo, and upload your new badge image."
    },
    {
      question: "Will this work on mobile devices?",
      answer: "Yes! Our badge generator is fully responsive and works perfectly on mobile phones, tablets, and desktop computers."
    },
    {
      question: "Can I use this for other social media?",
      answer: "While designed for LinkedIn, you can use these badges on other professional platforms like Twitter, Facebook, or your personal website."
    }
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        // Reset crop settings when new image is uploaded
        setImageScale(1);
        setImageOffsetX(0);
        setImageOffsetY(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const drawBadge = useCallback(() => {
    if (!selectedImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Set canvas size for high-quality LinkedIn badge
      const canvasSize = 400;
      canvas.width = canvasSize;
      canvas.height = canvasSize;

      // Clear canvas and set background
      ctx.clearRect(0, 0, canvasSize, canvasSize);
      
      if (backgroundType === 'white') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvasSize, canvasSize);
      }

      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;
      const radius = canvasSize / 2 - 20;

      // Create circular clipping path for profile image
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();

      // Calculate image dimensions with user controls
      const imgAspect = img.width / img.height;
      let sourceWidth, sourceHeight, sourceX, sourceY;

      if (imgAspect > 1) {
        // Landscape image
        sourceHeight = img.height;
        sourceWidth = img.height;
        sourceX = (img.width - sourceWidth) / 2;
        sourceY = 0;
      } else {
        // Portrait or square image
        sourceWidth = img.width;
        sourceHeight = img.width;
        sourceX = 0;
        sourceY = (img.height - sourceHeight) / 2;
      }

      // Apply user adjustments
      const scaleFactor = 1 / imageScale;
      const adjustedWidth = sourceWidth * scaleFactor;
      const adjustedHeight = sourceHeight * scaleFactor;
      const adjustedX = sourceX + (sourceWidth - adjustedWidth) / 2 + (imageOffsetX * sourceWidth / 200);
      const adjustedY = sourceY + (sourceHeight - adjustedHeight) / 2 + (imageOffsetY * sourceHeight / 200);

      // Draw the profile image
      const destSize = radius * 2;
      const destX = centerX - destSize / 2;
      const destY = centerY - destSize / 2;

      ctx.drawImage(
        img,
        adjustedX, adjustedY, adjustedWidth, adjustedHeight,
        destX, destY, destSize, destSize
      );
      ctx.restore();

      // Add circular border
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    img.src = selectedImage;
  }, [selectedImage, imageScale, imageOffsetX, imageOffsetY, backgroundType]);

  useEffect(() => {
    drawBadge();
  }, [drawBadge]);

  const downloadImage = () => {
    if (!canvasRef.current || !svgRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Get SVG source
      const svgElement = svgRef.current;
      const serializer = new XMLSerializer();
      const svgData = serializer.serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      // Create SVG image
      const svgImg = new Image();
      svgImg.onload = () => {
        // Set canvas size
        const canvasSize = 400;
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        
        // Clear and set background
        ctx.clearRect(0, 0, canvasSize, canvasSize);
        if (backgroundType === 'white') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvasSize, canvasSize);
        }
        
        // Draw profile image
        const centerX = canvasSize / 2;
        const centerY = canvasSize / 2;
        const radius = canvasSize / 2 - 20;
        
        // Create circular clipping for profile image
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.clip();
        
        // Calculate image dimensions
        const imgAspect = img.width / img.height;
        let sourceWidth, sourceHeight, sourceX, sourceY;
        
        if (imgAspect > 1) {
          sourceHeight = img.height;
          sourceWidth = img.height;
          sourceX = (img.width - sourceWidth) / 2;
          sourceY = 0;
        } else {
          sourceWidth = img.width;
          sourceHeight = img.width;
          sourceX = 0;
          sourceY = (img.height - sourceHeight) / 2;
        }
        
        // Apply user adjustments
        const scaleFactor = 1 / imageScale;
        const adjustedWidth = sourceWidth * scaleFactor;
        const adjustedHeight = sourceHeight * scaleFactor;
        const adjustedX = sourceX + (sourceWidth - adjustedWidth) / 2 + (imageOffsetX * sourceWidth / 200);
        const adjustedY = sourceY + (sourceHeight - adjustedHeight) / 2 + (imageOffsetY * sourceHeight / 200);
        
        const destSize = radius * 2;
        const destX = centerX - destSize / 2;
        const destY = centerY - destSize / 2;
        
        ctx.drawImage(
          img,
          adjustedX, adjustedY, adjustedWidth, adjustedHeight,
          destX, destY, destSize, destSize
        );
        ctx.restore();
        
        // Add circular border
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw SVG badge overlay
        ctx.drawImage(svgImg, 0, 0, canvasSize, canvasSize);
        
        // Download the combined image
        const link = document.createElement('a');
        link.download = 'linkedin-badge.png';
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        
        // Show portfolio modal
        setShowPortfolio(true);
      };
      svgImg.src = svgUrl;
    };
    img.src = selectedImage;
  };

  const resetCrop = () => {
    setImageScale(1);
    setImageOffsetX(0);
    setImageOffsetY(0);
  };

  const applyPreset = (preset) => {
    setBadgeText(preset.text);
    setBadgeColor(preset.color);
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Social Links */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                LinkedIn Badge Generator
              </h1>
              <p className="text-gray-600 text-sm">
                Create professional LinkedIn badges with custom text and colors
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-gray-700 font-medium">Free & Easy to Use</span>
              </div>
              <div className="flex space-x-2">
                <a
                  href="https://github.com/usmanghias"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="GitHub Profile"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com/in/m-UsmanGhias"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://wa.me/03126912440"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="WhatsApp Contact"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Controls */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Customize Your Badge
            </h2>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Profile Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-gray-600 text-sm">
                    Click to upload your profile photo
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </label>
              </div>
            </div>

            {/* Badge Presets */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Badge Options
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {badgePresets.map((preset) => (
                  <button
                    key={preset.text}
                    onClick={() => applyPreset(preset)}
                    className="p-2 text-xs bg-gray-100 hover:bg-blue-100 rounded transition-colors text-left"
                    style={{ borderLeft: `3px solid ${preset.color}` }}
                  >
                    <div className="font-medium">{preset.name}</div>
                    <div className="text-gray-600">{preset.text}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Badge Text */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Badge Text
              </label>
              <div className="flex items-center space-x-2">
                <Type className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2 border"
                  placeholder="#OpenToWork"
                />
              </div>
            </div>

            {/* Font Size */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Size: {fontSize}px
              </label>
              <input
                type="range"
                min="18"
                max="32"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Image Cropping Controls */}
            {selectedImage && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-800 flex items-center text-sm">
                    <Crop className="h-4 w-4 mr-2" />
                    Adjust Image
                  </h3>
                  <button
                    onClick={resetCrop}
                    className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Zoom: {Math.round(imageScale * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={imageScale}
                      onChange={(e) => setImageScale(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Horizontal
                      </label>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={imageOffsetX}
                        onChange={(e) => setImageOffsetX(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Vertical
                      </label>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={imageOffsetY}
                        onChange={(e) => setImageOffsetY(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Badge Color */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Badge Color
              </label>
              <div className="flex items-center space-x-2 mb-3">
                <Palette className="h-4 w-4 text-gray-400" />
                <input
                  type="color"
                  value={badgeColor}
                  onChange={(e) => setBadgeColor(e.target.value)}
                  className="h-8 w-16 rounded border-gray-300"
                />
                <span className="text-xs text-gray-500">{badgeColor}</span>
              </div>
              
              {/* Color Presets */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { color: '#0073b1', name: 'LinkedIn Blue' },
                  { color: '#057642', name: 'Available Green' },
                  { color: '#7c3aed', name: 'Premium Purple' },
                  { color: '#dc2626', name: 'Urgent Red' }
                ].map(({ color, name }) => (
                  <button
                    key={color}
                    onClick={() => setBadgeColor(color)}
                    className="w-full h-6 rounded border border-gray-300 hover:border-gray-500 transition-colors"
                    style={{ backgroundColor: color }}
                    title={name}
                  />
                ))}
              </div>
            </div>

            {/* Text Color */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="h-8 w-16 rounded border-gray-300"
                />
                <span className="text-xs text-gray-500">{textColor}</span>
              </div>
            </div>

            {/* Background Option */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="background"
                    value="white"
                    checked={backgroundType === 'white'}
                    onChange={(e) => setBackgroundType(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">White (Recommended)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="background"
                    value="transparent"
                    checked={backgroundType === 'transparent'}
                    onChange={(e) => setBackgroundType(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">Transparent</span>
                </label>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={downloadImage}
              disabled={!selectedImage}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download Badge</span>
            </button>

            {/* Charity Button */}
            <button
              onClick={() => setShowCharity(true)}
              className="w-full mt-3 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Heart className="h-4 w-4" />
              <span>Help Hungry People (10 PKR)</span>
            </button>
          </div>

          {/* Right Panel - Preview */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Preview
            </h2>
            
            <div className="flex justify-center">
              {selectedImage ? (
                <div className="relative">
                  <div className={`p-4 rounded-lg ${backgroundType === 'transparent' ? 'bg-gray-100' : 'bg-gray-100'}`} 
                       style={backgroundType === 'transparent' ? { 
                         backgroundImage: 'url("data:image/svg+xml,%3csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cg fill=\'%23f3f4f6\' fill-opacity=\'0.4\'%3e%3crect x=\'0\' y=\'0\' width=\'10\' height=\'10\'/%3e%3crect x=\'10\' y=\'10\' width=\'10\' height=\'10\'/%3e%3c/g%3e%3c/svg%3e")' 
                       } : {}}>
                    <div className="relative inline-block">
                      <canvas
                        ref={canvasRef}
                        className="max-w-full h-auto rounded-lg shadow-sm"
                        style={{ maxWidth: '280px', height: 'auto' }}
                      />
                      {/* SVG Badge Overlay */}
                      <svg
                        ref={svgRef}
                        width="280"
                        height="280"
                        className="absolute top-0 left-0 pointer-events-none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ position: 'absolute', top: 0, left: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="profileRingGradient"
                            x1="140"
                            y1="220"
                            x2="180"
                            y2="160"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor={badgeColor}></stop>
                            <stop offset="1" stopColor="#000000" stopOpacity="0"></stop>
                          </linearGradient>
                        </defs>
                        <path
                          d="M 140 140
                            m -110, 0
                            a 110,110 0 1,0 220,0
                            a 110,110 0 1,0 -220,0"
                          id="profileRingTextPath"
                          fill="none"
                          stroke="url(#profileRingGradient)"
                          strokeWidth="40"
                        ></path>
                        <text dy="0.3em" fontSize={`${fontSize}px`}>
                          <textPath 
                            style={{
                              fill: textColor,
                              fontWeight: '700',
                              letterSpacing: '1px',
                              fontFamily: 'sans-serif'
                            }} 
                            startOffset="2%" 
                            xlinkHref="#profileRingTextPath"
                          >
                            {badgeText}
                          </textPath>
                        </text>
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    400x400px • Ready for LinkedIn
                  </p>
                </div>
              ) : (
                <div className="w-64 h-64 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center text-gray-500">
                    <Upload className="mx-auto h-10 w-10 mb-2" />
                    <p className="text-sm">Upload your photo</p>
                    <p className="text-xs">to see preview</p>
                  </div>
                </div>
              )}
            </div>

            {/* Stats Section */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="flex flex-wrap items-center justify-center space-x-6 text-center">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-sm">Lightning Fast</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-semibold text-sm">100% Free</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-purple-600" />
                  <span className="font-semibold text-sm">Premium Quality</span>
                </div>
              </div>
            </div>

            {/* Enhanced Tips Section */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Award className="h-4 w-4 mr-2" />
                Pro Tips for Best Results
              </h3>
              <ul className="text-sm text-gray-800 space-y-2">
                <li className="flex items-start">
                  <span className="text-gray-600 mr-2">•</span>
                  <span><strong>High-quality photo:</strong> Use clear, well-lit images with good resolution (at least 400x400px)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-600 mr-2">•</span>
                  <span><strong>Face positioning:</strong> Center your face in the frame for the best crop results</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-600 mr-2">•</span>
                  <span><strong>Professional attire:</strong> Wear business-appropriate clothing for a polished look</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-600 mr-2">•</span>
                  <span><strong>Background:</strong> Choose a clean, uncluttered background (white works best for LinkedIn)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-600 mr-2">•</span>
                  <span><strong>Lighting:</strong> Ensure good lighting on your face to avoid shadows</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-600 mr-2">•</span>
                  <span><strong>Expression:</strong> Use a professional, friendly expression that matches your industry</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Dropdown FAQ Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {openFaqIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openFaqIndex === index && (
                  <div className="px-4 pb-3 text-gray-600 text-sm border-t border-gray-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact & Support Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Need Help or Want to Connect?
            </h3>
            <div className="flex flex-wrap justify-center items-center space-x-6 text-sm">
              <a
                href="https://github.com/usmanghias"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
              <a
                href="https://linkedin.com/in/m-UsmanGhias"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
              >
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://wa.me/03126912440"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-700 hover:text-green-600"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Portfolio Modal */}
        {showPortfolio && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Check Out My Portfolio</h3>
                <button
                  onClick={() => setShowPortfolio(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
              
              {/* Body */}
              <div className="p-4 sm:p-6">
                <div className="text-center mb-4 sm:mb-6">
                  <Heart className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-red-500 mb-2 sm:mb-3" />
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    Thanks for using our badge generator! Check out my portfolio for more projects.
                  </p>
                </div>
                
                {/* Portfolio Link */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                  <div className="text-center">
                    <p className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Portfolio</p>
                    <a 
                      href="https://usman.codcrafters.org" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-lg block break-all"
                    >
                      usman.codcrafters.org
                    </a>
                    <p className="text-xs sm:text-sm text-blue-700 mt-2">
                      Web Development • React • Node.js • Full Stack
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 p-4 sm:p-6 border-t bg-gray-50 sticky bottom-0">
                <a
                  href="https://usman.codcrafters.org"
          target="_blank"
          rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>View Portfolio</span>
                </a>
                <button
                  onClick={() => setShowPortfolio(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors text-sm sm:text-base"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Charity Modal */}
        {showCharity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Help Hungry People</h3>
                <button
                  onClick={() => setShowCharity(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
              
              {/* Body */}
              <div className="p-4 sm:p-6">
                <div className="text-center mb-4 sm:mb-6">
                  <Heart className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-red-500 mb-2 sm:mb-3" />
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    Your small contribution of 10 PKR can help feed hungry people in Pakistan. Every bit counts!
                  </p>
                </div>
                
                {/* EasyPaisa Details */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                  <div className="text-center">
                    <p className="font-semibold text-green-800 mb-2 text-sm sm:text-base">EasyPaisa Payment Details</p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs sm:text-sm text-green-700">Account Name:</p>
                        <p className="font-mono text-sm sm:text-lg text-green-900 break-all">Muhammad Usman Khan</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-green-700">Mobile Number:</p>
                        <p className="font-mono text-sm sm:text-lg text-green-900">03126912440</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-green-700">Amount:</p>
                        <p className="font-bold text-lg sm:text-xl text-green-900">10 PKR</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                  <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">How to Send:</h4>
                  <ol className="text-xs sm:text-sm text-blue-800 space-y-1">
                    <li>1. Open EasyPaisa app or dial *786#</li>
                    <li>2. Send 10 PKR to 03126912440</li>
                    <li>3. Your contribution will help feed the needy</li>
                  </ol>
                </div>
              </div>
              
              {/* Footer */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 p-4 sm:p-6 border-t bg-gray-50 sticky bottom-0">
                <button
                  onClick={() => setShowCharity(false)}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base"
                >
                  Got it, Thanks!
                </button>
                <button
                  onClick={() => setShowCharity(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors text-sm sm:text-base"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
