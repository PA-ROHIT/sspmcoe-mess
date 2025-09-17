import type { Config } from &apos;tailwindcss&apos;

export default {
    darkMode: [&apos;class&apos;],
    content: [
    &apos;./app/**/*.{ts,tsx}&apos;,
    &apos;./components/**/*.{ts,tsx}&apos;,
    &apos;./pages/**/*.{ts,tsx}&apos;
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				&apos;50&apos;: &apos;#eff6ff&apos;,
  				&apos;100&apos;: &apos;#dbeafe&apos;,
  				&apos;200&apos;: &apos;#bfdbfe&apos;,
  				&apos;300&apos;: &apos;#93c5fd&apos;,
  				&apos;400&apos;: &apos;#60a5fa&apos;,
  				&apos;500&apos;: &apos;#3b82f6&apos;,
  				&apos;600&apos;: &apos;#2563eb&apos;,
  				&apos;700&apos;: &apos;#1d4ed8&apos;,
  				&apos;800&apos;: &apos;#1e40af&apos;,
  				&apos;900&apos;: &apos;#1e3a8a&apos;,
  				DEFAULT: &apos;hsl(var(--primary))&apos;,
  				foreground: &apos;hsl(var(--primary-foreground))&apos;
  			},
  			success: &apos;#10b981&apos;,
  			warning: &apos;#f59e0b&apos;,
  			danger: &apos;#ef4444&apos;,
  			background: &apos;hsl(var(--background))&apos;,
  			foreground: &apos;hsl(var(--foreground))&apos;,
  			card: {
  				DEFAULT: &apos;hsl(var(--card))&apos;,
  				foreground: &apos;hsl(var(--card-foreground))&apos;
  			},
  			popover: {
  				DEFAULT: &apos;hsl(var(--popover))&apos;,
  				foreground: &apos;hsl(var(--popover-foreground))&apos;
  			},
  			secondary: {
  				DEFAULT: &apos;hsl(var(--secondary))&apos;,
  				foreground: &apos;hsl(var(--secondary-foreground))&apos;
  			},
  			muted: {
  				DEFAULT: &apos;hsl(var(--muted))&apos;,
  				foreground: &apos;hsl(var(--muted-foreground))&apos;
  			},
  			accent: {
  				DEFAULT: &apos;hsl(var(--accent))&apos;,
  				foreground: &apos;hsl(var(--accent-foreground))&apos;
  			},
  			destructive: {
  				DEFAULT: &apos;hsl(var(--destructive))&apos;,
  				foreground: &apos;hsl(var(--destructive-foreground))&apos;
  			},
  			border: &apos;hsl(var(--border))&apos;,
  			input: &apos;hsl(var(--input))&apos;,
  			ring: &apos;hsl(var(--ring))&apos;,
  			chart: {
  				&apos;1&apos;: &apos;hsl(var(--chart-1))&apos;,
  				&apos;2&apos;: &apos;hsl(var(--chart-2))&apos;,
  				&apos;3&apos;: &apos;hsl(var(--chart-3))&apos;,
  				&apos;4&apos;: &apos;hsl(var(--chart-4))&apos;,
  				&apos;5&apos;: &apos;hsl(var(--chart-5))&apos;
  			}
  		},
  		borderRadius: {
  			lg: &apos;var(--radius)&apos;,
  			md: &apos;calc(var(--radius) - 2px)&apos;,
  			sm: &apos;calc(var(--radius) - 4px)&apos;
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")]
} satisfies Config


