import React from 'react'
import { ThreeDMarquee } from '@/components/ui/3d-marquee';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    const images = [
        "https://blissful-dachshund-290.convex.cloud/api/storage/887f389c-05b7-4bfe-8ad0-1349123b4bc7",
        "https://blissful-dachshund-290.convex.cloud/api/storage/13fcbe17-4ce1-48d8-9ef3-972bd3041dc9",
        "https://blissful-dachshund-290.convex.cloud/api/storage/8e2749ea-a7b7-4924-ae8d-e487058ef480",

        "https://blissful-dachshund-290.convex.cloud/api/storage/bbf84eef-2820-4eeb-be15-d5e9a7e4bb48",
        "https://blissful-dachshund-290.convex.cloud/api/storage/fefacec0-f7a0-4a9b-8d7e-5ef592b20554",
        "https://blissful-dachshund-290.convex.cloud/api/storage/f9a7bd34-fee8-415b-a16d-6f1284674967",
        "https://blissful-dachshund-290.convex.cloud/api/storage/13fcbe17-4ce1-48d8-9ef3-972bd3041dc9",
        "https://blissful-dachshund-290.convex.cloud/api/storage/d120c318-b5b5-4fec-a5b1-013b8fc7c588",
        "https://blissful-dachshund-290.convex.cloud/api/storage/bbf84eef-2820-4eeb-be15-d5e9a7e4bb48",
        "https://blissful-dachshund-290.convex.cloud/api/storage/43d881cf-efc2-4082-9381-f7e078915a04",
        "https://blissful-dachshund-290.convex.cloud/api/storage/4ec12a50-c76f-490c-9779-f51f10e655ef",

        "https://assets.aceternity.com/cloudinary_bkp/3d-card.png",
        "https://assets.aceternity.com/animated-modal.png",
        "https://assets.aceternity.com/animated-testimonials.webp",
        "https://assets.aceternity.com/cloudinary_bkp/Tooltip_luwy44.png",
        "https://assets.aceternity.com/github-globe.png",
        "https://assets.aceternity.com/glare-card.png",
        "https://assets.aceternity.com/layout-grid.png",
        "https://assets.aceternity.com/flip-text.png",
        "https://assets.aceternity.com/hero-highlight.png",
        "https://assets.aceternity.com/carousel.webp",
        "https://assets.aceternity.com/placeholders-and-vanish-input.png",
        "https://assets.aceternity.com/shooting-stars-and-stars-background.png",
        "https://assets.aceternity.com/signup-form.png",
        "https://assets.aceternity.com/cloudinary_bkp/stars_sxle3d.png",
        "https://assets.aceternity.com/spotlight-new.webp",
        "https://assets.aceternity.com/cloudinary_bkp/Spotlight_ar5jpr.png",
        "https://assets.aceternity.com/cloudinary_bkp/Parallax_Scroll_pzlatw_anfkh7.png",
        "https://assets.aceternity.com/tabs.png",
        "https://assets.aceternity.com/cloudinary_bkp/Tracing_Beam_npujte.png",
        "https://assets.aceternity.com/cloudinary_bkp/typewriter-effect.png",
        "https://assets.aceternity.com/glowing-effect.webp",
        "https://assets.aceternity.com/hover-border-gradient.png",
        "https://assets.aceternity.com/cloudinary_bkp/Infinite_Moving_Cards_evhzur.png",
        "https://assets.aceternity.com/cloudinary_bkp/Lamp_hlq3ln.png",
        "https://assets.aceternity.com/macbook-scroll.png",
        "https://assets.aceternity.com/cloudinary_bkp/Meteors_fye3ys.png",
        "https://assets.aceternity.com/cloudinary_bkp/Moving_Border_yn78lv.png",
        "https://assets.aceternity.com/multi-step-loader.png",
        "https://assets.aceternity.com/vortex.png",
        "https://assets.aceternity.com/wobble-card.png",
        "https://assets.aceternity.com/world-map.webp",
      ];
      return (
        <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
          <div className="relative z-20 flex flex-wrap items-center justify-center gap-4 pt-4">
            {children}
          </div>
     
          {/* overlay */}
          <div className="absolute inset-0 z-10 h-full w-full bg-black/80 dark:bg-black/40" />
          <ThreeDMarquee
            className="pointer-events-none absolute inset-0 h-full w-full"
            images={images}
          />
        </div>
      );
}

export default AuthLayout