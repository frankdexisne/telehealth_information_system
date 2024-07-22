const appointments = [
  {
    id: 0,
    title: "Watercolor Landscape",
    startDate: new Date(2024, 6, 23, 9, 30),
    endDate: new Date(2024, 6, 23, 11, 30),
    ownerId: 1,
    departments: [
      {
        id: 1,
        name: "Cardiology",
        scheduled: 10,
      },
      {
        id: 2,
        name: "OB-Gyne",
        scheduled: 20,
      },
      {
        id: 3,
        name: "Internal Medicine",
        scheduled: 5,
      },
    ],
  },
  {
    id: 1,
    title: "Scheduled (40)",
    startDate: new Date(2024, 5, 28, 8, 30),
    endDate: new Date(2024, 5, 28, 17, 30),
    ownerId: 5,
    departments: [
      {
        id: 2,
        name: "OB-Gyne",
        scheduled: 40,
      },
      {
        id: 3,
        name: "Internal Medicine",
        scheduled: 20,
      },
    ],
  },
];

export default appointments;
