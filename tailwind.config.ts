import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'sukhumvit': ['Sukhumvit Set', 'system-ui', '-apple-system', 'sans-serif'],
				'lato': ['Lato', 'system-ui', '-apple-system', 'sans-serif'],
				'noto-sc': ['Noto Sans SC', 'system-ui', '-apple-system', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				'education-blue': 'hsl(var(--education-blue))',
				'finance-green': 'hsl(var(--finance-green))',
				'warning-orange': 'hsl(var(--warning-orange))',
				'info-cyan': 'hsl(var(--info-cyan))'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
		keyframes: {
			'accordion-down': {
				from: { height: '0' },
				to: { height: 'var(--radix-accordion-content-height)' }
			},
			'accordion-up': {
				from: { height: 'var(--radix-accordion-content-height)' },
				to: { height: '0' }
			},
			'collapsible-down': {
				from: { height: '0', opacity: '0' },
				to: { height: 'var(--radix-collapsible-content-height)', opacity: '1' }
			},
			'collapsible-up': {
				from: { height: 'var(--radix-collapsible-content-height)', opacity: '1' },
				to: { height: '0', opacity: '0' }
			},
			'fade-in-up': {
				from: { opacity: '0', transform: 'translateY(10px)' },
				to: { opacity: '1', transform: 'translateY(0)' }
			},
			'fade-out-down': {
				from: { opacity: '1', transform: 'translateY(0)' },
				to: { opacity: '0', transform: 'translateY(10px)' }
			},
			'scale-bounce': {
				'0%, 100%': { transform: 'scale(1)' },
				'50%': { transform: 'scale(1.1)' }
			},
			'slide-in-bottom': {
				from: { transform: 'translateY(100%)' },
				to: { transform: 'translateY(0)' }
			},
			'slide-out-bottom': {
				from: { transform: 'translateY(0)' },
				to: { transform: 'translateY(100%)' }
			},
			'stagger-in': {
				from: { opacity: '0', transform: 'translateY(20px)' },
				to: { opacity: '1', transform: 'translateY(0)' }
			},
			'pulse-soft': {
				'0%, 100%': { opacity: '1' },
				'50%': { opacity: '0.7' }
			},
			'tap-bounce': {
				'0%': { transform: 'scale(1)' },
				'50%': { transform: 'scale(0.95)' },
				'100%': { transform: 'scale(1)' }
			},
			'slide-indicator': {
				from: { transform: 'scaleX(0)' },
				to: { transform: 'scaleX(1)' }
			},
			'count-up': {
				from: { opacity: '0', transform: 'translateY(8px)' },
				to: { opacity: '1', transform: 'translateY(0)' }
			}
		},
		animation: {
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out',
			'collapsible-down': 'collapsible-down 0.3s ease-out',
			'collapsible-up': 'collapsible-up 0.3s ease-out',
			'fade-in-up': 'fade-in-up 0.3s ease-out forwards',
			'fade-out-down': 'fade-out-down 0.3s ease-out forwards',
			'scale-bounce': 'scale-bounce 0.3s ease-out',
			'slide-in-bottom': 'slide-in-bottom 0.3s ease-out',
			'slide-out-bottom': 'slide-out-bottom 0.3s ease-out',
			'stagger-in': 'stagger-in 0.4s ease-out forwards',
			'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
			'tap-bounce': 'tap-bounce 0.15s ease-out',
			'slide-indicator': 'slide-indicator 0.2s ease-out forwards',
			'count-up': 'count-up 0.3s ease-out forwards'
		}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
