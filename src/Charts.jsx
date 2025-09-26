// Utility function to clean and normalize ID strings
function cleanId(id, fallback = "untitled", index = 0) {
  if (!id) return `${fallback}-${index}`;
  return id
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, ""); // Remove non-alphanumeric except hyphens
}

const rawCharts = {
  air: [
    {
      title_ge:
        "სტაციონარული წყაროებიდან მავნე ნივთიერებების დაჭერა და გაფრქვევა რეგიონების მიხედვით",
      title_en:
        "Capture and emission of stationary sources of financial resources by regions",
      path_ge: "ჰაერის ხარისხი და გაფრქვევები",
      path_en: "air quality and emissions",
    },
    {
      title_ge:
        "სტაციონარული წყაროებიდან მავნე ნივთიერებების დაჭერა და გაფრქვევა ქალაქების მიხედვით",
      title_en:
        "Capture and emission of stationary sources of financial resources by cities",
      path_ge: "ჰაერის ხარისხი და გაფრქვევები",
      path_en: "air quality and emissions",
    },
    {
      title_ge:
        "მავნე ნივთიერებების გაფრქვევა: სტაციონარული და მობილური წყაროები",
      title_en: "Security Council Dispersion: Stationary and Mobile Sources",
      path_ge: "ჰაერის ხარისხი და გაფრქვევები",
      path_en: "air quality and emissions",
    },
  ],
  reports: [
    {
      title_ge: "რეპორტების ჩარტი",
      title_en: "reports charts",
      path_ge: "მატერიალური ნაკადის ანგარიშები",
      path_en: "Material Flow Accounts",
    },
  ],
  water: [
    {
      majors: [
        {
          title_ge: "ძირითადი მდინარეები",
          title_en: "Major rivers",
          path_ge: "საქართველოს მთავარი მდინარეები და ტბები",
          path_en: "Main Rivers and Lakes of Georgia",
        },
        {
          title_ge: "ძირითადი ტბები და წყალსაცავები",
          title_en: "Major lakes and reservoirs",
          path_ge: "საქართველოს მთავარი მდინარეები და ტბები",
          path_en: "Main Rivers and Lakes of Georgia",
        },
      ],
    },
    {
      protection: [],
    },
  ],
};

// Recursively normalize chart objects
function normalizeCharts(data, fallbackPrefix = "chart") {
  if (Array.isArray(data)) {
    return data.map((item, index) => {
      const keys = Object.keys(item);
      if (keys.length === 1 && Array.isArray(item[keys[0]])) {
        const key = keys[0];
        return {
          [key]: normalizeCharts(item[key], `${fallbackPrefix}-${key}`),
        };
      }

      return {
        ...item,
        id: item.id ?? cleanId(item.title_en, fallbackPrefix, index),
      };
    });
  }

  return data;
}

// Apply normalization to each top-level path
const Charts = Object.fromEntries(
  Object.entries(rawCharts).map(([path, charts]) => [
    path,
    normalizeCharts(charts, path),
  ])
);

export default Charts;
