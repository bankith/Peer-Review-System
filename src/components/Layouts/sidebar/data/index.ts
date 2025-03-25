import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "eCommerce",
            url: "/main",
          },
        ],
      },
      {
        title: "Calendar",
        url: "/main/calendar",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "Profile",
        url: "/main/profile",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Forms",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Form Elements",
            url: "/main/forms/form-elements",
          },
          {
            title: "Form Layout",
            url: "/main/forms/form-layout",
          },
        ],
      },
      {
        title: "Tables",
        url: "/main/tables",
        icon: Icons.Table,
        items: [
          {
            title: "Tables",
            url: "/main/tables",
          },
        ],
      },
      {
        title: "Pages",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Settings",
            url: "/main/pages/settings",
          },
        ],
      },
    ],
  },
  {
    label: "OTHERS",
    items: [
      {
        title: "Charts",
        icon: Icons.PieChart,
        items: [
          {
            title: "Basic Chart",
            url: "/main/charts/basic-chart",
          },
        ],
      },
      {
        title: "UI Elements",
        icon: Icons.FourCircle,
        items: [
          {
            title: "Alerts",
            url: "/main/ui-elements/alerts",
          },
          {
            title: "Buttons",
            url: "/main/ui-elements/buttons",
          },
        ],
      },
      {
        title: "Authentication",
        icon: Icons.Authentication,
        items: [
          {
            title: "Sign In",
            url: "/main/auth/sign-in",
          },
        ],
      },
    ],
  },
];
