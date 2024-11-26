import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface Command {
  command: string;
  description: string;
  usage?: string;
  action: (args?: string[]) => string[];
}

export const createCommands = (router: AppRouterInstance): Command[] => [
  {
    command: "help",
    description: "Show available commands",
    action: () => {
      const commandList = commands
        .map((cmd) => `${cmd.command}${cmd.usage ? ' ' + cmd.usage : ''}\n   ${cmd.description}`)
        .join('\n\n');
      return [
        "🚀 Available Commands:\n",
        commandList,
        "\nTip: Use Tab for command completion and Arrow keys for command history."
      ];
    },
  },
  {
    command: "clear",
    description: "Clear the terminal",
    action: () => [],
  },
  {
    command: "goto",
    description: "Navigate to a specific page",
    usage: "<page>",
    action: (args) => {
      if (!args?.length) {
        return [
          "Available pages:",
          "- home         → Home page",
          "- portfolio    → Portfolio page",
          "- blog         → Blog page",
          "- playground   → Playground page",
          "- resources    → Resources page",
          "- contact      → Contact page",
          "- settings     → Settings page",
          "\nUsage: goto <page>",
          "Example: goto blog"
        ];
      }

      const page = args[0].toLowerCase();
      const routes: { [key: string]: string } = {
        home: "/",
        portfolio: "/portfolio",
        blog: "/blog",
        playground: "/playground",
        resources: "/resources",
        contact: "/contact",
        settings: "/settings",
      };

      if (routes[page]) {
        router.push(routes[page]);
        return [`📍 Navigating to ${page}...`];
      }
      return [`❌ Unknown page: ${page}`];
    },
  },
  {
    command: "playground",
    description: "Navigate to playground sections",
    usage: "<section>",
    action: (args) => {
      if (!args?.length) {
        return [
          "Available playground sections:",
          "- challenges    → Coding challenges",
          "- leaderboard   → Global leaderboard",
          "- profile       → Your profile",
          "- resources     → Learning resources",
          "- paths         → Learning paths",
          "\nUsage: playground <section>",
          "Example: playground challenges"
        ];
      }

      const section = args[0].toLowerCase();
      const routes: { [key: string]: string } = {
        challenges: "/playground/challenges",
        leaderboard: "/playground/leaderboard",
        profile: "/playground/profile",
        resources: "/playground/resources",
        paths: "/playground/learning-paths",
      };

      if (routes[section]) {
        router.push(routes[section]);
        return [`🎮 Navigating to playground ${section}...`];
      }
      return [`❌ Unknown playground section: ${section}`];
    },
  },
  {
    command: "admin",
    description: "Navigate to admin sections",
    usage: "<section>",
    action: (args) => {
      if (!args?.length) {
        return [
          "Available admin sections:",
          "- dashboard    → Admin dashboard",
          "- blogs        → Manage blogs",
          "- projects     → Manage projects",
          "- challenges   → Manage challenges",
          "- resources    → Manage resources",
          "- newsletter   → Manage newsletter",
          "- testimonials → Manage testimonials",
          "- settings     → Admin settings",
          "\nUsage: admin <section>",
          "Example: admin blogs"
        ];
      }

      const section = args[0].toLowerCase();
      const routes: { [key: string]: string } = {
        dashboard: "/admin",
        blogs: "/admin/blogs",
        projects: "/admin/projects",
        challenges: "/admin/challenges",
        resources: "/admin/resources",
        newsletter: "/admin/newsletter",
        testimonials: "/admin/testimonials",
        settings: "/admin/settings",
      };

      if (routes[section]) {
        router.push(routes[section]);
        return [`👑 Navigating to admin ${section}...`];
      }
      return [`❌ Unknown admin section: ${section}`];
    },
  },
  {
    command: "auth",
    description: "Navigate to authentication pages",
    usage: "<action>",
    action: (args) => {
      if (!args?.length) {
        return [
          "Available auth actions:",
          "- signin       → Sign in",
          "- signup       → Sign up",
          "- forgot       → Forgot password",
          "- verify       → Verify email",
          "\nUsage: auth <action>",
          "Example: auth signin"
        ];
      }

      const action = args[0].toLowerCase();
      const routes: { [key: string]: string } = {
        signin: "/auth/signin",
        signup: "/auth/signup",
        forgot: "/auth/forgot-password",
        verify: "/auth/verify-email",
      };

      if (routes[action]) {
        router.push(routes[action]);
        return [`🔐 Navigating to ${action}...`];
      }
      return [`❌ Unknown auth action: ${action}`];
    },
  },
  {
    command: "back",
    description: "Go back to the previous page",
    action: () => {
      router.back();
      return ["⬅️ Going back..."];
    },
  },
  {
    command: "refresh",
    description: "Refresh the current page",
    action: () => {
      router.refresh();
      return ["🔄 Refreshing page..."];
    },
  },
  {
    command: "home",
    description: "Go to home page",
    action: () => {
      router.push("/");
      return ["🏠 Going home..."];
    },
  }
];

const commands = createCommands({} as AppRouterInstance);
