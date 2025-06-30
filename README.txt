Directory structure:
└── socialapp/
    ├── components.json
    ├── netlify.toml
    ├── next.config.mjs
    ├── package.json
    ├── pnpm-lock.yaml
    ├── pnpm-workspace.yaml
    ├── postcss.config.mjs
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── .eslintrc.json
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── api/
    │   │   └── payment/
    │   │       ├── callback/
    │   │       │   └── route.ts
    │   │       └── easypaisa/
    │   │           └── route.ts
    │   └── payment/
    │       ├── cancel/
    │       │   └── page.tsx
    │       └── success/
    │           └── page.tsx
    ├── components/
    │   ├── creditcard-offline-payment-form.tsx
    │   ├── easypaisa-payment-form.tsx
    │   ├── file-upload.tsx
    │   ├── footer.tsx
    │   ├── header.tsx
    │   ├── hero-section.tsx
    │   ├── orderCompletion.tsx
    │   ├── service-modal.tsx
    │   ├── services-section.tsx
    │   ├── theme-provider.tsx
    │   ├── trust-section.tsx
    │   └── ui/
    │       ├── accordion.tsx
    │       ├── alert-dialog.tsx
    │       ├── alert.tsx
    │       ├── aspect-ratio.tsx
    │       ├── avatar.tsx
    │       ├── badge.tsx
    │       ├── breadcrumb.tsx
    │       ├── button.tsx
    │       ├── calendar.tsx
    │       ├── card.tsx
    │       ├── carousel.tsx
    │       ├── chart.tsx
    │       ├── checkbox.tsx
    │       ├── collapsible.tsx
    │       ├── command.tsx
    │       ├── context-menu.tsx
    │       ├── dialog.tsx
    │       ├── drawer.tsx
    │       ├── dropdown-menu.tsx
    │       ├── form.tsx
    │       ├── hover-card.tsx
    │       ├── input-otp.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── menubar.tsx
    │       ├── navigation-menu.tsx
    │       ├── pagination.tsx
    │       ├── popover.tsx
    │       ├── progress.tsx
    │       ├── radio-group.tsx
    │       ├── resizable.tsx
    │       ├── scroll-area.tsx
    │       ├── select.tsx
    │       ├── separator.tsx
    │       ├── sheet.tsx
    │       ├── sidebar.tsx
    │       ├── skeleton.tsx
    │       ├── slider.tsx
    │       ├── sonner.tsx
    │       ├── switch.tsx
    │       ├── table.tsx
    │       ├── tabs.tsx
    │       ├── textarea.tsx
    │       ├── toast.tsx
    │       ├── toaster.tsx
    │       ├── toggle-group.tsx
    │       ├── toggle.tsx
    │       ├── tooltip.tsx
    │       ├── use-mobile.tsx
    │       └── use-toast.ts
    ├── hooks/
    │   ├── use-anime-on-scroll.ts
    │   ├── use-mobile.tsx
    │   └── use-toast.ts
    ├── lib/
    │   ├── easypaisa-config.ts
    │   ├── easypaisa-types.ts
    │   ├── easypaisa-utils.ts
    │   ├── service-prices.json
    │   └── utils.ts
    ├── netlify/
    │   └── functions/
    │       └── send-whatsapp.js
    ├── public/
    │   └── service-prices.json
    ├── styles/
    │   └── globals.css
    └── types/
        └── canvas-confetti.d.ts
