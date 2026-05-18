# AR Sunglass E-Commerce Website — পূর্ণ Project Plan

> **Project Name:** VISO Eyewear  
> **Type:** 3D + AR E-Commerce (Sunglass Virtual Try-On)  
> **Stack:** React · Three.js · MediaPipe · Node.js · MongoDB  
> **Target Market:** Bangladesh + South Asia  
> **Estimated Timeline:** 8 Weeks (Solo Dev) / 4 Weeks (Team)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [System Architecture](#3-system-architecture)
4. [Feature List](#4-feature-list)
5. [AR Try-On — Technical Deep Dive](#5-ar-try-on--technical-deep-dive)
6. [3D Product Viewer](#6-3d-product-viewer)
7. [E-Commerce Core](#7-e-commerce-core)
8. [Backend API Design](#8-backend-api-design)
9. [Database Schema](#9-database-schema)
10. [Phase-wise Development Plan](#10-phase-wise-development-plan)
11. [Folder Structure](#11-folder-structure)
12. [Payment Integration (Bangladesh)](#12-payment-integration-bangladesh)
13. [3D Model Pipeline](#13-3d-model-pipeline)
14. [Performance Optimization](#14-performance-optimization)
15. [Deployment](#15-deployment)
16. [Cost Estimate](#16-cost-estimate)

---

## 1. Project Overview

একটি **premium sunglass e-commerce website** যেখানে user তাদের ক্যামেরা দিয়ে real-time এ সানগ্লাস try-on করতে পারবে। Face detection দিয়ে মুখের উপর 3D সানগ্লাস overlay করা হবে।

### মূল USP (Unique Selling Points)

| Feature | Description |
|---|---|
| AR Virtual Try-On | ক্যামেরায় মুখ দেখালে 3D সানগ্লাস পরে যাবে |
| 360° 3D Viewer | Product page এ সানগ্লাস ঘোরানো যাবে |
| Face Shape Advisor | AI দিয়ে face shape detect করে সানগ্লাস recommend করবে |
| Mobile AR | Android/iOS এ native-like AR experience |
| BD Payment | bKash, Nagad, SSLCommerz, Card সব supported |

---

## 2. Tech Stack

### Frontend
```
React 18 + Vite
├── React Three Fiber      → 3D rendering (Three.js wrapper)
├── @react-three/drei      → Helpers (OrbitControls, GLTF loader, etc.)
├── @react-three/xr        → WebXR / AR support
├── @mediapipe/face_mesh   → Face landmark detection (468 points)
├── @tensorflow/tfjs       → ML model runtime
├── Zustand                → State management
├── React Router v6        → Routing
├── Axios                  → HTTP client
└── Tailwind CSS           → Styling
```

### Backend
```
Node.js + Express
├── MongoDB + Mongoose     → Database
├── JWT + bcrypt           → Authentication
├── Multer + Sharp         → Image/3D asset upload
├── AWS S3 / Cloudinary    → Asset storage
├── Redis                  → Session cache
└── Stripe + SSLCommerz    → Payment
```

### DevOps
```
Vercel / Netlify           → Frontend hosting
Railway / Render           → Backend hosting
MongoDB Atlas              → Cloud database
Cloudflare                 → CDN + DDoS protection
```

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│                                                          │
│  ┌──────────────┐   ┌──────────────┐  ┌──────────────┐  │
│  │  React UI    │   │  Three.js    │  │  MediaPipe   │  │
│  │  (Product,   │   │  (3D Viewer, │  │  (Face Mesh, │  │
│  │   Cart, etc) │   │   AR Overlay)│  │   468 pts)   │  │
│  └──────┬───────┘   └──────┬───────┘  └──────┬───────┘  │
│         └──────────────────┴─────────────────┘          │
│                             │                            │
└─────────────────────────────┼────────────────────────────┘
                              │ REST API / WebSocket
┌─────────────────────────────┼────────────────────────────┐
│                    SERVER (Node.js)                       │
│                             │                            │
│  ┌──────────┐  ┌──────────┐ │ ┌──────────┐ ┌──────────┐  │
│  │  Auth    │  │ Product  │ │ │  Order   │ │ Payment  │  │
│  │  Service │  │  API     │ │ │  Service │ │ Gateway  │  │
│  └──────────┘  └──────────┘ │ └──────────┘ └──────────┘  │
│         │           │       │       │           │         │
│  ┌──────┴───────────┴───────┴───────┴───────────┴──────┐  │
│  │              MongoDB + Redis Cache                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────┼────────────────────────────┐
│                   Storage (AWS S3)                       │
│  ┌──────────────┐   ┌──────────────┐  ┌──────────────┐  │
│  │  3D Models   │   │   Product    │  │  User        │  │
│  │  (.glb/.gltf)│   │   Images     │  │  Avatars     │  │
│  └──────────────┘   └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Feature List

### Phase 1 Features (MVP)
- [ ] Product catalog (grid + list view)
- [ ] Product detail page with 3D viewer
- [ ] Basic AR try-on (webcam)
- [ ] Cart & checkout
- [ ] User authentication (register/login)
- [ ] Order placement
- [ ] SSLCommerz payment

### Phase 2 Features
- [ ] Face shape detection (AI recommend)
- [ ] Wishlist / Favorites
- [ ] Product reviews & ratings
- [ ] Search + advanced filters
- [ ] Order tracking
- [ ] Admin dashboard
- [ ] bKash / Nagad direct payment

### Phase 3 Features (Advanced)
- [ ] Mobile AR (WebXR / React Native)
- [ ] Social sharing (AR photo)
- [ ] Size recommendation engine
- [ ] Prescription lens option
- [ ] Loyalty points system
- [ ] Multi-language (English + Bangla)

---

## 5. AR Try-On — Technical Deep Dive

### কীভাবে কাজ করে

```
User এর Camera
      ↓
getUserMedia() — webcam stream
      ↓
MediaPipe Face Mesh — প্রতি frame এ 468টি landmark detect
      ↓
Key Points Extract করো:
  • Point 168  → Nose bridge (center)
  • Point 33   → Left eye inner corner
  • Point 263  → Right eye inner corner
  • Point 234  → Left temple
  • Point 454  → Right temple
  • Points 1-4 → Head tilt/rotation
      ↓
Three.js Scene এ 3D Glass Model Position করো
      ↓
Camera Feed + 3D Canvas Overlay → User দেখতে পায়
```

### Implementation Code

```javascript
// src/components/ARTryOn/useFaceMesh.js
import { useEffect, useRef, useState } from 'react';
import * as facemesh from '@mediapipe/face_mesh';
import * as cam from '@mediapipe/camera_utils';

export function useFaceMesh() {
  const videoRef = useRef(null);
  const [landmarks, setLandmarks] = useState(null);

  useEffect(() => {
    const faceMesh = new facemesh.FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,       // চোখের iris tracking
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      if (results.multiFaceLandmarks?.[0]) {
        setLandmarks(results.multiFaceLandmarks[0]);
      }
    });

    if (videoRef.current) {
      const camera = new cam.Camera(videoRef.current, {
        onFrame: async () => {
          await faceMesh.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, []);

  return { videoRef, landmarks };
}
```

```javascript
// src/components/ARTryOn/SunglassOverlay.jsx
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

export function SunglassOverlay({ landmarks, modelPath }) {
  const { scene } = useGLTF(modelPath);
  const glassRef = useRef();

  useFrame(() => {
    if (!landmarks || !glassRef.current) return;

    // Key landmarks
    const noseBridge = landmarks[168];  // Center
    const leftEye    = landmarks[33];   // Left
    const rightEye   = landmarks[263];  // Right

    // Position — nose bridge এ center করো
    glassRef.current.position.set(
      (noseBridge.x - 0.5) * 2,
      -(noseBridge.y - 0.5) * 2,
      -noseBridge.z * 2
    );

    // Scale — দুই চোখের দূরত্ব থেকে বের করো
    const eyeDistance = Math.sqrt(
      Math.pow(rightEye.x - leftEye.x, 2) +
      Math.pow(rightEye.y - leftEye.y, 2)
    );
    const scale = eyeDistance * 4.5;
    glassRef.current.scale.setScalar(scale);

    // Rotation — মাথার tilt follow করো
    const dx = rightEye.x - leftEye.x;
    const dy = rightEye.y - leftEye.y;
    glassRef.current.rotation.z = -Math.atan2(dy, dx);
  });

  return <primitive ref={glassRef} object={scene} />;
}
```

```jsx
// src/pages/ARTryOnPage.jsx
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFaceMesh } from '../components/ARTryOn/useFaceMesh';
import { SunglassOverlay } from '../components/ARTryOn/SunglassOverlay';

export default function ARTryOnPage({ selectedGlass }) {
  const { videoRef, landmarks } = useFaceMesh();

  return (
    <div style={{ position: 'relative', width: 640, height: 480 }}>
      {/* Camera feed */}
      <video
        ref={videoRef}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        autoPlay muted playsInline
      />

      {/* 3D Overlay */}
      <Canvas
        style={{ position: 'absolute', inset: 0 }}
        camera={{ fov: 60, near: 0.01, far: 100 }}
        gl={{ alpha: true }}  // transparent background
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[0, 1, 2]} intensity={1} />
        <Suspense fallback={null}>
          {landmarks && (
            <SunglassOverlay
              landmarks={landmarks}
              modelPath={selectedGlass.modelUrl}
            />
          )}
        </Suspense>
      </Canvas>

      {/* Screenshot button */}
      <button onClick={() => captureAR(videoRef)}>
        📸 Photo তুলো
      </button>
    </div>
  );
}
```

### AR Screenshot Share করা
```javascript
async function captureAR(videoRef) {
  const canvas = document.createElement('canvas');
  canvas.width = 640; canvas.height = 480;
  const ctx = canvas.getContext('2d');

  // Camera frame draw করো
  ctx.drawImage(videoRef.current, 0, 0);

  // 3D canvas overlay করো
  const threeCanvas = document.querySelector('canvas.r3f');
  ctx.drawImage(threeCanvas, 0, 0);

  // Download করো
  const link = document.createElement('a');
  link.download = 'my-sunglass-look.png';
  link.href = canvas.toDataURL();
  link.click();
}
```

---

## 6. 3D Product Viewer

### Setup
```bash
npm install @react-three/fiber @react-three/drei three
```

### Component
```jsx
// src/components/ProductViewer3D.jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import { Suspense } from 'react';

function GlassModel({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} />;
}

export function ProductViewer3D({ modelUrl }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.5], fov: 45 }}
      style={{ height: 400, background: '#0f0f1a', borderRadius: 16 }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <Environment preset="studio" />       {/* HDRI reflection */}

      {/* Model */}
      <Suspense fallback={null}>
        <GlassModel url={modelUrl} />
        <ContactShadows
          position={[0, -0.8, 0]}
          opacity={0.6}
          scale={3}
          blur={2}
        />
      </Suspense>

      {/* Controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={2}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}
```

### GLB Model Optimization
```bash
# Blender থেকে export করার পর optimize করো
npm install -g @gltf-transform/cli

# Compress করো
gltf-transform optimize input.glb output.glb --compress draco

# Target: < 500KB per model
```

---

## 7. E-Commerce Core

### Product Page Features
- High-res images (zoom on hover)
- 3D model viewer
- AR Try-On button
- Size/color selector
- Quantity picker
- Add to Cart / Buy Now
- Wishlist toggle
- Reviews section
- Related products

### Cart System (Zustand)
```javascript
// src/store/cartStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const existing = get().items.find(i => i._id === product._id);
        if (existing) {
          set({ items: get().items.map(i =>
            i._id === product._id ? { ...i, qty: i.qty + 1 } : i
          )});
        } else {
          set({ items: [...get().items, { ...product, qty: 1 }] });
        }
      },

      removeItem: (id) =>
        set({ items: get().items.filter(i => i._id !== id) }),

      updateQty: (id, qty) =>
        set({ items: get().items.map(i => i._id === id ? { ...i, qty } : i) }),

      clearCart: () => set({ items: [] }),

      total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      count: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: 'viso-cart' }  // localStorage তে save হবে
  )
);
```

---

## 8. Backend API Design

### Endpoints

#### Auth
```
POST   /api/auth/register     → নতুন user তৈরি
POST   /api/auth/login        → Login, JWT return
POST   /api/auth/logout       → Token invalidate
GET    /api/auth/me           → Current user info
POST   /api/auth/forgot       → Password reset email
```

#### Products
```
GET    /api/products          → সব product (filter, sort, paginate)
GET    /api/products/:id      → Single product
GET    /api/products/featured → Featured products
POST   /api/products          → নতুন product (Admin only)
PUT    /api/products/:id      → Update product (Admin)
DELETE /api/products/:id      → Delete product (Admin)
```

#### Orders
```
POST   /api/orders            → Order তৈরি করো
GET    /api/orders/my         → User এর orders
GET    /api/orders/:id        → Single order detail
PUT    /api/orders/:id/pay    → Payment confirm
PUT    /api/orders/:id/status → Status update (Admin)
```

#### Reviews
```
POST   /api/products/:id/reviews   → Review দাও
GET    /api/products/:id/reviews   → Reviews দেখো
DELETE /api/reviews/:id            → Review মুছো
```

#### Upload
```
POST   /api/upload/image      → Product image upload
POST   /api/upload/model      → 3D GLB model upload
```

### Express Server Setup
```javascript
// server/index.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Body parser
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/upload',   uploadRoutes);

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

connectDB().then(() => {
  app.listen(process.env.PORT || 5000, () =>
    console.log('Server running ✓')
  );
});
```

---

## 9. Database Schema

### Product Schema
```javascript
// server/models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  brand:        { type: String, default: 'VISO' },
  price:        { type: Number, required: true },
  originalPrice:{ type: Number },
  description:  { type: String },
  style:        { type: String, enum: ['Aviator','Round','Wayfarer','Cat-Eye','Wrap','Shield'] },
  material:     String,
  uvProtection: { type: String, enum: ['UV400', 'UV500'] },
  faceShapes:   [{ type: String }],
  colors: [{
    name:       String,
    frameColor: String,
    lensColor:  String,
    images:     [String],
    modelUrl:   String,       // S3 URL to .glb file
    stock:      { type: Number, default: 0 },
  }],
  rating:       { type: Number, default: 0 },
  numReviews:   { type: Number, default: 0 },
  isFeatured:   { type: Boolean, default: false },
  tag:          String,
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
```

### Order Schema
```javascript
// server/models/Order.js
const orderSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product:    { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:       String,
    price:      Number,
    qty:        Number,
    color:      String,
    image:      String,
  }],
  shippingAddress: {
    name:       String,
    phone:      String,
    address:    String,
    city:       String,
    district:   String,
    postalCode: String,
  },
  paymentMethod:  { type: String, enum: ['sslcommerz', 'bkash', 'nagad', 'card'] },
  paymentResult: {
    id:         String,
    status:     String,
    transId:    String,
    paidAt:     Date,
  },
  subtotal:     Number,
  shippingCost: { type: Number, default: 0 },
  total:        Number,
  status:       {
    type: String,
    enum: ['pending','paid','processing','shipped','delivered','cancelled'],
    default: 'pending',
  },
  isPaid:       { type: Boolean, default: false },
  isDelivered:  { type: Boolean, default: false },
}, { timestamps: true });
```

---

## 10. Phase-wise Development Plan

### Phase 1 — Foundation (Week 1–2)

**Goal:** Project setup + 3D viewer কাজ করা

```
Week 1
├── Day 1-2: Vite + React setup, folder structure, Tailwind config
├── Day 3-4: React Three Fiber setup, প্রথম 3D model load
├── Day 5:   OrbitControls, lighting, HDRI environment
└── Day 6-7: Product page UI + 3D viewer integrate

Week 2
├── Day 1-2: Node.js backend setup, MongoDB connect
├── Day 3-4: Product API (CRUD), Auth API (JWT)
├── Day 5:   Frontend-backend connect (Axios)
└── Day 6-7: Product listing page, filter, sort
```

**Deliverable:** Product page এ 3D সানগ্লাস ঘোরানো যাচ্ছে ✓

---

### Phase 2 — AR Try-On (Week 3–4)

**Goal:** Camera দিয়ে real-time face tracking

```
Week 3
├── Day 1-2: MediaPipe Face Mesh setup, webcam access
├── Day 3-4: 468 landmark points visualize করো
├── Day 5:   Key points (nose, eyes, temples) extract
└── Day 6-7: Basic 3D model overlay on face

Week 4
├── Day 1-2: Rotation tracking (মাথা নাড়ালে follow করবে)
├── Day 3-4: Scale correction, depth perception
├── Day 5:   Mobile camera support (front camera)
└── Day 6-7: AR screenshot/share feature
```

**Deliverable:** Face এ সানগ্লাস বসছে, মাথা নাড়ালে follow করছে ✓

---

### Phase 3 — E-Commerce (Week 5–6)

**Goal:** Full shopping flow

```
Week 5
├── Day 1-2: Cart system (Zustand + localStorage)
├── Day 3-4: User auth pages (Login, Register)
├── Day 5:   Checkout page (shipping form)
└── Day 6-7: Order creation API

Week 6
├── Day 1-2: SSLCommerz payment integration
├── Day 3-4: bKash payment integration
├── Day 5:   Order confirmation page + email
└── Day 6-7: User profile + order history
```

**Deliverable:** Cart → Checkout → Payment → Order ✓

---

### Phase 4 — Polish & Deploy (Week 7–8)

**Goal:** Production-ready

```
Week 7
├── Day 1-2: Admin dashboard (product management)
├── Day 3-4: Review system, ratings
├── Day 5:   Search functionality
└── Day 6-7: Performance optimization, lazy loading

Week 8
├── Day 1-2: Mobile responsiveness fixes
├── Day 3-4: SEO, meta tags, sitemap
├── Day 5:   Vercel deploy (frontend) + Railway (backend)
└── Day 6-7: Testing, bug fixing, go live 🚀
```

**Deliverable:** Live website ✓

---

## 11. Folder Structure

```
viso-eyewear/
│
├── client/                          # Frontend (React)
│   ├── public/
│   │   └── models/                  # Static 3D models (dev only)
│   ├── src/
│   │   ├── components/
│   │   │   ├── AR/
│   │   │   │   ├── ARTryOn.jsx      # Main AR component
│   │   │   │   ├── FaceOverlay.jsx  # Three.js overlay
│   │   │   │   ├── useFaceMesh.js   # MediaPipe hook
│   │   │   │   └── Screenshot.js   # Capture utility
│   │   │   ├── Viewer3D/
│   │   │   │   ├── ProductViewer.jsx
│   │   │   │   └── GlassModel.jsx
│   │   │   ├── Product/
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductGrid.jsx
│   │   │   │   └── ProductDetail.jsx
│   │   │   ├── Cart/
│   │   │   │   ├── CartDrawer.jsx
│   │   │   │   └── CartItem.jsx
│   │   │   └── UI/
│   │   │       ├── Header.jsx
│   │   │       ├── Footer.jsx
│   │   │       └── Button.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── ProductPage.jsx
│   │   │   ├── ARTryOnPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── OrderSuccess.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Admin/
│   │   │       ├── Dashboard.jsx
│   │   │       └── ProductManager.jsx
│   │   ├── store/
│   │   │   ├── cartStore.js         # Zustand cart
│   │   │   ├── authStore.js         # Zustand auth
│   │   │   └── wishlistStore.js
│   │   ├── hooks/
│   │   │   ├── useProducts.js
│   │   │   └── useOrders.js
│   │   ├── utils/
│   │   │   ├── api.js               # Axios instance
│   │   │   └── faceUtils.js         # Landmark calculations
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── server/                          # Backend (Node.js)
    ├── config/
    │   ├── db.js                    # MongoDB connection
    │   └── aws.js                   # S3 config
    ├── models/
    │   ├── Product.js
    │   ├── User.js
    │   ├── Order.js
    │   └── Review.js
    ├── routes/
    │   ├── auth.js
    │   ├── products.js
    │   ├── orders.js
    │   └── upload.js
    ├── middleware/
    │   ├── auth.js                  # JWT verify
    │   ├── admin.js                 # Admin check
    │   └── upload.js                # Multer config
    ├── controllers/
    │   ├── authController.js
    │   ├── productController.js
    │   └── orderController.js
    ├── utils/
    │   ├── email.js                 # Nodemailer
    │   └── payment.js               # SSLCommerz helper
    ├── index.js
    └── package.json
```

---

## 12. Payment Integration (Bangladesh)

### SSLCommerz (Primary)

```javascript
// server/utils/sslcommerz.js
import SSLCommerzPayment from 'sslcommerz-lts';

export async function initiatePayment(order) {
  const data = {
    total_amount:  order.total,
    currency:      'BDT',
    tran_id:       order._id.toString(),
    success_url:   `${process.env.SERVER_URL}/api/payment/success`,
    fail_url:      `${process.env.SERVER_URL}/api/payment/fail`,
    cancel_url:    `${process.env.SERVER_URL}/api/payment/cancel`,
    cus_name:      order.shippingAddress.name,
    cus_email:     order.user.email,
    cus_phone:     order.shippingAddress.phone,
    cus_add1:      order.shippingAddress.address,
    cus_city:      order.shippingAddress.city,
    product_name:  'VISO Sunglass',
    product_category: 'Eyewear',
    product_profile: 'physical-goods',
  };

  const sslcz = new SSLCommerzPayment(
    process.env.SSLCOMMERZ_STORE_ID,
    process.env.SSLCOMMERZ_STORE_PASS,
    process.env.NODE_ENV === 'production'  // false = sandbox
  );

  const response = await sslcz.init(data);
  return response.GatewayPageURL;
}
```

### bKash Integration (Optional)

```javascript
// bKash Merchant API
export async function bkashPayment(amount, orderId) {
  // Step 1: Token নাও
  const tokenRes = await axios.post(BKASH_TOKEN_URL, {
    app_key: process.env.BKASH_APP_KEY,
    app_secret: process.env.BKASH_APP_SECRET,
  }, { headers: { username: process.env.BKASH_USERNAME, password: process.env.BKASH_PASSWORD } });

  const token = tokenRes.data.id_token;

  // Step 2: Payment create করো
  const payRes = await axios.post(BKASH_CREATE_URL, {
    mode: '0011',
    payerReference: orderId,
    callbackURL: `${process.env.SERVER_URL}/api/payment/bkash/callback`,
    amount: amount.toString(),
    currency: 'BDT',
    intent: 'sale',
    merchantInvoiceNumber: orderId,
  }, { headers: { Authorization: token, 'X-APP-Key': process.env.BKASH_APP_KEY } });

  return payRes.data.bkashURL;
}
```

---

## 13. 3D Model Pipeline

### Blender দিয়ে Model বানানো

```
Step 1: Blender open করো (free, blender.org)
Step 2: Add → Mesh → Cylinder (frame base হিসেবে)
Step 3: Edit Mode এ shape দাও:
        - Lens shape (square/round/cat-eye)
        - Temple (কান পর্যন্ত যে অংশ)
        - Bridge (নাকের উপরে)
Step 4: Material assign করো:
        - Frame: Principled BSDF (metallic/plastic)
        - Lens: Glass BSDF + tint color
Step 5: Export → File → Export → glTF 2.0 (.glb)
        Settings:
        ✓ Include Animations
        ✓ Compress (Draco)
        ✓ Apply Modifiers
```

### Free 3D Model Sources

| Source | URL | Cost |
|--------|-----|------|
| Sketchfab | sketchfab.com | Free + Paid |
| TurboSquid | turbosquid.com | Free + Paid |
| Free3D | free3d.com | Free |
| CGTrader | cgtrader.com | Free + Paid |
| Poly Pizza | poly.pizza | Free |

### Model Optimization Checklist
- [ ] Polygon count < 10,000 (performance এর জন্য)
- [ ] File size < 500KB per model
- [ ] Draco compression apply করা
- [ ] Correct scale (real-world cm)
- [ ] Origin point = nose bridge center
- [ ] UV unwrap করা (texture এর জন্য)

---

## 14. Performance Optimization

### 3D / AR Performance
```javascript
// Lazy load 3D models
const { scene } = useGLTF.preload('/models/phantom-x.glb');

// PixelRatio limit করো (mobile তে)
<Canvas dpr={[1, 1.5]} />   // max 1.5x, default 2x

// Model LOD (Level of Detail)
import { Detailed } from '@react-three/drei';
<Detailed distances={[0, 50, 100]}>
  <HighPolyGlass />    // কাছে থাকলে
  <MidPolyGlass />     // মাঝারি দূরত্বে
  <LowPolyGlass />     // দূরে থাকলে
</Detailed>
```

### React Performance
```javascript
// Product list virtualize করো (1000+ product হলে)
import { FixedSizeGrid } from 'react-window';

// Image lazy load
<img loading="lazy" src={product.image} />

// Code splitting
const ARPage = lazy(() => import('./pages/ARTryOnPage'));
```

### Asset Optimization
```bash
# Images convert to WebP
npx sharp-cli --input "*.jpg" --output webp

# 3D models compress
gltf-transform optimize model.glb model.min.glb

# Gzip/Brotli (server side)
# Vercel/Netlify automatically করে
```

---

## 15. Deployment

### Frontend (Vercel) — Free
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd client
vercel

# Environment variables set করো Vercel dashboard এ:
VITE_API_URL=https://api.viso-eyewear.com
```

### Backend (Railway) — ~$5/month
```bash
# railway.app এ account খোলো
# GitHub repo connect করো
# Environment variables add করো:
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
SSLCOMMERZ_STORE_ID=...
AWS_ACCESS_KEY=...
```

### Domain Setup
```
viso-eyewear.com        → Vercel (Frontend)
api.viso-eyewear.com    → Railway (Backend)
```

### Environment Variables

```env
# client/.env
VITE_API_URL=http://localhost:5000

# server/.env
PORT=5000
MONGODB_URI=mongodb+srv://username:pass@cluster.mongodb.net/viso
JWT_SECRET=super_secret_key_here
CLIENT_URL=http://localhost:3000

# AWS S3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_BUCKET_NAME=viso-assets
AWS_REGION=ap-south-1

# SSLCommerz
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASS=your_pass

# bKash (optional)
BKASH_APP_KEY=your_key
BKASH_APP_SECRET=your_secret
BKASH_USERNAME=your_username
BKASH_PASSWORD=your_pass
```

---

## 16. Cost Estimate

### Development Cost (Monthly, Production)

| Service | Plan | Cost/Month |
|---------|------|-----------|
| Vercel (Frontend) | Hobby | Free |
| Railway (Backend) | Starter | ~$5 |
| MongoDB Atlas | M0 (512MB) | Free |
| MongoDB Atlas | M2 (2GB) | ~$9 |
| AWS S3 (3D models) | Pay per use | ~$2–5 |
| Cloudflare | Free | Free |
| **Total (MVP)** | | **~$16/month** |

### One-time Costs

| Item | Cost |
|------|------|
| Domain (.com) | ~$12/year |
| 3D Models (10টি premium) | ~$50–150 |
| SSLCommerz (setup fee) | ~৳5,000 |
| **Total** | **~$80–200** |

---

## Quick Start Commands

```bash
# Repository clone করো
git clone https://github.com/your-username/viso-eyewear.git
cd viso-eyewear

# Frontend setup
cd client
npm install
cp .env.example .env
npm run dev

# Backend setup (নতুন terminal)
cd server
npm install
cp .env.example .env
# .env এ MongoDB URI দাও
npm run dev

# দুটো চালু থাকলে:
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
```

---

## Useful Resources

| Resource | Link |
|----------|------|
| MediaPipe Face Mesh Docs | mediapipe.dev/solutions/face_mesh |
| React Three Fiber | docs.pmnd.rs/react-three-fiber |
| Three.js Examples | threejs.org/examples |
| Blender Tutorial | youtube.com → "Blender sunglass modeling" |
| SSLCommerz Docs | developer.sslcommerz.com |
| bKash API Docs | developer.bka.sh |
| MongoDB Atlas | mongodb.com/atlas |
| Vercel Deploy | vercel.com/docs |

---

*Plan prepared for VISO Eyewear AR E-Commerce Project*  
*Last updated: May 2025*
