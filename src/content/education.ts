export type Education = {
  qualification: string;
  institution: string;
  location: string;
  start: number;
  end: number;
};

export const education: Education[] = [
  {
    qualification: "BSc Computer Science",
    institution: "Abasyn University",
    location: "Islamabad",
    start: 2020,
    end: 2024,
  },
  {
    qualification: "Intermediate in Pre-Engineering (F.Sc.)",
    institution: "Prince Salman College of Professional Education",
    location: "Islamabad",
    start: 2017,
    end: 2019,
  },
];

export const languages = {
  spoken: [
    { language: "Urdu", level: "Mother tongue" },
    {
      language: "English",
      level: "C1 listening, spoken production and writing. B2 reading and spoken interaction.",
    },
  ],
  ielts: {
    test: "IELTS Academic",
    /** ISO date */
    date: "2026-06-21",
    overall: { score: "6.5", cefr: "B2" },
    bands: [
      { label: "Listening", score: "7.5" },
      { label: "Speaking", score: "7.0" },
      { label: "Reading", score: "6.0" },
      { label: "Writing", score: "6.0" },
    ],
  },
} as const;
