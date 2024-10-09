/** @type {import('tailwindcss').Config} */
module.exports = {
  // prefix: "tlink-",
  content: ["./src/**/*.{js,ts,jsx,tsx,html}"],
  safelist: process.env.NODE_ENV === "development" ? [{ pattern: /./ }] : [],
  theme: {
    extend: {
      colors: {
        accent: {
          brand: "#09CBBF",
          success: "#09CBBF",
          error: "#F62D2D",
          warning: "#FF9900"
        },
        twitter: {
          neutral: {
            100: "#0f1419",
            80: "#202327",
            70: "#2f3336",
            50: "#6E767D",
            40: "#C4C4C4",
            30: "#d9d9d9",
            20: "#eff3f4"
          },
          accent: "#1d9bf0",
          success: "#00c466",
          error: "#ff6f6f"
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      textColor: {
        primary: "#232324",
        secondary: "#434445",
        tertiary: "#737373",
        quaternary: "#888989",
        inverse: "#FFFFFF",
        icon: {
          primary: "#2A2A2B",
          secondary: "#888989",
          tertiary: "#B3B3B3",
          inverse: "#FFFFFF"
        }
      },
      borderColor: {
        primary: "#DEE1E7",
        secondary: "#EBEBEB"
      },
      fontSize: {
        highlight: ["1.5rem", "2rem"],
        text: ["0.938rem", "1.125rem"],
        subtext: ["0.813rem", "1rem"],
        caption: ["0.688rem", "0.875rem"]
      },
      boxShadow: {
        action:
          "0px 2px 8px 0px rgba(59, 176, 255, 0.22), 0px 1px 48px 0px rgba(29, 155, 240, 0.32)"
      }
    }
  },
  plugins: []
}
